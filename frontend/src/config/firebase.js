// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth"
import { getFirestore, setDoc } from 'firebase/firestore'


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAqz2ZHSwx2KoYAgwhOqQkaB-yxGKJcpdo",
  authDomain: "chat-app-ssr.firebaseapp.com",
  projectId: "chat-app-ssr",
  storageBucket: "chat-app-ssr.appspot.com",
  messagingSenderId: "779626562109",
  appId: "1:779626562109:web:b2cecb8374412aba9b2054"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const signup = async(username , email, password) =>{
    try{
        const res = await createUserWithEmailAndPassword(auth, email, password);
        const user = res.user;
        
    }
    catch (error){

    }
}