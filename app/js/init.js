//This gets all the user related data of the user
//Also set the nav bar
const navHome = document.querySelector("#navHome");
const navExplore = document.querySelector("#navExplore");
const navCreate = document.querySelector("#navCreate");
const navMessage = document.querySelector("#navMessage");
const navProfile = document.querySelector("#navProfile");
const navProfileIcon = document.querySelector("#navProfileIcon");

let currentUserProfileLink = "";
let currentUserUsername = "";

function getCookie(name) {
  const cookies = document.cookie.split("; ");
  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.split("=");
    if (cookieName === name) {
      return decodeURIComponent(cookieValue);
    }
  }
  return null;
}

const currentUserUserID = getCookie("userID");

if (currentUserUserID == null) {
  window.open("http://127.0.0.1:5501/app/signup.html", "_self");
}

fetch(`http://127.0.0.1:5000/api/user/profileIcon?userID=${currentUserUserID}`)
  .then((response) => response.json())
  .then((data) => {
    currentUserProfileLink = data.ProfileIconLink;
    navProfileIcon.src = currentUserProfileLink;
  })
  .catch((error) => {
    // Handle any errors that occurred during the request
    console.error(error);
  });

fetch(`http://127.0.0.1:5000/api/user/username?userID=${currentUserUserID}`)
  .then((response) => response.json())
  .then((data) => {
    currentUserUsername = data.Username;
  })
  .catch((error) => {
    // Handle any errors that occurred during the request
    console.error(error);
  });

navHome.addEventListener("click", function () {
  window.open("http://127.0.0.1:5501/app/mainscreen.html", "_self");
});

navExplore.addEventListener("click", function () {
  window.open("http://127.0.0.1:5501/app/explore.html", "_self");
});

navCreate.addEventListener("click", function () {
  window.open("http://127.0.0.1:5501/app/create.html", "_self");
});

navMessage.addEventListener("click", function () {
  window.open("http://127.0.0.1:5501/app/message.html", "_self");
});

navProfile.addEventListener("click", function () {
  window.open("http://127.0.0.1:5501/app/profile.html", "_self");
});
