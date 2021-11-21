
import { initializeApp } from "firebase/app";
import { getAuth  ,signInWithPopup } from 'firebase/auth';

const firebaseConfig = {
  apiKey: `AIzaSyCNGVMXUGgenrtrsnbks8uiJKCK1bx5F4I`,
  authDomain: "authentication-mernchat.firebaseapp.com",
  projectId: "authentication-mernchat",
  storageBucket: "authentication-mernchat.appspot.com",
  messagingSenderId: "284361481961",
  appId: "1:284361481961:web:dcf0e77d2c6214d3f1da78"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)

//get firebase authentication information
export const auth = getAuth(app)


//function for social media login or signup
export const gAuth = (authprovider)=>{
  signInWithPopup(auth,authprovider)
  .catch(err=>{console.error(err)})
}