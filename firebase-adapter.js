(function () {
  const sdkVersion = "12.17.1";
  const settings = window.VENDEGOV_FIREBASE_CONFIG || {};
  const firebaseConfig = settings.firebase || {};
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

  function tenantId() {
    return settings.tenantId || "computeck-demo";
  }

  function snapshotPath() {
    return ["tenants", tenantId(), "snapshots", "main"];
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

  async function loadDb(seedData) {
    if (!configured) return seedData;
    const ctx = await init();
    const libs = await loadLibs();
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

  function aiModelName() {
    return aiSettings().model || "gemini-3.6-flash";
  }

  function aiEndpoint() {
    return aiSettings().endpointUrl || aiSettings().endpoint || "";
  }

  function aiEnabled() {
    if (aiSettings().enabled === false) return false;
    if (aiProvider() === "firebase-ai-logic") return configured;
    return Boolean(aiEndpoint());
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
    init,
    signIn,
    resetPassword,
    signOut: signOutUser,
    loadDb,
    saveDb,
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
