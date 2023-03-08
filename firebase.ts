import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyD7I0ksUpBW4pNiZkkdF6bXDeFKX7e-ls4",
  authDomain: "chatgpt-318e8.firebaseapp.com",
  projectId: "chatgpt-318e8",
  storageBucket: "chatgpt-318e8.appspot.com",
  messagingSenderId: "708342772651",
  appId: "1:708342772651:web:5a3e1d486caef6559198ee",
  measurementId: "G-3V1M87SY61",
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
// const analytics = getAnalytics(app);

export { db };
