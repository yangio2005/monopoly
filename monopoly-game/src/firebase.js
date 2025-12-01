// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, set, onValue, push, update, onDisconnect, runTransaction } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAUGeZCAgXv9agDvbXAmkNnRBaFurhbeOE",
  authDomain: "cotyphu2a.firebaseapp.com",
  databaseURL: "https://cotyphu2a-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "cotyphu2a",
  storageBucket: "cotyphu2a.firebasestorage.app",
  messagingSenderId: "450091737019",
  appId: "1:450091737019:web:5cc2d8fc4a8cfe355bee9e",
  measurementId: "G-5L07HP1NLJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

export { auth, database, ref, set, onValue, push, update, onDisconnect, runTransaction };
