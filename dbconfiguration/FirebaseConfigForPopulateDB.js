import * as firebase from "firebase";

 const fbMasterDbConfig = {
    apiKey: "AIzaSyA4rfW-sF-XklRvCZmqluu7Hy-SeV3iMBs",
    authDomain: "mytestapp-efbcb.firebaseapp.com",
    databaseURL: "https://mytestapp-efbcb.firebaseio.com",
    projectId: "mytestapp-efbcb",
    storageBucket: "mytestapp-efbcb.appspot.com",
    messagingSenderId: "255038662674",
    appId: "1:255038662674:web:b116097811af0d467250cb",
    measurementId: "G-VXHGJB35JF"
  };

 const dest = {
  apiKey: "AIzaSyBfcP-uSPqHPkqwfzRijehGl6qjkPQDHMc",
  authDomain: "ic-dev-yogi.firebaseapp.com",
  databaseURL: "https://ic-dev-yogi.firebaseio.com",
  projectId: "ic-dev-yogi",
  storageBucket: "ic-dev-yogi.appspot.com",
  messagingSenderId: "171392479553",
  appId: "1:171392479553:web:76ba52edee2669506671c0",
  measurementId: "G-X1LZJDW48Y"
};

const fbMasterDb = "dbMaster";
const fbDevnDb = "Dev DB";
export const Destination = firebase.initializeApp(dest, fbDevnDb).firestore();
 export default  Destination;
