import * as firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyC3NItiS_eYv-vihENNXISfHCIxpdk21oU",
  authDomain: "ic-admin-app-a8e50.firebaseapp.com",
  databaseURL: "https://ic-admin-app-a8e50.firebaseio.com",
  projectId: "ic-admin-app-a8e50",
  storageBucket: "ic-admin-app-a8e50.appspot.com",
  messagingSenderId: "158827447705",
  appId: "1:158827447705:web:8b095bca31eb0db4523f08",
  measurementId: "G-P0E0YFHRG4"
};
const firebaseConfigDeep = {
  // apiKey: "AIzaSyC9WTnCjkaHv6uG_VIPVQjhZxNDAh3uUMs",
  // authDomain: "ic-dev-deeps.firebaseapp.com",
  // databaseURL: "https://ic-dev-deeps.firebaseio.com",
  // projectId: "ic-dev-deeps",
  // storageBucket: "ic-dev-deeps.appspot.com",
  // messagingSenderId: "381324857844",
  // appId: "1:381324857844:web:6a7a30aad89c3cbbd1e9a1"


  apiKey: "AIzaSyA4rfW-sF-XklRvCZmqluu7Hy-SeV3iMBs",
  authDomain: "mytestapp-efbcb.firebaseapp.com",
  databaseURL: "https://mytestapp-efbcb.firebaseio.com",
  projectId: "mytestapp-efbcb",
  storageBucket: "mytestapp-efbcb.appspot.com",
  messagingSenderId: "255038662674",
  appId: "1:255038662674:web:b116097811af0d467250cb",
  measurementId: "G-VXHGJB35JF"
};

 
export const  myFirebase = firebase.initializeApp(firebaseConfigDeep);

export const firebaseAppAuth = myFirebase.auth();
export const providers = {
 // googleProvider: new firebase.auth.GoogleAuthProvider(),
  emailProvider : new firebase.auth.EmailAuthProvider()
};
export const Timestamp = firebase.firestore.FieldValue.serverTimestamp;
export const todosRef = firebase.firestore().collection("jobs")
export const getLastRecordRef = (collectionName) => firebase.firestore().collection(collectionName).orderBy("_createdDate","desc").limit(1)
export const admitCardsRef = firebase.firestore().collection("admitCards")
export const companiesRef = firebase.firestore().collection("companies")
export const resultsRef = firebase.firestore().collection("results")
export const logos = firebase.storage().ref().child("logos")
export const newsRef=firebase.firestore().collection("news")