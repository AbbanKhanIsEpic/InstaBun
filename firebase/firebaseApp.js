// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDUY-K1dsxOvZ963mF1f_h3kX9OhkxKgB0",
  authDomain: "cogent-osprey-390319.firebaseapp.com",
  projectId: "cogent-osprey-390319",
  storageBucket: "cogent-osprey-390319.appspot.com",
  messagingSenderId: "594561475925",
  appId: "1:594561475925:web:43f3454f72bbe648edbbdc",
  measurementId: "G-DVEV20VF9C",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Cloud Storage and get a reference to the service
const storage = getStorage(app);

// Export function to initialize firebase.
export const initFirebase = () => {
  return app;
};
