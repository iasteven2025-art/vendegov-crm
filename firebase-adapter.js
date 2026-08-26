(function () {
  const sdkVersion = "12.17.1";
  const settings = window.VENDEGOV_FIREBASE_CONFIG || {};
  const firebaseConfig = settings.firebase || {};
  const SUPERADMIN_EMAIL = "steven.passos@computeck.com.br";
  const configured =
    settings.enabled === true &&
    firebaseConfig.projectId &&
    firebaseConfig.projectId !== "SEU_PROJETO" &&
    firebaseConfig.apiKey &&
    firebaseConfig.apiKey !== "COLE_AQUI";

  let app = null;
  let auth = null;
  let firestore = null;
  let storage = null;
  let ai = null;
  let user = null;
  let libsPromise = null;
  let runtimeAiSettings = {};
  let tenantMeta = {};

  function normalizeTenantId(value) {
    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 48);
  }

  function normalizeEmail(value) {
    return String(value || "").trim().toLowerCase();
  }

  function superAdminEmail() {
    return SUPERADMIN_EMAIL;
  }

  function isSuperAdmin(userLike = auth?.currentUser || user) {
    return normalizeEmail(userLike?.email) === SUPERADMIN_EMAIL;
  }

  function tenantFromLocation() {
    const url = new URL(window.location.href);
    const pathMatch = url.pathname.match(/\/(?:t|tenant|grupo)\/([^/]+)/i);
    return url.searchParams.get("tenant") || url.searchParams.get("grupo") || (pathMatch ? pathMatch[1] : "");
  }

  const selectedTenantId = normalizeTenantId(tenantFromLocation() || settings.tenantId || "computeck-demo");

  function tenantId() {
    return selectedTenantId || "computeck-demo";
  }

  function tenantPath() {
    return ["tenants", tenantId()];
  }

  function snapshotPath() {
    return ["tenants", tenantId(), "snapshots", "main"];
  }

  function tenantUrl(id = tenantId()) {
    const cleanId = normalizeTenantId(id);
    const basePath = window.location.pathname.replace(/\/provisionar\.html$/i, "/").replace(/\/(?:t|tenant|grupo)\/[^/]+$/i, "/");
    const url = new URL(basePath || "/", window.location.origin);
    url.searchParams.set("tenant", cleanId);
    return url.toString();
  }

  function planDefinitions() {
    return {
      basico: {
        id: "basico",
        name: "Plano Basico",
        maxUsers: 2,
        maxCompanies: 1,
        description: "2 usuarios e 1 empresa do grupo",
      },
      intermediario: {
        id: "intermediario",
        name: "Plano Intermediario",
        maxUsers: 5,
        maxCompanies: 3,
        description: "5 usuarios e ate 3 empresas do grupo",
      },
      profissional: {
        id: "profissional",
        name: "Plano Profissional",
        maxUsers: 12,
        maxCompanies: 8,
        description: "12 usuarios e ate 8 empresas do grupo",
      },
      empresarial: {
        id: "empresarial",
        name: "Plano Empresarial",
        maxUsers: 30,
        maxCompanies: 20,
        description: "30 usuarios e ate 20 empresas do grupo",
      },
    };
  }

  function tenantInfo() {
    return { tenantId: tenantId(), url: tenantUrl(), ...(tenantMeta || {}) };
  }

  function publicTenantPath(id = tenantId()) {
    return ["tenants", normalizeTenantId(id), "public", "config"];
  }

  function tenantAccessFromDb(data = {}) {
    const rows = Array.isArray(data.usuarios) ? data.usuarios : [];
    const activeRows = rows.filter((item) => !["red", "bloqueado", "inativo"].includes(String(item.status || "").toLowerCase()));
    const allowedEmails = activeRows
      .map((item) => String(item.email || item.contactEmail || "").trim().toLowerCase())
      .filter(Boolean);
    const adminEmails = activeRows
      .filter((item) => /administrador|gestor/i.test(String(item.role || "")))
      .map((item) => String(item.email || item.contactEmail || "").trim().toLowerCase())
      .filter(Boolean);
    const currentEmail = auth?.currentUser?.email ? String(auth.currentUser.email).toLowerCase() : "";
    return {
      allowedEmails: [...new Set([...allowedEmails, currentEmail].filter(Boolean))],
      adminEmails: [...new Set([...(adminEmails.length ? adminEmails : [currentEmail]), currentEmail].filter(Boolean))],
    };
  }

  function cleanForFirestore(value) {
    if (value === undefined) return null;
    if (value === null) return null;
    if (value instanceof Date) return value.toISOString();
    if (Array.isArray(value)) return value.map((item) => cleanForFirestore(item));
    if (typeof value === "object") {
      if (typeof File !== "undefined" && value instanceof File) return null;
      if (typeof Blob !== "undefined" && value instanceof Blob) return null;
      const clean = {};
      Object.entries(value).forEach(([key, entry]) => {
        if (entry !== undefined && typeof entry !== "function") clean[key] = cleanForFirestore(entry);
      });
      return clean;
    }
    if (typeof value === "function") return null;
    return value;
  }

  function loadLibs() {
    if (!configured) return Promise.resolve(null);
    if (libsPromise) return libsPromise;
    libsPromise = Promise.all([
      import(`https://www.gstatic.com/firebasejs/${sdkVersion}/firebase-app.js`),
      import(`https://www.gstatic.com/firebasejs/${sdkVersion}/firebase-auth.js`),
      import(`https://www.gstatic.com/firebasejs/${sdkVersion}/firebase-firestore.js`),
      import(`https://www.gstatic.com/firebasejs/${sdkVersion}/firebase-storage.js`),
      import(`https://www.gstatic.com/firebasejs/${sdkVersion}/firebase-ai.js`),
    ]).then(([appLib, authLib, firestoreLib, storageLib, aiLib]) => ({
      appLib,
      authLib,
      firestoreLib,
      storageLib,
      aiLib,
    }));
    return libsPromise;
  }

  async function init() {
    if (!configured) return null;
    if (app) return { app, auth, firestore, storage };
    const libs = await loadLibs();
    app = libs.appLib.initializeApp(firebaseConfig);
    auth = libs.authLib.getAuth(app);
    firestore = libs.firestoreLib.getFirestore(app);
    storage = libs.storageLib.getStorage(app);
    libs.authLib.onAuthStateChanged(auth, (currentUser) => {
      user = currentUser;
    });
    return { app, auth, firestore, storage };
  }

  async function signIn(email, password) {
    if (!configured) return null;
    const ctx = await init();
    const libs = await loadLibs();
    try {
      const credential = await libs.authLib.signInWithEmailAndPassword(ctx.auth, email, password);
      user = credential.user;
      return user;
    } catch (error) {
      if (!settings.allowSignup) throw error;
      const credential = await libs.authLib.createUserWithEmailAndPassword(ctx.auth, email, password);
      user = credential.user;
      return user;
    }
  }

  async function signOutUser() {
    if (!configured || !auth) return;
    const libs = await loadLibs();
    await libs.authLib.signOut(auth);
    user = null;
  }

  async function resetPassword(email) {
    if (!configured) throw new Error("Firebase nao configurado.");
    const ctx = await init();
    const libs = await loadLibs();
    await libs.authLib.sendPasswordResetEmail(ctx.auth, email);
  }

  async function waitForAuth() {
    if (!configured) return null;
    const ctx = await init();
    const libs = await loadLibs();
    if (ctx.auth.currentUser) return ctx.auth.currentUser;
    return new Promise((resolve) => {
      const unsubscribe = libs.authLib.onAuthStateChanged(ctx.auth, (currentUser) => {
        user = currentUser;
        unsubscribe();
        resolve(currentUser);
      });
    });
  }

  async function loadPublicTenantConfig(id = tenantId()) {
    if (!configured) return null;
    const ctx = await init();
    const libs = await loadLibs();
    const ref = libs.firestoreLib.doc(ctx.firestore, ...publicTenantPath(id));
    const snap = await libs.firestoreLib.getDoc(ref);
    return snap.exists() ? snap.data() : null;
  }

  async function loadDb(seedData) {
    if (!configured) return seedData;
    const ctx = await init();
    const libs = await loadLibs();
    const tenantRef = libs.firestoreLib.doc(ctx.firestore, ...tenantPath());
    const tenantSnap = await libs.firestoreLib.getDoc(tenantRef);
    tenantMeta = tenantSnap.exists() ? tenantSnap.data() : { tenantId: tenantId(), name: tenantId() };
    const ref = libs.firestoreLib.doc(ctx.firestore, ...snapshotPath());
    const snap = await libs.firestoreLib.getDoc(ref);
    if (snap.exists() && snap.data().db) return snap.data().db;
    await libs.firestoreLib.setDoc(ref, {
      db: cleanForFirestore(seedData),
      tenantId: tenantId(),
      createdAt: libs.firestoreLib.serverTimestamp(),
      updatedAt: libs.firestoreLib.serverTimestamp(),
      updatedBy: user ? user.email : "bootstrap",
    });
    return seedData;
  }

  async function saveDb(data) {
    if (!configured || !auth || !auth.currentUser) return;
    const ctx = await init();
    const libs = await loadLibs();
    const ref = libs.firestoreLib.doc(ctx.firestore, ...snapshotPath());
    await libs.firestoreLib.setDoc(
      ref,
      {
        db: cleanForFirestore(data),
        tenantId: tenantId(),
        updatedAt: libs.firestoreLib.serverTimestamp(),
        updatedBy: auth.currentUser.email || auth.currentUser.uid,
      },
      { merge: true }
    );
  }

  async function uploadFile(moduleKey, recordId, file) {
    if (!configured || !auth || !auth.currentUser || !file) return null;
    const ctx = await init();
    const libs = await loadLibs();
    const cleanName = file.name.replace(/[^\w.\-]+/g, "-").slice(-120);
    const path = `tenants/${tenantId()}/${moduleKey}/${recordId}/${Date.now()}-${cleanName}`;
    const fileRef = libs.storageLib.ref(ctx.storage, path);
    await libs.storageLib.uploadBytes(fileRef, file, {
      contentType: file.type || "application/octet-stream",
      customMetadata: {
        tenantId: tenantId(),
        module: moduleKey,
        recordId,
      },
    });
    const url = await libs.storageLib.getDownloadURL(fileRef);
    return { name: file.name, path, url };
  }

  async function queueEmail(message) {
    if (!configured || !auth || !auth.currentUser || !message?.to) return null;
    const ctx = await init();
    const libs = await loadLibs();
    const ref = libs.firestoreLib.collection(ctx.firestore, "tenants", tenantId(), "outbox");
    const payload = {
      type: message.type || "email",
      renewalId: message.renewalId || "",
      contractId: message.contractId || "",
      client: message.client || "",
      contract: message.contract || "",
      to: message.to,
      cc: message.cc ? [message.cc] : [],
      message: {
        subject: message.subject || "VendeGov CRM",
        text: message.body || "",
      },
      status: "pending",
      createdAt: libs.firestoreLib.serverTimestamp(),
      updatedAt: libs.firestoreLib.serverTimestamp(),
      createdBy: auth.currentUser.email || auth.currentUser.uid,
    };
    const docRef = await libs.firestoreLib.addDoc(ref, payload);
    return docRef.id;
  }

  async function syncTenantAccess(data) {
    if (!configured || !auth || !auth.currentUser) return null;
    const ctx = await init();
    const libs = await loadLibs();
    const access = tenantAccessFromDb(data);
    const ref = libs.firestoreLib.doc(ctx.firestore, ...tenantPath());
    await libs.firestoreLib.setDoc(
      ref,
      {
        ...access,
        tenantId: tenantId(),
        updatedAt: libs.firestoreLib.serverTimestamp(),
        updatedBy: auth.currentUser.email || auth.currentUser.uid,
      },
      { merge: true }
    );
    tenantMeta = { ...tenantMeta, ...access };
    return access;
  }

  async function provisionTenant(options = {}) {
    if (!configured) throw new Error("Firebase nao configurado.");
    const ctx = await init();
    const libs = await loadLibs();
    if (!ctx.auth.currentUser) throw new Error("Entre com um usuario autorizado para criar ambientes.");
    if (!isSuperAdmin(ctx.auth.currentUser)) throw new Error("Apenas o superadmin pode criar ambientes.");
    const cleanTenantId = normalizeTenantId(options.tenantId || options.groupName || options.name);
    if (!cleanTenantId) throw new Error("Informe um nome valido para gerar a URL do grupo.");
    const plans = planDefinitions();
    const basePlan = plans[options.planId] || plans.basico;
    const plan = cleanForFirestore({ ...basePlan, ...(options.plan || {}) });
    const adminEmail = normalizeEmail(options.adminEmail || ctx.auth.currentUser.email || "");
    const ownerEmail = normalizeEmail(ctx.auth.currentUser.email || "");
    const allowedEmails = [...new Set([ownerEmail, adminEmail].filter(Boolean))];
    const adminEmails = allowedEmails;
    const branding = cleanForFirestore(options.branding || {});
    const loginCustomization = cleanForFirestore(options.loginCustomization || {});
    const publicConfig = cleanForFirestore({
      tenantId: cleanTenantId,
      name: String(options.groupName || options.name || cleanTenantId).trim(),
      version: "v1",
      branding,
      loginCustomization,
      plan: {
        id: plan.id,
        name: plan.name,
        description: plan.description,
      },
    });
    const tenantRef = libs.firestoreLib.doc(ctx.firestore, "tenants", cleanTenantId);
    const existing = await libs.firestoreLib.getDoc(tenantRef);
    if (existing.exists()) throw new Error("Ja existe um grupo com essa URL. Escolha outro identificador.");
    const meta = {
      tenantId: cleanTenantId,
      name: String(options.groupName || options.name || cleanTenantId).trim(),
      status: "active",
      planId: plan.id,
      plan,
      branding,
      loginCustomization,
      version: "v1",
      allowedEmails,
      adminEmails,
      createdBy: ownerEmail || ctx.auth.currentUser.uid,
      createdByUid: ctx.auth.currentUser.uid,
      createdAt: libs.firestoreLib.serverTimestamp(),
      updatedAt: libs.firestoreLib.serverTimestamp(),
    };
    await libs.firestoreLib.setDoc(tenantRef, meta);
    await libs.firestoreLib.setDoc(
      libs.firestoreLib.doc(ctx.firestore, "tenants", cleanTenantId, "members", ctx.auth.currentUser.uid),
      cleanForFirestore({
        email: ownerEmail,
        name: options.adminName || ownerEmail || "Administrador",
        role: "admin",
        status: "active",
        createdAt: new Date().toISOString(),
      })
    );
    if (options.adminUid) {
      await libs.firestoreLib.setDoc(
        libs.firestoreLib.doc(ctx.firestore, "tenants", cleanTenantId, "members", options.adminUid),
        cleanForFirestore({
          email: adminEmail,
          name: options.adminName || adminEmail || "Administrador",
          role: "admin",
          status: "active",
          createdAt: new Date().toISOString(),
        })
      );
    }
    await libs.firestoreLib.setDoc(libs.firestoreLib.doc(ctx.firestore, "tenants", cleanTenantId, "snapshots", "main"), {
      db: cleanForFirestore(options.seedDb || {}),
      tenantId: cleanTenantId,
      createdAt: libs.firestoreLib.serverTimestamp(),
      updatedAt: libs.firestoreLib.serverTimestamp(),
      updatedBy: ownerEmail || ctx.auth.currentUser.uid,
    });
    await libs.firestoreLib.setDoc(libs.firestoreLib.doc(ctx.firestore, ...publicTenantPath(cleanTenantId)), {
      ...publicConfig,
      updatedAt: libs.firestoreLib.serverTimestamp(),
    });
    return { tenantId: cleanTenantId, name: meta.name, planId: plan.id, plan, url: tenantUrl(cleanTenantId) };
  }

  async function createAuthUser(options = {}) {
    if (!configured) throw new Error("Firebase nao configurado.");
    const ctx = await init();
    const libs = await loadLibs();
    if (!isSuperAdmin(ctx.auth.currentUser)) throw new Error("Apenas o superadmin pode criar usuarios.");
    const email = normalizeEmail(options.email);
    const password = String(options.password || "");
    const displayName = String(options.displayName || options.name || "").trim();
    if (!email) throw new Error("Informe o e-mail do usuario administrador.");
    if (!password || password.length < 6) throw new Error("A senha do usuario deve ter pelo menos 6 caracteres.");
    const secondaryName = `vendegov-user-create-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const secondaryApp = libs.appLib.initializeApp(firebaseConfig, secondaryName);
    const secondaryAuth = libs.authLib.getAuth(secondaryApp);
    try {
      const credential = await libs.authLib.createUserWithEmailAndPassword(secondaryAuth, email, password);
      if (displayName) await libs.authLib.updateProfile(credential.user, { displayName });
      return {
        uid: credential.user.uid,
        email,
        displayName,
        created: true,
      };
    } catch (error) {
      if (String(error?.code || "").includes("email-already-in-use")) {
        return { uid: "", email, displayName, created: false, existing: true };
      }
      throw error;
    } finally {
      await libs.authLib.signOut(secondaryAuth).catch(() => {});
      await libs.appLib.deleteApp(secondaryApp).catch(() => {});
    }
  }

  function setAiConfig(config = {}) {
    runtimeAiSettings = { ...(config || {}) };
    ai = null;
  }

  function aiSettings() {
    return { ...(settings.ai || {}), ...(runtimeAiSettings || {}) };
  }

  function aiProvider() {
    return aiSettings().provider || "firebase-ai-logic";
  }

  function aiConnectionMode() {
    const config = aiSettings();
    if (config.connectionMode) return config.connectionMode;
    if (aiProvider() === "firebase-ai-logic") return "firebase-ai-logic";
    return config.apiKey ? "direct-api-key" : "secure-endpoint";
  }

  function aiApiKey() {
    return aiSettings().apiKey || aiSettings().directApiKey || "";
  }

  function aiModelName() {
    return aiSettings().model || "gemini-3.6-flash";
  }

  function aiEndpoint() {
    return aiSettings().endpointUrl || aiSettings().endpoint || "";
  }

  function aiEnabled() {
    if (aiSettings().enabled === false) return false;
    if (aiProvider() === "firebase-ai-logic" || aiConnectionMode() === "firebase-ai-logic") return configured;
    if (supportsDirectAi()) return true;
    return Boolean(aiEndpoint());
  }

  function supportsDirectAi() {
    return aiConnectionMode() === "direct-api-key" && aiProvider() === "google-gemini" && Boolean(aiApiKey());
  }

  async function getAiModel() {
    if (!aiEnabled() || aiProvider() !== "firebase-ai-logic") throw new Error("IA nao configurada. Confira Parametros > IA.");
    const ctx = await init();
    const libs = await loadLibs();
    if (!ai) ai = libs.aiLib.getAI(ctx.app, { backend: new libs.aiLib.GoogleAIBackend() });
    return libs.aiLib.getGenerativeModel(ai, { model: aiModelName() });
  }

  async function fileToGenerativePart(file) {
    const data = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error("Nao foi possivel ler o arquivo."));
      reader.onloadend = () => resolve(String(reader.result || "").split(",")[1] || "");
      reader.readAsDataURL(file);
    });
    return {
      inlineData: {
        data,
        mimeType: file.type || "application/pdf",
      },
    };
  }

  async function fileToBase64Payload(file) {
    const data = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error("Nao foi possivel ler o arquivo."));
      reader.onloadend = () => resolve(String(reader.result || "").split(",")[1] || "");
      reader.readAsDataURL(file);
    });
    return {
      name: file.name,
      mimeType: file.type || "application/pdf",
      size: file.size,
      data,
    };
  }

  async function customAiRequest(task, payload) {
    const endpoint = aiEndpoint();
    if (!endpoint) throw new Error("Endpoint seguro de IA nao configurado.");
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        task,
        provider: aiProvider(),
        model: aiModelName(),
        tenantId: tenantId(),
        payload,
      }),
    });
    const text = await response.text();
    if (!response.ok) throw new Error(text || "A IA retornou erro.");
    try {
      return JSON.parse(text);
    } catch {
      return { text };
    }
  }

  async function directGeminiRequest(prompt, filePayload = null) {
    const key = aiApiKey();
    if (!key) throw new Error("Chave da API Gemini nao configurada.");
    const model = encodeURIComponent(aiModelName());
    const parts = [{ text: prompt }];
    if (filePayload?.data) {
      parts.push({
        inlineData: {
          mimeType: filePayload.mimeType || "application/pdf",
          data: filePayload.data,
        },
      });
    }
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(key)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts }],
        generationConfig: { temperature: 0.2 },
      }),
    });
    const text = await response.text();
    if (!response.ok) {
      try {
        const parsed = JSON.parse(text);
        throw new Error(parsed.error?.message || "A API Gemini retornou erro.");
      } catch (error) {
        throw new Error(error.message || text || "A API Gemini retornou erro.");
      }
    }
    const json = JSON.parse(text);
    const answer = (json.candidates || [])
      .flatMap((candidate) => candidate.content?.parts || [])
      .map((part) => part.text || "")
      .filter(Boolean)
      .join("\n")
      .trim();
    if (!answer) throw new Error("A API Gemini nao retornou texto.");
    return answer;
  }

  function parseJsonResponse(text) {
    const clean = String(text || "").trim().replace(/^```(?:json)?/i, "").replace(/```$/i, "").trim();
    try {
      return JSON.parse(clean);
    } catch {
      const match = clean.match(/\{[\s\S]*\}/);
      if (match) return JSON.parse(match[0]);
      throw new Error("A IA respondeu, mas nao retornou JSON valido.");
    }
  }

  async function analyzeContractFile(file) {
    if (!file) throw new Error("Selecione um PDF de contrato.");
    if (file.size > 18 * 1024 * 1024) throw new Error("O PDF precisa ter ate 18 MB para analise direta.");
    const prompt = `
Voce e um assistente juridico-operacional do VendeGov CRM para empresas que vendem ao governo.
Leia o documento enviado e extraia os dados do contrato publico.
Responda somente JSON valido, sem markdown, neste formato:
{
  "numero_contrato": "",
  "contratante": "",
  "orgao_comprador": "",
  "tipo_orgao": "",
  "regiao": "",
  "contratada": "",
  "cnpj_contratada": "",
  "objeto": "",
  "fundamento_legal": "",
  "regime_legal": "",
  "natureza_contrato": "",
  "permite_prorrogacao": "",
  "valor_total": 0,
  "valor_mensal": 0,
  "data_inicio": "AAAA-MM-DD",
  "data_fim": "AAAA-MM-DD",
  "renovacao_prevista": "AAAA-MM-DD",
  "indice_reajuste": "",
  "prorrogavel": "",
  "obrigacoes_principais": [],
  "riscos": [],
  "resumo": ""
}
Use strings vazias quando uma informacao nao estiver no documento. Valores devem ser numero em reais, sem separador de milhar.`;
    if (aiProvider() !== "firebase-ai-logic") {
      if (supportsDirectAi()) {
        const text = await directGeminiRequest(prompt, await fileToBase64Payload(file));
        return parseJsonResponse(text);
      }
      if (aiConnectionMode() === "direct-api-key") {
        throw new Error("Chamada direta com chave API esta disponivel para Google Gemini. Selecione Google Gemini API ou use endpoint seguro.");
      }
      const custom = await customAiRequest("analyzeContractFile", {
        prompt,
        file: await fileToBase64Payload(file),
      });
      const parsed = custom.result || custom.data || custom;
      return typeof parsed === "string" ? parseJsonResponse(parsed) : parsed;
    }
    const model = await getAiModel();
    const filePart = await fileToGenerativePart(file);
    const result = await model.generateContent([prompt, filePart]);
    const text = result.response.text() || "";
    return parseJsonResponse(text);
  }

  async function generateRenewalLetter(contract, renewal = {}) {
    if (!contract) throw new Error("Selecione um contrato.");
    const prompt = `
Voce e o assistente de renovacoes do VendeGov CRM.
Gere uma carta profissional de renovacao contratual em portugues do Brasil, pronta para envio a uma empresa cliente.
Use tom executivo, claro e comercial, com assunto, saudacao, corpo, proximos passos e assinatura "Equipe VendeGov".
Nao invente dados ausentes; quando faltar algo, escreva de forma neutra.

Dados do contrato:
${JSON.stringify(contract, null, 2)}

Dados da renovacao vinculada:
${JSON.stringify(renewal || {}, null, 2)}
`;
    if (aiProvider() !== "firebase-ai-logic") {
      if (supportsDirectAi()) {
        return directGeminiRequest(prompt);
      }
      if (aiConnectionMode() === "direct-api-key") {
        throw new Error("Chamada direta com chave API esta disponivel para Google Gemini. Selecione Google Gemini API ou use endpoint seguro.");
      }
      const custom = await customAiRequest("generateRenewalLetter", {
        prompt,
        contract,
        renewal,
      });
      return custom.text || custom.letter || custom.result || "";
    }
    const model = await getAiModel();
    const result = await model.generateContent(prompt);
    return result.response.text() || "";
  }

  window.VendeGovCloud = {
    enabled: configured,
    settings,
    tenantId,
    tenantInfo,
    tenantUrl,
    normalizeTenantId,
    superAdminEmail,
    isSuperAdmin,
    planDefinitions,
    init,
    signIn,
    waitForAuth,
    resetPassword,
    signOut: signOutUser,
    loadPublicTenantConfig,
    loadDb,
    saveDb,
    syncTenantAccess,
    provisionTenant,
    createAuthUser,
    uploadFile,
    queueEmail,
    setAiConfig,
    aiEnabled,
    aiModelName,
    analyzeContractFile,
    generateRenewalLetter,
    currentUser: () => user || (auth ? auth.currentUser : null),
  };
})();
