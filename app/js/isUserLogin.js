function getCookie(name) {
  const cookies = document.cookie.split("; ");
  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.split("=");
    if (cookieName === name) {
      return decodeURIComponent(cookieValue);
    }
  }
  return null; // Cookie not found
}

const myCookieValue = getCookie("userID");

if (myCookieValue == null) {
  window.open("http://127.0.0.1:5501/app/signup.html", "_self");
}
