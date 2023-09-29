//Import
import { displayPost } from "./post.js";

//Init global variables
const searchForUsers = document.querySelector("#searchForUsers");
const searchForPosts = document.querySelector("#searchForPosts");
const display = document.querySelector("#display");
const search = document.querySelector("#search");
const searchInput = document.querySelector("#SearchInput");
const showcase = document.querySelector("#showcase");

//This is to check if the user is viewing a shared post
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

const sharedPost = urlParams.get("postID");

//If user is not viewing a post that is shared
//Show them top 10 post that is recommended to them
if (sharedPost == null) {
  showRecommendedPost();
} else {
  //If they are viewing a post that is shared
  //Show that video
  fetch(
    `http://127.0.0.1:5000/api/post/select?userID=${currentUserUserID}&postID=${sharedPost}`
  )
    .then((response) => response.json())
    .then((data) => {
      data.map((post) => {
        displayPost(post);
      });
    })
    .catch((error) => {
      // Handle any errors that occurred during the request
      console.error(error);
    });
}

//Event listerners

searchForUsers.addEventListener("click", function () {
  clear();
  display.textContent = "Users";
});

searchForPosts.addEventListener("click", function () {
  clear();
  display.textContent = "Posts";
  showRecommendedPost();
});

search.addEventListener("click", function () {
  clear();
  const search = searchInput.value;
  if (display.textContent == "Users") {
    searchUsers(search);
  } else {
    searchPost(search);
  }
});

//Functions

function clear() {
  while (showcase.childNodes[0]) {
    showcase.removeChild(showcase.childNodes[0]);
  }
}

function searchPost(search) {
  clear();
  const tagsArray = search.trim().split(" ");
  if (tagsArray.length === 0) {
    alert("Can not search for a post with no tag");
  } else {
    const server = "http://127.0.0.1:5000/api/post/search";
    const query = `?userID=${currentUserUserID}&tags=${tagsArray}`;

    fetch(server + query)
      .then((response) => response.json())
      .then((data) => {
        if (data.length === undefined) {
          alert("Can not find post");
        } else {
          data.map((post) => {
            displayPost(post);
          });
        }
      })
      .catch((error) => {
        // Handle any errors that occurred during the request
        console.error(error);
      });
  }
}

function searchUsers(search) {
  const server = "http://127.0.0.1:5000/api/user/search";
  const query = `?userID=${currentUserUserID}&searchUser=${search}`;

  fetch(server + query)
    .then((response) => response.json())
    .then((data) => {
      if (data.length === 0) {
        alert("Unable to find user where username contains: " + search);
      } else {
        data.forEach(function (user) {
          // Create a div element to show the user
          const userContainer = document.createElement("div");
          userContainer.style.width = "400px";
          userContainer.style.height = "70px";
          userContainer.className = "mb-4";
          userContainer.role = "button";

          // Create an img element to show the user profile icon
          const userProfileIcon = document.createElement("img");
          userProfileIcon.alt = `${user["Username"]}'s profile picture`;
          userProfileIcon.draggable = false;
          userProfileIcon.src = user["ProfileIconLink"];
          userProfileIcon.setAttribute("width", "60px");
          userProfileIcon.setAttribute("height", "60px");
          userProfileIcon.className = "rounded-circle";

          // Create a span element to show the user's username
          const userUsername = document.createElement("span");
          userUsername.className = "ms-2 display-6";
          userUsername.textContent = user["Username"];

          // Create a span element to show the user's displayname
          const userDisplayName = document.createElement("span");
          userDisplayName.className = "ms-2";
          userDisplayName.textContent = user["DisplayName"];

          // Append all elements to the container
          userContainer.appendChild(userProfileIcon);
          userContainer.appendChild(userUsername);
          userContainer.appendChild(userDisplayName);

          // Append the container to the main's first child
          showcase.appendChild(userContainer);

          //Add event listener to send user to the profile screen of the clicked user
          userContainer.addEventListener("click", function (event) {
            //Get the userID of selected user
            const selectedUser = event.currentTarget.childNodes[1].textContent;
            window.open(
              `http://127.0.0.1:5501/app/profile.html?Username=${selectedUser}`,
              "_blank"
            );
          });
        });
      }
    })
    .catch((error) => {
      // Handle any errors that occurred during the request
      console.error(error);
    });
}

function showRecommendedPost() {
  fetch(
    `http://127.0.0.1:5000/api/post/placeholder?userID=${currentUserUserID}`
  )
    .then((response) => response.json())
    .then((data) => {
      data.map((post) => {
        displayPost(post);
      });
    })
    .catch((error) => {
      // Handle any errors that occurred during the request
      console.error(error);
    });
}
