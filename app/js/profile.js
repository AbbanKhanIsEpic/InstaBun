const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

const username = urlParams.get("Username");

const currentUser = getCookie("userID");

let profileUserID;

const profileIcon = document.querySelector("#profileIcon");
const profileUsername = document.querySelector("#profileUsername");
const profileDisplayName = document.querySelector("#profileDisplayName");
const bio = document.querySelector("#bio");

const rowOfInteractive = document.querySelector("#rowOfInteractive");

fetch(`http://127.0.0.1:5000/api/user/userID?username=${username}`)
  .then((response) => response.json())
  .then((data) => {
    profileUserID = data[0].UserID;
    setProfile();
    if (currentUser == profileUserID) {
      attachSetting();
    } else {
      attachFollow();
    }
  })
  .catch((error) => {
    // Handle any errors that occurred during the request
    console.error(error);
  });

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

function attachSetting() {
  // Create the <span> element
  const spanElement = document.createElement("span");
  spanElement.className = "ms-3 mt-1";
  spanElement.role = "button";

  // Create the <svg> element
  const svgElement = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "svg"
  );
  svgElement.setAttribute("aria-label", "Options");
  svgElement.setAttribute("color", "rgb(245, 245, 245)");
  svgElement.setAttribute("fill", "rgb(245, 245, 245)");
  svgElement.setAttribute("height", "30");
  svgElement.setAttribute("role", "img");
  svgElement.setAttribute("viewBox", "0 0 24 24");
  svgElement.setAttribute("width", "30");

  // Create the <circle> element
  const circleElement = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "circle"
  );
  circleElement.setAttribute("cx", "12");
  circleElement.setAttribute("cy", "12");
  circleElement.setAttribute("fill", "none");
  circleElement.setAttribute("r", "8.635");
  circleElement.setAttribute("stroke", "currentColor");
  circleElement.setAttribute("stroke-linecap", "round");
  circleElement.setAttribute("stroke-linejoin", "round");
  circleElement.setAttribute("stroke-width", "2");

  // Create the <path> element
  const pathElement = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "path"
  );
  pathElement.setAttribute(
    "d",
    "M14.232 3.656a1.269 1.269 0 0 1-.796-.66L12.93 2h-1.86l-.505.996a1.269 1.269 0 0 1-.796.66m-.001 16.688a1.269 1.269 0 0 1 .796.66l.505.996h1.862l.505-.996a1.269 1.269 0 0 1 .796-.66M3.656 9.768a1.269 1.269 0 0 1-.66.796L2 11.07v1.862l.996.505a1.269 1.269 0 0 1 .66.796m16.688-.001a1.269 1.269 0 0 1 .66-.796L22 12.93v-1.86l-.996-.505a1.269 1.269 0 0 1-.66-.796M7.678 4.522a1.269 1.269 0 0 1-1.03.096l-1.06-.348L4.27 5.587l.348 1.062a1.269 1.269 0 0 1-.096 1.03m11.8 11.799a1.269 1.269 0 0 1 1.03-.096l1.06.348 1.318-1.317-.348-1.062a1.269 1.269 0 0 1 .096-1.03m-14.956.001a1.269 1.269 0 0 1 .096 1.03l-.348 1.06 1.317 1.318 1.062-.348a1.269 1.269 0 0 1 1.03.096m11.799-11.8a1.269 1.269 0 0 1-.096-1.03l.348-1.06-1.317-1.318-1.062.348a1.269 1.269 0 0 1-1.03-.096"
  );
  pathElement.setAttribute("fill", "none");
  pathElement.setAttribute("stroke", "currentColor");
  pathElement.setAttribute("stroke-linejoin", "round");
  pathElement.setAttribute("stroke-width", "2");

  // Append <circle> and <path> to the <svg> element
  svgElement.appendChild(circleElement);
  svgElement.appendChild(pathElement);

  // Append <svg> to the <span> element
  spanElement.appendChild(svgElement);

  // Append <span> to the span
  rowOfInteractive.appendChild(spanElement);
}

function setProfile() {
  fetch(`http://127.0.0.1:5000/api/user/profile?userID=${profileUserID}`)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      profileIcon.src = data[0].ProfileIconLink;
      profileIcon.alt = `${data[0].Username}'s profile picture`;
      profileUsername.textContent = data[0].Username;
      profileDisplayName.textContent = data[0].DisplayName;
      bio.textContent = data[0].Bio;
    })
    .catch((error) => {
      // Handle any errors that occurred during the request
      console.error(error);
    });
}

function attachFollow() {
  fetch(
    `http://127.0.0.1:5000/api/follow/following?currentID=${currentUser}&profileID=${profileUserID}`
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data[0]["count(*)"] == 0);
      let follow = data[0]["count(*)"] == 0 ? "Follow" : "Unfollow";
      //create follow button
      const followButton = document.createElement("button");
      followButton.className = "btn btn-primary";
      followButton.id = "followButton";
      followButton.textContent = follow;
      rowOfInteractive.appendChild(followButton);
    })
    .catch((error) => {
      // Handle any errors that occurred during the request
      console.error(error);
    });
}

function follow() {}
