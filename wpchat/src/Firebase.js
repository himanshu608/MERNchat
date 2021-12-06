
import { initializeApp } from "firebase/app";
import { getAuth  ,signInWithPopup } from 'firebase/auth';

const firebaseConfig = {
  "your firebase config"
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
