//Import
import { displayPost } from "./post.js";

//Init global variables
const searchForUsers = document.querySelector("#searchForUsers");
const searchForPosts = document.querySelector("#searchForPosts");
const display = document.querySelector("#display");
const search = document.querySelector("#search");
const searchInput = document.querySelector("#SearchInput");
const showcase = document.querySelector("#showcase");
const end = document.querySelector("#end");

//This is to check if the user is viewing a shared post
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

const sharedPost = urlParams.get("postID");

let page = 0;

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

// Check if the element is within the viewport
document.addEventListener("mousewheel", function (event) {
  // event.deltaY contains information about the scroll direction
  let canAppendMore = false;
  if (event.deltaY > 0) {
    // Scroll down
    const elements = document.getElementsByClassName("result");
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      const rect = element.getBoundingClientRect();

      // Check if the element is within the viewport
      if (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= window.innerHeight &&
        rect.right <= window.innerWidth
      ) {
        if (
          (i / (elements.length - 1)) * 100 >= 80 ||
          i == elements.length - 1 //There might be just one post (0/0 -> NaN)
        ) {
          page++;
          canAppendMore = true;
        }
      }
    }
  }
  if (canAppendMore) {
    const search = searchInput.value;
    if (display.textContent == "Users") {
      searchUsers(search);
    } else {
      if (search.length === 0) {
        showRecommendedPost();
      } else {
        searchPost(search);
      }
    }
  }
});

searchForUsers.addEventListener("click", function () {
  reset();
  searchInput.value = "";
  display.textContent = "Users";
});

searchForPosts.addEventListener("click", function () {
  reset();
  searchInput.value = "";
  display.textContent = "Posts";
  showRecommendedPost();
});

search.addEventListener("click", function () {
  reset();
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

function reset() {
  end.classList.add("visually-hidden");
  page = 0;
  clear();
}

function searchPost(search) {
  const tagsArray = search.trim().split(" ");
  if (tagsArray.length === 0) {
    alert("Can not search for a post with no tag");
  } else {
    const server = "http://127.0.0.1:5000/api/post/search";
    const query = `?userID=${currentUserUserID}&tags=${tagsArray}&page=${page}`;

    fetch(server + query)
      .then((response) => response.json())
      .then((data) => {
        if (data.length === 0) {
          end.classList.remove("visually-hidden");
        }
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
  const query = `?userID=${currentUserUserID}&searchUser=${search}&page=${page}`;

  fetch(server + query)
    .then((response) => response.json())
    .then((data) => {
      if (data.length === 0) {
        alert("There is no username that contains: " + search);
        end.classList.remove("visually-hidden");
      } else {
        data.forEach(function (user) {
          // Create a div element to show the user
          const userContainer = document.createElement("div");
          userContainer.style.width = "400px";
          userContainer.style.height = "70px";
          userContainer.className = "result mb-4";
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
    `http://127.0.0.1:5000/api/post/placeholder?userID=${currentUserUserID}&page=${page}`
  )
    .then((response) => response.json())
    .then((data) => {
      if (data.length === 0) {
        end.classList.remove("visually-hidden");
      }
      data.map((post) => {
        displayPost(post);
      });
    })
    .catch((error) => {
      // Handle any errors that occurred during the request
      console.error(error);
    });
}
