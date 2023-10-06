//Import
import { initFirebase } from "/app/js/firebase-setup.js";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
} from "https://www.gstatic.com/firebasejs/9.4.0/firebase-auth.js";

//Init global variables

const emailInput = document.querySelector("#emailInput");

const emailButton = document.querySelector("#emailButton");

const emailError = document.querySelector("#emailError");

const form = document.querySelector("#signUpForm");

const buttonSection = document.querySelector("#buttonSection");

const sendToLoginScreen = document.querySelector("#sendToLoginScreen");

//Event listener

emailButton.addEventListener("click", function () {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(emailInput.value)) {
    emailError.style.visibility = "visible";
    emailError.innerText = "This does not like an email";
  } else {
    doesEmailExist();
  }
});

function doesEmailExist() {
  const server = "http://127.0.0.1:5000/api/user/email";
  const query = `?email=${emailInput.value}`;

  fetch(server + query)
    .then((response) => response.json())
    .then((data) => {
      if (data) {
        emailError.style.visibility = "visible";
        emailError.innerText = "This email already exists";
      } else {
        emailError.style.visibility = "hidden";
        emailInput.readOnly = true;
        appendUsernameInput();
      }
    })
    .catch((error) => {
      // Handle any errors that occurred during the request
      console.error(error);
    });
}

function appendUsernameInput() {
  const usernameSection = document.createElement("section");
  usernameSection.id = "usernameSection";

  const heading3 = document.createElement("h3");
  heading3.innerText = "Username";

  const div = document.createElement("div");
  div.className = "input-group input-group-lg";

  const usernameInput = document.createElement("input");
  usernameInput.type = "text";
  usernameInput.id = "usernameInput";
  usernameInput.ariaLabel = "usernameInput";
  usernameInput.className = "form-control border-2 border-black";

  const viewUsernameInput = document.createElement("span");
  viewUsernameInput.className = "input-group-text";
  viewUsernameInput.role = "button";
  viewUsernameInput.id = "viewUsernameInput";
  viewUsernameInput.innerText = "Open";

  viewUsernameInput.addEventListener("click", function () {
    let nextView = viewUsernameInput.innerHTML == "Open" ? "Close" : "Open";
    viewUsernameInput.innerHTML = nextView;
    usernameInput.type = nextView == "Open" ? "text" : "password";
  });

  const usernameErrorMessage = document.createElement("p");
  usernameErrorMessage.className = "fw-bold text-danger";
  usernameErrorMessage.style.visibility = "hidden";
  usernameErrorMessage.id = "usernameError";

  const usernameButton = document.createElement("button");
  usernameButton.type = "button";
  usernameButton.className = "btn btn-primary btn-lg";
  usernameButton.id = "usernameButton";
  usernameButton.innerText = "Continue";

  emailButton.replaceWith(usernameButton);

  emailError.innerText = "";

  usernameButton.addEventListener("click", function () {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(usernameInput.value)) {
      usernameErrorMessage.style.visibility = "visible";
      usernameErrorMessage.innerText = "Must not be an email";
    } else if (usernameInput.value.length < 3) {
      usernameErrorMessage.style.visibility = "visible";
      usernameErrorMessage.innerText = "Username is too short";
    } else if (usernameInput.value.length > 100) {
      usernameErrorMessage.style.visibility = "visible";
      usernameErrorMessage.innerText = "Username is too long";
    } else {
      doesUsernameExist();
    }
  });

  function doesUsernameExist() {
    const usernameErrorMessage = document.querySelector("#usernameError");
    const usernameInput = document.querySelector("#usernameInput");
    const server = "http://127.0.0.1:5000/api/user/usernameExist";
    const query = `?username=${usernameInput.value}`;

    fetch(server + query)
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          usernameErrorMessage.style.visibility = "visible";
          usernameErrorMessage.innerText = "This email already exists";
        } else {
          usernameErrorMessage.style.visibility = "hidden";
          usernameInput.readOnly = true;
          appendPasswordInput();
        }
      })
      .catch((error) => {
        // Handle any errors that occurred during the request
        console.error(error);
      });
  }

  div.appendChild(usernameInput);
  div.appendChild(viewUsernameInput);

  usernameSection.appendChild(heading3);
  usernameSection.appendChild(div);
  usernameSection.appendChild(usernameErrorMessage);

  form.insertBefore(usernameSection, buttonSection);
}

