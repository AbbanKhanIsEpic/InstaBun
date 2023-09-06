import { appendPost } from "./post.js";
const searchForUsers = document.querySelector("#searchForUsers");
const searchForPosts = document.querySelector("#searchForPosts");
const display = document.querySelector("#display");
const search = document.querySelector("#search");
const searchInput = document.querySelector("#SearchInput");
const showcase = document.querySelector("#showcase");

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

const sharedPost = urlParams.get("postID");

if (sharedPost == null) {
  fetch(
    `http://127.0.0.1:5000/api/post/placeholder?userID=${currentUserUserID}`
  )
    .then((response) => response.json())
    .then((data) => {
      if (!data) {
        alert("Like some posts for something to appear here");
      }
      data.map((post) => {
        const postID = post["postID"];

        const uploadDetail = post["uploadDetail"][0];
        const PostLink = uploadDetail["PostLink"];
        const Title = uploadDetail["Title"];
        const commentCount = uploadDetail["commentCount"];
        const didUserLike = uploadDetail["didUserLike"];
        const likeCount = uploadDetail["likeCount"];
        const shareCount = uploadDetail["shareCount"];

        const uploaderDetail = post["uploaderDetail"][0];
        const Username = uploaderDetail["Username"];
        const ProfileIconLink = uploaderDetail["ProfileIconLink"];

        appendPost(
          postID,
          PostLink,
          Title,
          commentCount,
          didUserLike,
          likeCount,
          shareCount,
          Username,
          ProfileIconLink
        );
      });
    })
    .catch((error) => {
      // Handle any errors that occurred during the request
      console.error(error);
    });
} else {
  fetch(
    `http://127.0.0.1:5000/api/post/select?userID=${currentUserUserID}&postID=${sharedPost}`
  )
    .then((response) => response.json())
    .then((data) => {
      data.map((post) => {
        const postID = post["postID"];

        const uploadDetail = post["uploadDetail"][0];
        const PostLink = uploadDetail["PostLink"];
        const Title = uploadDetail["Title"];
        const commentCount = uploadDetail["commentCount"];
        const didUserLike = uploadDetail["didUserLike"];
        const likeCount = uploadDetail["likeCount"];
        const shareCount = uploadDetail["shareCount"];

        const uploaderDetail = post["uploaderDetail"][0];
        const Username = uploaderDetail["Username"];
        const ProfileIconLink = uploaderDetail["ProfileIconLink"];

        appendPost(
          postID,
          PostLink,
          Title,
          commentCount,
          didUserLike,
          likeCount,
          shareCount,
          Username,
          ProfileIconLink
        );
      });
    })
    .catch((error) => {
      // Handle any errors that occurred during the request
      console.error(error);
    });
}

searchForUsers.addEventListener("click", function () {
  clear();
  display.textContent = "Users";
});

searchForPosts.addEventListener("click", function () {
  clear();
  display.textContent = "Posts";
});

function clear() {
  while (showcase.childNodes[0]) {
    showcase.removeChild(showcase.childNodes[0]);
  }
}

search.addEventListener("click", function () {
  clear();
  const search = searchInput.value;
  if (display.textContent == "Users") {
    searchUsers(search);
  } else {
    searchPost(search);
  }
});

function searchPost(search) {
  clear();
  const tagsArray = search.trim().split(" ");
  let tagsWithQuotes = "";
  tagsArray.map((tag) => {
    console.log(tag);
    tagsWithQuotes += `"${tag}" `;
  });
  console.log(tagsWithQuotes);
  tagsWithQuotes = tagsWithQuotes.trim().replace(/ /g, ",");
  console.log(tagsWithQuotes);
  const server = "http://127.0.0.1:5000/api/post/search";
  const query = `?userID=${currentUserUserID}&tags=${tagsWithQuotes}`;

  fetch(server + query)
    .then((response) => response.json())
    .then((data) => {
      if (!data) {
        alert("Can not find post");
      }
      data.map((post) => {
        const postID = post["postID"];

        const uploadDetail = post["uploadDetail"][0];
        const PostLink = uploadDetail["PostLink"];
        const Title = uploadDetail["Title"];
        const commentCount = uploadDetail["commentCount"];
        const didUserLike = uploadDetail["didUserLike"];
        const likeCount = uploadDetail["likeCount"];
        const shareCount = uploadDetail["shareCount"];

        const uploaderDetail = post["uploaderDetail"][0];
        const Username = uploaderDetail["Username"];
        const ProfileIconLink = uploaderDetail["ProfileIconLink"];

        appendPost(
          postID,
          PostLink,
          Title,
          commentCount,
          didUserLike,
          likeCount,
          shareCount,
          Username,
          ProfileIconLink
        );
      });
    })
    .catch((error) => {
      // Handle any errors that occurred during the request
      console.error(error);
    });
}

function searchUsers(search) {
  const server = "http://127.0.0.1:5000/api/user/search";
  const query = `?userID=${currentUserUserID}&searchUser=${search}`;

  fetch(server + query)
    .then((response) => response.json())
    .then((data) => {
      data.forEach(function (user) {
        // Create a div element
        const divElement = document.createElement("div");
        divElement.style.width = "400px";
        divElement.style.height = "70px";
        divElement.className = "mb-4";
        divElement.role = "button";

        // Create an img element
        const imgElement = document.createElement("img");
        imgElement.alt = `${user.Username}'s profile picture`;
        imgElement.draggable = false;
        imgElement.src = user.ProfileIconLink;
        imgElement.setAttribute("width", "60px");
        imgElement.setAttribute("height", "60px");
        imgElement.className = "rounded-circle";

        // Create the first span element
        const spanElement1 = document.createElement("span");
        spanElement1.className = "ms-2 display-6";
        spanElement1.textContent = user.Username;

        // Create the second span element
        const spanElement2 = document.createElement("span");
        spanElement2.textContent = user.DisplayName;
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
