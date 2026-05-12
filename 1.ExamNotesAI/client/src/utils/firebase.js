
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "authexamnotesai-c697d.firebaseapp.com",
  projectId: "authexamnotesai-c697d",
  storageBucket: "authexamnotesai-c697d.firebasestorage.app",
  messagingSenderId: "1014618022842",
  appId: "1:1014618022842:web:99db5dd4364fd0329a3383"
};

const app = initializeApp(firebaseConfig);

const auth=getAuth(app);

const provider=new GoogleAuthProvider();

export {auth , provider}