import { initFirebase } from "/app/js/firebase-setup.js";
import {
  getAuth,
  sendPasswordResetEmail,
  signInWithPopup,
  GoogleAuthProvider,
} from "https://www.gstatic.com/firebasejs/9.4.0/firebase-auth.js";

const app = initFirebase();
const auth = getAuth(app);

const togglePasswordView = document.querySelector("#viewPasswordInput");
const passwordInput = document.querySelector("#PasswordInput");

const toggleInputView = document.querySelector("#viewUsernameInput");
const inputInput = document.querySelector("#UsernameInput");

const loginButton = document.querySelector("#loginButton");

const passwordChange = document.querySelector("#passwordChange");

togglePasswordView.addEventListener("click", function () {
  let nextView = togglePasswordView.innerHTML == "Open" ? "Close" : "Open";
  togglePasswordView.innerHTML = nextView;
  passwordInput.type = nextView == "Open" ? "text" : "password";
});

toggleInputView.addEventListener("click", function () {
  let nextView = toggleInputView.innerHTML == "Open" ? "Close" : "Open";
  toggleInputView.innerHTML = nextView;
  inputInput.type = nextView == "Open" ? "text" : "password";
});

loginButton.addEventListener("click", function () {
  const server = "http://127.0.0.1:5000/api/user/login";
  const query = `?username='${inputInput.value}'&password='${passwordInput.value}'`;

  fetch(server + query)
    .then((response) => response.json())
    .then((data) => {
      if (data[0]["count(*)"] == 0) {
        const loginError = document.getElementById("LoginError");
        loginError.style.visibility = "visible";
      } else {
        console.log("Epic");
        setGlobalCookie("userID", "cookieValue", 30);
      }
    })
    .catch((error) => {
      // Handle any errors that occurred during the request
      console.error(error);
    });
});
async function getUserID() {}
function setGlobalCookie(name, value, expirationDays) {
  const date = new Date();
  date.setTime(date.getTime() + expirationDays * 24 * 60 * 60 * 1000);

  const expires = "expires=" + date.toUTCString();
  const domain = "domain=127.0.0.1"; // Replace with your domain
  const path = "path=/"; // Cookie accessible from all paths

  document.cookie =
    name + "=" + value + ";" + expires + ";" + domain + ";" + path;
}

passwordChange.addEventListener("click", function () {
  sendEmail();
});

async function sendEmail() {
  const googleProvider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, googleProvider);

    console.log(result);

    console.log(auth.currentUser.email);
    sendPasswordResetEmail(auth, auth.currentUser.email)
      .then(() => {
        // Password reset email sent!
        // ..
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
      });
  } catch (error) {
    if (error.code === "auth/cancelled-popup-request") {
      // Handle the cancelled popup request error here
      console.log("Popup request cancelled by the user.");
    } else {
      console.log("Error occurred during authentication:", error);
    }
  }
}
