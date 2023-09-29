export function appendPost(
  postID,
  postLink,
  title,
  commentCount,
  didUserLike,
  likeCount,
  shareCount,
  username,
  profileIconLink
) {
  const sendSpan = document.querySelector("#sendComment");
  const modalBody = document.querySelector("#comments");
  const commentInputField = document.querySelector("#commentInput");
  const commentTitle = document.querySelector("#title");

  // Create the main container div
  const mainContainer = document.createElement("div");
  mainContainer.className = "d-flex justify-content-center align-items-center";
  mainContainer.id = postID;

  // Create the first inner div
  const firstInnerDiv = document.createElement("div");
  firstInnerDiv.className = "d-flex flex-column";
  if (postLink.charAt(79) == "v") {
    const video = document.createElement("video");
    video.className = "post";
    video.src = postLink;
    video.controls = true;
    firstInnerDiv.appendChild(video);
  } else {
    const image = document.createElement("img");
    image.className = "post";
    image.src = postLink;
    firstInnerDiv.append(image);
  }

  //To show who is the uploader
  const profileImage = document.createElement("img");
  profileImage.alt = `${username}'s profile picture`;
  profileImage.draggable = false;
  profileImage.src = profileIconLink;
  profileImage.width = "30";
  profileImage.height = "30";
  profileImage.className = "rounded-circle";

  const buttonDiv = document.createElement("div");
  buttonDiv.role = "button";
  buttonDiv.className = "mb-4";

  const usernameSpan = document.createElement("span");
  usernameSpan.textContent = username;
  buttonDiv.appendChild(profileImage);
  buttonDiv.appendChild(usernameSpan);
  buttonDiv.addEventListener("click", function () {
    window.open(
      `http://127.0.0.1:5501/app/profile.html?Username=${username}`,
      "_blank"
    );
  });
  firstInnerDiv.appendChild(buttonDiv);

  // Create the second inner div
  const secondInnerDiv = document.createElement("div");
  secondInnerDiv.className = "d-flex flex-column px-4 ms-2";

  const heartSpan = document.createElement("span");
  heartSpan.setAttribute("role", "button");
  const heartSvg = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "svg"
  );

  heartSvg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  heartSvg.setAttribute("width", "30");
  heartSvg.setAttribute("height", "30");
  let heartColour = didUserLike == 1 ? "red" : "white";
  heartSvg.setAttribute("fill", heartColour);
  heartSvg.setAttribute("viewBox", "0 0 16 16");
  heartSvg.setAttribute("class", "bi bi-heart-fill");
  const heartPath = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "path"
  );

  heartPath.setAttribute("fill-rule", "evenodd");
  heartPath.setAttribute(
    "d",
    "M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"
  );

  heartSvg.appendChild(heartPath);
  heartSpan.appendChild(heartSvg);

  heartSpan.addEventListener("click", function () {
    var dataObject = {
      postID: postID,
      userID: currentUserUserID,
    };
    // Convert the JavaScript object to a JSON string
    var jsonObject = JSON.stringify(dataObject);

    if (heartSvg.getAttribute("fill") == "white") {
      heartColour = "red";
      likeCount++;

      fetch("http://127.0.0.1:5000/api/post/like", {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: jsonObject,
      })
        .then((response) => response.text())
        .then((responseData) => {
          console.log("Response:", responseData);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    } else {
      heartColour = "white";
      likeCount--;
      fetch("http://127.0.0.1:5000/api/post/unlike", {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: jsonObject,
      })
        .then((response) => response.text())
        .then((responseData) => {
          console.log("Response:", responseData);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
    heartSvg.setAttribute("fill", heartColour);
    likeCountSpan.textContent = likeCount;
  });

  const likeCountSpan = document.createElement("span");
  likeCountSpan.textContent = likeCount;
  likeCountSpan.className = "text-center";

  const commentSpan = document.createElement("span");
  commentSpan.role = "button";
  const commentSvg = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "svg"
  );
  commentSvg.setAttribute("width", "30");
  commentSvg.setAttribute("height", "30");
  commentSvg.setAttribute("fill", "white");
  commentSvg.setAttribute("class", "bi bi-chat-right-dots-fill");
  commentSvg.setAttribute("viewBox", "0 0 16 16");

  commentSpan.dataset.bsToggle = "modal";
  commentSpan.dataset.bsTarget = `#commentModal`;

  const commentPath = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "path"
  );

  commentPath.setAttribute(
    "d",
    "M16 2a2 2 0 0 0-2-2H2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h9.586a1 1 0 0 1 .707.293l2.853 2.853a.5.5 0 0 0 .854-.353V2zM5 6a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 1a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"
  );

  commentSvg.appendChild(commentPath);
  commentSpan.appendChild(commentSvg);

  const commentCountSpan = document.createElement("span");
  commentCountSpan.textContent = commentCount;
  commentCountSpan.className = "text-center";

  commentSpan.addEventListener("click", function () {
    commentTitle.textContent = title;
    const server = "http://127.0.0.1:5000/api/post/comment";
    const query = `?postID=${postID}`;

    fetch(server + query)
      .then((response) => response.json())
      .then((data) => {
        data.map((comment) => {
          const text = comment.Comment;
          const profileIcon = comment.ProfileIconLink;
          const username = comment.Username;
          addComment(currentUserUserID, username, profileIcon, text);
        });
      })
      .catch((error) => {
        // Handle any errors that occurred during the request
        console.error(error);
      });
    sendSpan.addEventListener("click", function () {
      var dataObject = {
        postID: postID,
        userID: currentUserUserID,
        comment: commentInputField.value,
      };

      // Convert the JavaScript object to a JSON string
      var jsonObject = JSON.stringify(dataObject);

      fetch("http://127.0.0.1:5000/api/post/comment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: jsonObject,
      })
        .then((response) => response.text())
        .then((responseData) => {
          addComment(
            currentUserUserID,
            currentUserUsername,
            currentUserProfileLink,
            commentInputField.value
          );
          commentCount++;
          commentCountSpan.textContent = commentCount;
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    });
  });

  function addComment(userID, username, currentUserProfileLink, text) {
    const commentContainer = document.createElement("div");

    const commentText = document.createElement("div");
    commentText.innerText = text;
    commentText.className = "mb-4 text-break";

    const whoComment = document.createElement("div");
    whoComment.style.width = "400px";
    whoComment.style.height = "70px";
    whoComment.className = "mb-4";
    whoComment.role = "button";

    // Create an img element
    const commentProfileIcon = document.createElement("img");
    commentProfileIcon.alt = `${userID}'s profile picture`;
    commentProfileIcon.draggable = false;
    commentProfileIcon.src = currentUserProfileLink;
    commentProfileIcon.setAttribute("width", "60px");
    commentProfileIcon.setAttribute("height", "60px");
    commentProfileIcon.className = "rounded-circle";

    whoComment.addEventListener("click", function () {
      window.open(
        `http://127.0.0.1:5501/app/profile.html?Username=${username}`,
        "_blank"
      );
    });

    // Create the first span element
    const spanElement1 = document.createElement("span");
    spanElement1.className = "ms-2 display-6";
    spanElement1.textContent = username;

    // Append all elements to the div
    whoComment.appendChild(commentProfileIcon);
    whoComment.appendChild(spanElement1);
    commentContainer.appendChild(whoComment);
    commentContainer.appendChild(commentText);
    modalBody.appendChild(commentContainer);
  }

  const commentModal = document.querySelector("#commentModal");

  commentModal.addEventListener("hidden.bs.modal", function () {
    while (modalBody.childNodes[0]) {
      modalBody.removeChild(modalBody.childNodes[0]);
    }
  });

  const shareSpan = document.createElement("span");
  shareSpan.role = "button";

  const shareSvg = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "svg"
  );
  shareSvg.setAttribute("width", "30");
  shareSvg.setAttribute("height", "30");
  shareSvg.setAttribute("fill", "white");
  shareSvg.setAttribute("class", "bi bi-share-fill");
  shareSvg.setAttribute("viewBox", "0 0 16 16");
  const sharePath = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "path"
  );
  sharePath.setAttribute(
    "d",
    "M11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.499 2.499 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5z"
  );
  shareSvg.appendChild(sharePath);
  shareSpan.appendChild(shareSvg);

  const shareCountSpan = document.createElement("span");
  shareCountSpan.className = "text-center";
  shareCountSpan.textContent = shareCount;

  shareSpan.addEventListener("click", async function () {
    try {
      await navigator.clipboard.writeText(
        `http://127.0.0.1:5501/app/explore.html?postID=${postID}`
      );
      alert("Copied the link to the post");
      const server = "http://127.0.0.1:5000/api/post/share";
      const query = `?userID=${currentUserUserID}&postID=${postID}`;

      fetch(server + query)
        .then((response) => response.json())
        .then((data) => {
          if (!data) {
            shareCount++;
            shareCountSpan.textContent = shareCount;

            var dataObject = {
              userID: currentUserUserID,
              postID: postID,
            };

            var jsonObject = JSON.stringify(dataObject);

            fetch("http://127.0.0.1:5000/api/post/share", {
              method: "POST",
              headers: {
                "Content-Type": "application/json; charset=utf-8",
              },
              body: jsonObject,
            })
              .then((response) => response.text())
              .then((responseData) => {
                console.log(responseData);
              })
              .catch((error) => {
                console.error("Error:", error);
              });
          }
        })
        .catch((error) => {
          // Handle any errors that occurred during the request
          console.error(error);
        });
    } catch (error) {
      alert("Failed to copy");
      console.error("Failed to copy: ", error);
    }
  });

  // Append elements to their respective parent containers
  secondInnerDiv.appendChild(heartSpan);
  secondInnerDiv.appendChild(likeCountSpan);
  secondInnerDiv.appendChild(commentSpan);
  secondInnerDiv.appendChild(commentCountSpan);
  secondInnerDiv.appendChild(shareSpan);
  secondInnerDiv.appendChild(shareCountSpan);

  mainContainer.appendChild(firstInnerDiv);
  mainContainer.appendChild(secondInnerDiv);

  // Append the main container to the showcase
  const showcase = document.querySelector("#showcase");
  showcase.appendChild(mainContainer);
}
