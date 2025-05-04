import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { firebaseConfig } from "./config/firebaseConfig.js";

// const firebaseConfig = {
//     apiKey: "AIzaSyBiiY6kKU40xzdif9i55XkzKWpz7bMz1Vg", // Make sure this key is correct
//     authDomain: "your-project-id.firebaseapp.com",
//     projectId: "your-project-id",
//     storageBucket: "your-project-id.appspot.com",
//     messagingSenderId: "your-messaging-sender-id",
//     appId: "your-app-id",
//     measurementId: "your-measurement-id"
//   };
  

const app = initializeApp(firebaseConfig);
export const firebaseDB = getFirestore(app);
export const auth = getAuth(app);
