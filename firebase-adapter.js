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

  function tenantId() {
    return settings.tenantId || "computeck-demo";
  }

  function snapshotPath() {
    return ["tenants", tenantId(), "snapshots", "main"];
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

  async function loadDb(seedData) {
    if (!configured) return seedData;
    const ctx = await init();
    const libs = await loadLibs();
    const ref = libs.firestoreLib.doc(ctx.firestore, ...snapshotPath());
    const snap = await libs.firestoreLib.getDoc(ref);
    if (snap.exists() && snap.data().db) return snap.data().db;
    await libs.firestoreLib.setDoc(ref, {
      db: seedData,
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
        db: data,
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

  function aiSettings() {
    return settings.ai || {};
  }

  function aiModelName() {
    return aiSettings().model || "gemini-3.6-flash";
  }

  function aiEnabled() {
    return configured && aiSettings().enabled !== false;
  }

  async function getAiModel() {
    if (!aiEnabled()) throw new Error("IA nao configurada. Ative o Firebase AI Logic no projeto.");
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
    const model = await getAiModel();
    const filePart = await fileToGenerativePart(file);
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
    const result = await model.generateContent([prompt, filePart]);
    const text = result.response.text() || "";
    return parseJsonResponse(text);
  }

  async function generateRenewalLetter(contract, renewal = {}) {
    if (!contract) throw new Error("Selecione um contrato.");
    const model = await getAiModel();
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
    const result = await model.generateContent(prompt);
    return result.response.text() || "";
  }

  window.VendeGovCloud = {
    enabled: configured,
    settings,
    tenantId,
    init,
    signIn,
    signOut: signOutUser,
    loadDb,
    saveDb,
    uploadFile,
    aiEnabled,
    aiModelName,
    analyzeContractFile,
    generateRenewalLetter,
    currentUser: () => user || (auth ? auth.currentUser : null),
  };
})();
