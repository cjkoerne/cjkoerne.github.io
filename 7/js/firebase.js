
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";

import {
  getAuth,
  GoogleAuthProvider
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";

import {
  getFirestore
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAB2R4JaMLHZ8VEAyiaHUE33X0Xg4yu-jM",
  authDomain: "project-login-b4558.firebaseapp.com",
  projectId: "project-login-b4558",
  storageBucket: "project-login-b4558.firebasestorage.app",
  messagingSenderId: "446975076825",
  appId: "1:446975076825:web:f2c0a5a405c07a188511c8",
  measurementId: "G-Y8FXB5WF2P"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
