const togglePasswordView = document.querySelector("#viewPasswordInput");
const passwordInput = document.querySelector("#PasswordInput");

const toggleInputView = document.querySelector("#viewUsernameInput");
const inputInput = document.querySelector("#UsernameInput");

const loginButton = document.querySelector("#loginButton");

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
        let firstError = "Username";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailRegex.test(inputInput.value)) {
          firstError = "Email";
        }
        const loginError = document.getElementById("LoginError");
        const loginErrorMessage = document.getElementById("ErrorMessage");
        loginErrorMessage.innerText = `${firstError} or password incorrect`;
        loginError.style.visibility = "visible";
      } else {
        console.log("Epic");
      }
    })
    .catch((error) => {
      // Handle any errors that occurred during the request
      console.error(error);
    });
});
