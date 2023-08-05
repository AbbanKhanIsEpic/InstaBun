const emailInput = document.querySelector("#emailInput");

const emailButton = document.querySelector("#emailButton");

const emailError = document.querySelector("#emailError");

const form = document.querySelector("#signUpForm");

const buttonSection = document.querySelector("#buttonSection");

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
  const query = `?email="${emailInput.value}"`;

  fetch(server + query)
    .then((response) => response.json())
    .then((data) => {
      if (data[0]["count(*)"] == 1) {
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
    } else {
      doesUsernameExist();
    }
  });

  function doesUsernameExist() {
    const usernameErrorMessage = document.querySelector("#usernameError");
    const usernameInput = document.querySelector("#usernameInput");
    const server = "http://127.0.0.1:5000/api/user/username";
    const query = `?username="${usernameInput.value}"`;

    fetch(server + query)
      .then((response) => response.json())
      .then((data) => {
        if (data[0]["count(*)"] == 1) {
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

  const spacing = document.createElement("p");

  const signUpButton = document.createElement("button");
  signUpButton.type = "button";
  signUpButton.className = "btn btn-primary btn-lg";
  signUpButton.id = "signUpButton";
  signUpButton.innerText = "Sign up";

  const usernameButton = document.querySelector("#usernameButton");

  usernameButton.replaceWith(signUpButton);

  const usernameErrorMessage = document.querySelector("#usernameError");

  usernameErrorMessage.innerText = "";

  const viewUsernameInput = document.querySelector("#viewUsernameInput");

  viewUsernameInput.parentNode.removeChild(viewUsernameInput);

  const usernameInput = document.querySelector("#usernameInput");

  usernameInput.type = "text";

  signUpButton.addEventListener("click", function () {
    signUp();
  });

  function signUp() {}

  div.appendChild(passwordInput);
  div.appendChild(viewPasswordInput);

  passwordSection.appendChild(heading3);
  passwordSection.appendChild(div);
  passwordSection.appendChild(spacing);

  form.insertBefore(passwordSection, buttonSection);
}
