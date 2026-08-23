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
    ]).then(([appLib, authLib, firestoreLib, storageLib]) => ({
      appLib,
      authLib,
      firestoreLib,
      storageLib,
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
    currentUser: () => user || (auth ? auth.currentUser : null),
  };
})();
