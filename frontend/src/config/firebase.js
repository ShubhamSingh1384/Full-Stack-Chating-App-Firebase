// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from "firebase/auth"
import { collection, doc, getDoc, getDocs, getFirestore, query, setDoc, where } from 'firebase/firestore'
// import { emit } from "process";
import { toast } from "react-toastify";


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
  console.log("signup called", username, email, password);
    try{
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const user = res.user;
      console.log("user uid : ", user.uid)
      await setDoc(doc(db, "users", user.uid), {
        id:user.uid,
        username: username.toLowerCase(),
        email,
        name:"",
        avatar:"",
        bio:"Hey, There i am using chat app",
        lastSeen:Date.now()
      })

      await setDoc(doc(db, "chats", user.uid),{
        chatsData:[]
      })
      toast.success("user created ❤️")
    }
    catch (error){
      console.log(error);
      toast.error(error.code);
    }
}

const login = async (email, password) =>{
  console.log("login called ", email, password)
  try {
    await signInWithEmailAndPassword(auth, email, password)
    toast.success("user LogedIn")
  } catch (error) {
    console.log(error);
    toast.error(error.code);
  }
  
}

const logout = async() =>{
  try {
    await signOut(auth)
    toast.success("loggedOut successfully")
  } catch (error) {
    console.log(error)
    toast.error(error.code);
  }
}

const resetPass = async (email)=>{
  if(!email){
    toast.error("Enter your email");
    return null;
  }
  try {
    const userRef = collection(db, 'users');
    const q = query(userRef, where("email", "==", email));
    const querySnap = await getDocs(q);
    if(!querySnap.empty){
      await sendPasswordResetEmail(auth, email);
      toast.success("Reset Email Sent")
    }
    else{
      toast.error("Email doesn't exists")
    }
  } catch (error) {
    console.error(error);
    toast.error(error.message);
  }
}

export{signup , login, logout, auth, db, resetPass}