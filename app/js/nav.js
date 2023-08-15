const navHome = document.querySelector("#navHome");
const navExplore = document.querySelector("#navExplore");
const navCreate = document.querySelector("#navCreate");
const navMessage = document.querySelector("#navMessage");
const navProfile = document.querySelector("#navProfile");

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
