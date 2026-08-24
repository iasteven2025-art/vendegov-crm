import base64
import json
import os
import time
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import padding


PROJECT_ID = "vendegov-crm-computeck"
TENANT_ID = "computeck-demo"
SNAPSHOT_PATH = f"tenants/{TENANT_ID}/snapshots/main"
BACKUP_DIR = Path("maintenance-backups")


def b64url(data):
    return base64.urlsafe_b64encode(data).rstrip(b"=").decode("ascii")


def access_token():
    sa = json.loads(os.environ["FIREBASE_SERVICE_ACCOUNT_JSON"])
    now = int(time.time())
    header = {"alg": "RS256", "typ": "JWT"}
    payload = {
        "iss": sa["client_email"],
        "scope": "https://www.googleapis.com/auth/datastore https://www.googleapis.com/auth/cloud-platform",
        "aud": "https://oauth2.googleapis.com/token",
        "iat": now,
        "exp": now + 3600,
    }
    unsigned = (
        f"{b64url(json.dumps(header, separators=(',', ':')).encode())}."
        f"{b64url(json.dumps(payload, separators=(',', ':')).encode())}"
    ).encode("ascii")
    key = serialization.load_pem_private_key(sa["private_key"].encode("utf-8"), password=None)
    signature = key.sign(unsigned, padding.PKCS1v15(), hashes.SHA256())
    assertion = unsigned.decode("ascii") + "." + b64url(signature)
    data = urllib.parse.urlencode(
        {
            "grant_type": "urn:ietf:params:oauth:grant-type:jwt-bearer",
            "assertion": assertion,
        }
    ).encode("utf-8")
    req = urllib.request.Request(
        "https://oauth2.googleapis.com/token",
        data=data,
        headers={"Content-Type": "application/x-www-form-urlencoded"},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=60) as resp:
        return json.loads(resp.read().decode("utf-8"))["access_token"]


TOKEN = access_token()
BASE = f"https://firestore.googleapis.com/v1/projects/{PROJECT_ID}/databases/(default)/documents"
HEADERS = {"Authorization": f"Bearer {TOKEN}", "Content-Type": "application/json"}


def request(method, url, body=None):
    data = json.dumps(body).encode("utf-8") if body is not None else None
    req = urllib.request.Request(url, data=data, headers=HEADERS, method=method)
    try:
        with urllib.request.urlopen(req, timeout=90) as resp:
            raw = resp.read()
            return json.loads(raw.decode("utf-8")) if raw else {}
    except urllib.error.HTTPError as exc:
        detail = exc.read().decode("utf-8", "ignore")
        raise RuntimeError(f"Firestore HTTP {exc.code}: {detail[:1200]}") from exc


def fs_to_py(value):
    if not value or "nullValue" in value:
        return None
    if "stringValue" in value:
        return value["stringValue"]
    if "booleanValue" in value:
        return value["booleanValue"]
    if "integerValue" in value:
        return int(value["integerValue"])
    if "doubleValue" in value:
        return float(value["doubleValue"])
    if "timestampValue" in value:
        return value["timestampValue"]
    if "arrayValue" in value:
        return [fs_to_py(item) for item in value.get("arrayValue", {}).get("values", [])]
    if "mapValue" in value:
        return {
            key: fs_to_py(entry)
            for key, entry in value.get("mapValue", {}).get("fields", {}).items()
        }
    return None


def py_to_fs(value):
    if value is None:
        return {"nullValue": None}
    if isinstance(value, bool):
        return {"booleanValue": value}
    if isinstance(value, int) and not isinstance(value, bool):
        return {"integerValue": str(value)}
    if isinstance(value, float):
        return {"doubleValue": value}
    if isinstance(value, list):
        return {"arrayValue": {"values": [py_to_fs(item) for item in value]}}
    if isinstance(value, dict):
        return {
            "mapValue": {
                "fields": {
                    str(key): py_to_fs(entry)
                    for key, entry in value.items()
                    if entry is not None
                }
            }
        }
    return {"stringValue": str(value)}


def count_rows(db, key):
    rows = db.get(key)
    return len(rows) if isinstance(rows, list) else 0


def main():
    now = datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")
    doc = request("GET", f"{BASE}/{SNAPSHOT_PATH}")
    fields = doc.get("fields", {})
    db = fs_to_py(fields.get("db", {"mapValue": {"fields": {}}}))
    if not isinstance(db, dict):
        db = {}

    before = {
        "contratos": count_rows(db, "contratos"),
        "renovacoes": count_rows(db, "renovacoes"),
        "notificacoes": count_rows(db, "notificacoes"),
        "clientes": count_rows(db, "clientes"),
    }

    BACKUP_DIR.mkdir(exist_ok=True)
    backup_path = BACKUP_DIR / f"vendegov-before-clean-contracts-{now.replace(':', '-')}.json"
    backup_path.write_text(
        json.dumps({"createdAt": now, "tenantId": TENANT_ID, "counts": before, "db": db}, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )

    db["contratos"] = []
    db["renovacoes"] = []
    notifications = db.get("notificacoes") if isinstance(db.get("notificacoes"), list) else []
    db["notificacoes"] = [
        item
        for item in notifications
        if item.get("type") not in {"contract-expiry", "renewal-letter"}
        and not item.get("contractId")
        and not item.get("renewalId")
    ]
    db["audit"] = db.get("audit") if isinstance(db.get("audit"), list) else []
    db["audit"].insert(
        0,
        {
            "id": f"cleanup-contracts-{int(time.time())}",
            "at": now,
            "user": "GitHub Actions",
            "action": "Removeu contratos importados",
            "detail": (
                f"Contratos removidos: {before['contratos']}; "
                f"renovacoes removidas: {before['renovacoes']}; "
                f"notificacoes anteriores: {before['notificacoes']}"
            ),
        },
    )
    db["audit"] = db["audit"][:80]

    body = {
        "fields": {
            "db": py_to_fs(db),
            "tenantId": {"stringValue": TENANT_ID},
            "updatedAt": {"timestampValue": now},
            "updatedBy": {"stringValue": "maintenance-clean-imported-contracts"},
        }
    }
    request("PATCH", f"{BASE}/{SNAPSHOT_PATH}", body)

    after = {
        "contratos": count_rows(db, "contratos"),
        "renovacoes": count_rows(db, "renovacoes"),
        "notificacoes": count_rows(db, "notificacoes"),
        "clientes": count_rows(db, "clientes"),
    }
    print("Limpeza concluida.")
    print("Antes:", json.dumps(before, ensure_ascii=False))
    print("Depois:", json.dumps(after, ensure_ascii=False))
    print("Backup:", backup_path.as_posix())


if __name__ == "__main__":
    main()
