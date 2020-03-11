import * as firebase from "firebase";

const fbAdminDbConfig = {
  apiKey: "AIzaSyC3NItiS_eYv-vihENNXISfHCIxpdk21oU",
  authDomain: "ic-admin-app-a8e50.firebaseapp.com",
  databaseURL: "https://ic-admin-app-a8e50.firebaseio.com",
  projectId: "ic-admin-app-a8e50",
  storageBucket: "ic-admin-app-a8e50.appspot.com",
  messagingSenderId: "158827447705",
  appId: "1:158827447705:web:8b095bca31eb0db4523f08",
  measurementId: "G-P0E0YFHRG4"
};
const fbDevDeepDbConfig = {
  apiKey: "AIzaSyC9WTnCjkaHv6uG_VIPVQjhZxNDAh3uUMs",
  authDomain: "ic-dev-deeps.firebaseapp.com",
  databaseURL: "https://ic-dev-deeps.firebaseio.com",
  projectId: "ic-dev-deeps",
  storageBucket: "ic-dev-deeps.appspot.com",
  messagingSenderId: "381324857844",
  appId: "1:381324857844:web:6a7a30aad89c3cbbd1e9a1"
};
export const fbMasterDbConfig = {
  apiKey: "AIzaSyAlQGCmCVviLASvaBbTPRRHkOpPCqR6gUk",
  authDomain: "ic-master-db-e0eed.firebaseapp.com",
  databaseURL: "https://ic-master-db-e0eed.firebaseio.com",
  projectId: "ic-master-db-e0eed",
  storageBucket: "ic-master-db-e0eed.appspot.com",
  messagingSenderId: "381570728906",
  appId: "1:381570728906:web:6c3e358252aee388ec4533"
};

const firebasePreviewConfig = {
  apiKey: "AIzaSyDHMp63bz1tz8saSk8C8JWPELNufGhKfxE",
  authDomain: "ic-preview-env.firebaseapp.com",
  databaseURL: "https://ic-preview-env.firebaseio.com",
  projectId: "ic-preview-env",
  storageBucket: "ic-preview-env.appspot.com",
  messagingSenderId: "315145429877",
  appId: "1:315145429877:web:e7beffc7922c73a7dce93c"
};
const devENV = {
  apiKey: "AIzaSyDzkZPWklaDAO5V792XpFsiJJp9IVrLBQQ",
  authDomain: "ic-dev-env.firebaseapp.com",
  databaseURL: "https://ic-dev-env.firebaseio.com",
  projectId: "ic-dev-env",
  storageBucket: "ic-dev-env.appspot.com",
  messagingSenderId: "117131239639",
  appId: "1:117131239639:web:e13ad5572e691ff85b5092"
};

export const dbStaging = {
  apiKey: "AIzaSyB7piERZ9F_bFvJEjvcuiPXlp7i5BGd5u8",
  authDomain: "ic-staging-env.firebaseapp.com",
  databaseURL: "https://ic-staging-env.firebaseio.com",
  projectId: "ic-staging-env",
  storageBucket: "ic-staging-env.appspot.com",
  messagingSenderId: "1021560736528",
  appId: "1:1021560736528:web:1d0e1c42f55b4418013395"
};
export const dbProdConfig = {
  apiKey: "AIzaSyC1qIHiChEhq3m_4PXNaxGE64gRRYg2G_c",
  authDomain: "infinite-career.firebaseapp.com",
  databaseURL: "https://infinite-career.firebaseio.com",
  projectId: "infinite-career",
  storageBucket: "infinite-career.appspot.com",
  messagingSenderId: "170442517035",
  appId: "1:170442517035:web:575291c9fd4b10bbd2986e",
  measurementId: "G-C3KJC7ESGQ"
};
const firebaseYogiConfig = {
  apiKey: "AIzaSyBfcP-uSPqHPkqwfzRijehGl6qjkPQDHMc",
  authDomain: "ic-dev-yogi.firebaseapp.com",
  databaseURL: "https://ic-dev-yogi.firebaseio.com",
  projectId: "ic-dev-yogi",
  storageBucket: "ic-dev-yogi.appspot.com",
  messagingSenderId: "171392479553",
  appId: "1:171392479553:web:76ba52edee2669506671c0",
  measurementId: "G-X1LZJDW48Y"
};
const fbAdminDb = "dbAdmin";
const fbMasterDb = "dbMaster";
//debugger;
export const dbAdmin = firebase
  .initializeApp(fbAdminDbConfig, fbAdminDb)
  .firestore();
export const dbPreview = firebase
  .initializeApp(firebasePreviewConfig, "dbPreview")
  .firestore();
export const dbProd = firebase.initializeApp(dbProdConfig, "dbProd").firestore();
export const dbDevDeeps = firebase.initializeApp(fbDevDeepDbConfig,"dev-deep").firestore();
export const dbYogi = firebase.initializeApp(firebaseYogiConfig,"yogi").firestore();
export const dbDevEnv = firebase.initializeApp(devENV,"dev-env").firestore();

export const dbMaster = firebase
  .initializeApp(fbMasterDbConfig, fbMasterDb)
  .firestore();

//export const fbInstances  = {dbAdmin,dbMaster,dbProd} 
export const fbInstances  = {  dbAdmin:dbDevDeeps,dbMaster:dbYogi,dbProd:dbDevEnv};