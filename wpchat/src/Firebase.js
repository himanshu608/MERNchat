// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCNGVMXUGgenrtrsnbks8uiJKCK1bx5F4I",
  authDomain: "authentication-mernchat.firebaseapp.com",
  projectId: "authentication-mernchat",
  storageBucket: "authentication-mernchat.appspot.com",
  messagingSenderId: "284361481961",
  appId: "1:284361481961:web:ef58f1ad3b51d3b6f1da78"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth  = getAuth(app);