import { initFirebase } from "/firebase/firebaseApp";
import { getAuth, sendEmailVerification } from "firebase/auth";
import { firebaseApp } from "/firebase/firebaseApp";

export default async function veriEmail() {
  initFirebase();
  const auth = getAuth(firebaseApp);
  sendEmailVerification(auth.currentUser).then(() => {
    // Email verification sent!
    // ...
  });
}
