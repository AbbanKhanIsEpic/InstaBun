const searchForUsers = document.querySelector("#searchForUsers");
const searchForPosts = document.querySelector("#searchForPosts");
const display = document.querySelector("#display");
const search = document.querySelector("#search");
const searchInput = document.querySelector("#SearchInput");
const showcase = document.querySelector("#showcase");

searchForUsers.addEventListener("click", function () {
  display.textContent = "Users";
  clear();
});

searchForPosts.addEventListener("click", function () {
  display.textContent = "Posts";
  clear();
});

function clear() {
  while (showcase.firstChild) {
    showcase.removeChild(showcase.firstChild);
  }
}

search.addEventListener("click", function () {
  const userID = getCookie("userID");
  const search = searchInput.value;
  if (display.textContent == "Users") {
    searchUsers(userID, search);
  } else {
  }
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

function searchUsers(userID, search) {
  const server = "http://127.0.0.1:5000/api/user/search";
  const query = `?userID=${userID}&searchUser=${search}`;

  fetch(server + query)
    .then((response) => response.json())
    .then((data) => {
      data.forEach(function (element) {
        // Create a div element
        const divElement = document.createElement("div");
        divElement.style.width = "400px";
        divElement.style.height = "70px";
        divElement.className = "mb-4";
        divElement.role = "button";

        // Create an img element
        const imgElement = document.createElement("img");
        imgElement.alt = `${element.Username}'s profile picture`;
        imgElement.draggable = false;
        imgElement.src = element.ProfileIconLink;
        imgElement.setAttribute("width", "60px");
        imgElement.setAttribute("height", "60px");
        imgElement.className = "rounded-circle";

        // Create the first span element
        const spanElement1 = document.createElement("span");
        spanElement1.className = "ms-2 display-6";
        spanElement1.textContent = element.Username;

        // Create the second span element
        const spanElement2 = document.createElement("span");
        spanElement2.textContent = element.DisplayName;
        spanElement2.className = "ms-2";

        // Append all elements to the div
        divElement.appendChild(imgElement);
        divElement.appendChild(spanElement1);
        divElement.appendChild(spanElement2);

        // Append the div to the main's first child
        showcase.appendChild(divElement);

        //Add event listener to send user to the profile screen of the clicked user
        divElement.addEventListener("click", function (event) {
          const selectedUser = event.currentTarget.childNodes[1].textContent;
          window.open(
            `http://127.0.0.1:5501/app/profile.html?Username=${selectedUser}`,
            "_blank"
          );
        });
      });
    })
    .catch((error) => {
      // Handle any errors that occurred during the request
      console.error(error);
    });
}
