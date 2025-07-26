import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { initializeApp } from "firebase/app";


const firebaseConfig = {
  apiKey: "AIzaSyD88sogYHeyDjvz2p1sXGUhi-8h8UQGYXk",
  authDomain: "tryproject-93d1d.firebaseapp.com",
  projectId: "tryproject-93d1d",
  storageBucket: "tryproject-93d1d.firebasestorage.app",
  messagingSenderId: "833439739361",
  appId: "1:833439739361:web:fb001937fda7d63eacf6a0"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();


export { auth, provider, signInWithPopup, signOut };