function appendPasswordInput() {
  const passwordSection = document.createElement("section");
  passwordSection.id = "passwordSection";

  const heading3 = document.createElement("h3");
  heading3.innerText = "Password";

  const div = document.createElement("div");
  div.className = "input-group input-group-lg";

  const passwordInput = document.createElement("input");
  passwordInput.type = "password";
  passwordInput.id = "passwordInput";
  passwordInput.ariaLabel = "passwordInput";
  passwordInput.className = "form-control border-2 border-black";

  const viewPasswordInput = document.createElement("span");
  viewPasswordInput.className = "input-group-text";
  viewPasswordInput.role = "button";
  viewPasswordInput.id = "viewPasswordInput";
  viewPasswordInput.innerText = "Close";

  viewPasswordInput.addEventListener("click", function () {
    let nextView = viewPasswordInput.innerHTML == "Open" ? "Close" : "Open";
    viewPasswordInput.innerHTML = nextView;
    passwordInput.type = nextView == "Open" ? "text" : "password";
  });

  const signUpButton = document.createElement("button");
  signUpButton.type = "button";
  signUpButton.className = "btn btn-primary btn-lg";
  signUpButton.id = "signUpButton";
  signUpButton.innerText = "Sign up";

  const usernameButton = document.querySelector("#usernameButton");

  usernameButton.replaceWith(signUpButton);

  const passwordErrorMessage = document.createElement("p");
  passwordErrorMessage.className = "fw-bold text-danger";
  passwordErrorMessage.style.visibility = "hidden";
  passwordErrorMessage.id = "passwordError";

  const viewUsernameInput = document.querySelector("#viewUsernameInput");

  viewUsernameInput.parentNode.removeChild(viewUsernameInput);

  const usernameInput = document.querySelector("#usernameInput");

  usernameInput.type = "text";

  signUpButton.addEventListener("click", function () {
    console.log(passwordInput.value);
    if (passwordInput.value.length < 10) {
      passwordErrorMessage.style.visibility = "visible";
      passwordErrorMessage.innerText = "Password is too short";
    } else if (passwordInput.value.length > 200) {
      passwordErrorMessage.style.visibility = "visible";
      passwordErrorMessage.innerText = "Password is too long";
    } else if (!passwordInput.value.match(/[0-9]+/)) {
      passwordErrorMessage.style.visibility = "visible";
      passwordErrorMessage.innerText = "Password must contain digits";
    } else if (!passwordInput.value.match(/[A-Z]+/)) {
      passwordErrorMessage.style.visibility = "visible";
      passwordErrorMessage.innerText = "Password must contain capital letters";
    } else if (!passwordInput.value.match(/[a-z]+/)) {
      passwordErrorMessage.style.visibility = "visible";
      passwordErrorMessage.innerText =
        "Password must contain lowercase letters";
    } else if (!passwordInput.value.match(/[$@#&!]+/)) {
      passwordErrorMessage.style.visibility = "visible";
      passwordErrorMessage.innerText =
        "Password must contain special characters";
    } else {
      passwordErrorMessage.style.visibility = "hidden";
      signUpPopUp();
    }
  });

  async function signUpPopUp() {
    const app = initFirebase();
    const auth = getAuth(app);
    const googleProvider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, googleProvider);

      console.log(result);

      if (result.user.email == emailInput.value) {
        var dataObject = {
          username: usernameInput.value,
          displayName: result.user.displayName,
          password: passwordInput.value,
          profileIconLink: result.user.photoURL,
          emailAddress: result.user.email,
        };

        var jsonObject = JSON.stringify(dataObject);

        fetch("http://127.0.0.1:5000/api/user/createAccount", {
          method: "POST",
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
          body: jsonObject,
        })
          .then((response) => response.text())
          .then((responseData) => {
            alert("Account created");
            console.log("Response:", responseData);

            fetch(
              `http://127.0.0.1:5000/api/user/userID?username=${usernameInput.value}`
            )
              .then((response) => response.json())
              .then((data) => {
                setGlobalCookie("userID", data.UserID, 30);
                window.open(
                  "http://127.0.0.1:5501/app/mainscreen.html",
                  "_self"
                );
              })
              .catch((error) => {
                // Handle any errors that occurred during the request
                console.error(error);
              });
          })
          .catch((error) => {
            alert("Account not created");
            console.error("Error:", error);
          });
      } else {
        alert(
          `Sending email for verification code is too much \nSo, click button again for a popup \nSelect: ${emailInput.value}`
        );
      }
    } catch (error) {
      if (error.code === "auth/cancelled-popup-request") {
        // Handle the cancelled popup request error here
        console.log("Popup request cancelled by the user.");
      } else {
        console.log("Error occurred during authentication:", error);
      }
    }
  }

  div.appendChild(passwordInput);
  div.appendChild(viewPasswordInput);

  passwordSection.appendChild(heading3);
  passwordSection.appendChild(div);
  passwordSection.appendChild(passwordErrorMessage);

  form.insertBefore(passwordSection, buttonSection);
}

sendToLoginScreen.addEventListener("click", function () {
  window.open("http://127.0.0.1:5501/app/login.html", "_self");
});

//Function
function setGlobalCookie(name, value, expirationDays) {
  const date = new Date();
  date.setTime(date.getTime() + expirationDays * 24 * 60 * 60 * 1000);

  const expires = "expires=" + date.toUTCString();
  const domain = "domain=127.0.0.1";
  const path = "path=/"; // Cookie accessible from all paths

  document.cookie =
    name + "=" + value + ";" + expires + ";" + domain + ";" + path;
}
