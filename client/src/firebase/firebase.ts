// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-788b2.firebaseapp.com",
  projectId: "mern-estate-788b2",
  storageBucket: "mern-estate-788b2.appspot.com",
  messagingSenderId: "766799841792",
  appId: "1:766799841792:web:9065fe28ddddd3ef2166e5"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);