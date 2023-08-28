fetch(`http://127.0.0.1:5000/api/post/followings?userID=${userID}`)
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

fetch(`http://127.0.0.1:5000/api/story/following?userID=${userID}`)
  .then((response) => response.json())
  .then((data) => {
    if (!data) {
      alert("Can not find post");
    }
    data.map((story) => {
      console.log(story);
      const idStory = story["idStory"];
      const profileIconLink = story["ProfileIconLink"];
      const storyLink = story["StoryLink"];
      const title = story["Title"];
      appendStory(idStory, profileIconLink, storyLink, title);
    });
  })
  .catch((error) => {
    // Handle any errors that occurred during the request
    console.error(error);
  });

function appendStory(idStory, profileIconLink, storyLink, title) {
  const modal = `storyModal${idStory}`;
  // Create the <div> element
  const divElement = document.createElement("div");
  divElement.className = "normal-story";
  divElement.setAttribute("role", "button");
  divElement.setAttribute("data-bs-toggle", "modal");
  divElement.setAttribute("data-bs-target", `#${modal}`);

  // Create the <img> element
  const imgElement = document.createElement("img");
  imgElement.src = profileIconLink;
  imgElement.alt = "story_icon_1";
  imgElement.className = "rounded-circle m-3";
  imgElement.width = "100";
  imgElement.height = "100";

  // Append the <img> element to the <div> element
  divElement.appendChild(imgElement);

  // Assuming you have an existing element in the DOM where you want to add this <div> element
  const storyHeader = document.querySelector("#storyHeader");
  storyHeader.appendChild(divElement);

  // Create the <div> element with the modal structure
  const modalDiv = document.createElement("div");
  modalDiv.className = "modal fade";
  modalDiv.id = modal;
  modalDiv.tabIndex = "-1";
  modalDiv.setAttribute("aria-hidden", "true");

  // Create the modal dialog <div>
  const modalDialogDiv = document.createElement("div");
  modalDialogDiv.className = "modal-dialog";

  // Create the modal content <div>
  const modalContentDiv = document.createElement("div");
  modalContentDiv.className = "modal-content";

  // Create the modal header <div>
  const modalHeaderDiv = document.createElement("div");
  modalHeaderDiv.className = "modal-header";

  // Create the modal title <h1> element
  const modalTitle = document.createElement("h1");
  modalTitle.className = "modal-title fs-5 text-black";
  modalTitle.id = "sendDMHeader";
  modalTitle.textContent = title;

  // Create the close button <button> element
  const closeButton = document.createElement("button");
  closeButton.type = "button";
  closeButton.className = "btn-close";
  closeButton.setAttribute("data-bs-dismiss", "modal");
  closeButton.setAttribute("aria-label", "Close");

  // Append the title and close button to the header
  modalHeaderDiv.appendChild(modalTitle);
  modalHeaderDiv.appendChild(closeButton);

  // Create the modal body <div>
  const modalFooterDiv = document.createElement("div");
  modalFooterDiv.className = "modal-footer text-black";

  const modalBodyDiv = document.createElement("div");
  modalBodyDiv.className =
    "modal-body flex justify-content-center align-self-center";

  // Create the input group <div>
  const inputGroupDiv = document.createElement("div");
  inputGroupDiv.className = "input-group";

  // Create the input field <input> element
  const inputField = document.createElement("input");
  inputField.type = "text";
  inputField.className = "form-control";

  // Create the send message button <span> element
  const sendMessageButton = document.createElement("span");
  sendMessageButton.className = "input-group-text";
  sendMessageButton.textContent = "Send message";
  sendMessageButton.setAttribute("role", "button");

  // Append the input field and send message button to the input group
  inputGroupDiv.appendChild(inputField);
  inputGroupDiv.appendChild(sendMessageButton);

  // Append the input group to the modal body
  modalFooterDiv.appendChild(inputGroupDiv);

  if (storyLink.charAt(79) == "v") {
    const video = document.createElement("video");
    //Using css of post
    video.className = "post";
    video.src = storyLink;
    video.controls = true;
    modalBodyDiv.appendChild(video);
  } else {
    const image = document.createElement("img");
    image.className = "post";
    image.src = storyLink;
    modalBodyDiv.append(image);
  }

  // Append the modal header and modal body to the modal content
  modalContentDiv.appendChild(modalHeaderDiv);
  modalContentDiv.appendChild(modalBodyDiv);
  modalContentDiv.appendChild(modalFooterDiv);

  // Append the modal content to the modal dialog
  modalDialogDiv.appendChild(modalContentDiv);

  // Append the modal dialog to the main modal <div>
  modalDiv.appendChild(modalDialogDiv);

  // Assuming you have an existing element in the DOM where you want to add this modal
  const containerElement = document.getElementById("collectionOfStories");
  containerElement.appendChild(modalDiv);
}

function appendPost(
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
      userID: userID,
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

  const modalCommentID = "commentModal" + postID;

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
  commentSpan.dataset.bsTarget = `#${modalCommentID}`;

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

  const modalDiv = document.createElement("div");
  modalDiv.className = "modal fade";
  modalDiv.id = modalCommentID;
  modalDiv.tabIndex = "-1";
  modalDiv.setAttribute("aria-hidden", "true");

  const modalDialog = document.createElement("div");
  modalDialog.className = "modal-dialog";

  const modalContent = document.createElement("div");
  modalContent.className = "modal-content";

  const modalHeader = document.createElement("div");
  modalHeader.className = "modal-header";

  const modalTitle = document.createElement("h1");
  modalTitle.className = "modal-title fs-5 text-black";
  modalTitle.textContent = title;

  const closeButton = document.createElement("button");
  closeButton.type = "button";
  closeButton.className = "btn-close";
  closeButton.setAttribute("data-bs-dismiss", "modal");
  closeButton.setAttribute("aria-label", "Close");
  modalHeader.appendChild(modalTitle);
  modalHeader.appendChild(closeButton);

  const modalBody = document.createElement("div");
  modalBody.className = "modal-body text-black";
  modalBody.textContent = "";

  const modalFooter = document.createElement("div");
  modalFooter.className = "modal-footer";

  const inputGroup = document.createElement("div");
  inputGroup.className = "input-group";

  const inputField = document.createElement("input");
  inputField.type = "text";
  inputField.className = "form-control";

  const sendSpan = document.createElement("span");
  sendSpan.className = "input-group-text";
  sendSpan.role = "button";
  sendSpan.textContent = "Send";

  sendSpan.addEventListener("click", function () {
    const commentContainer = document.createElement("div");

    const commentText = document.createElement("div");
    commentText.innerText = inputField.value;
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

    // Create the first span element
    const spanElement1 = document.createElement("span");
    spanElement1.className = "ms-2 display-6";
    spanElement1.textContent = "Username";

    // Append all elements to the div
    whoComment.appendChild(commentProfileIcon);
    whoComment.appendChild(spanElement1);
    commentContainer.appendChild(whoComment);
    commentContainer.appendChild(commentText);
    modalBody.appendChild(commentContainer);
  });

  inputGroup.appendChild(inputField);
  inputGroup.appendChild(sendSpan);
  modalFooter.appendChild(inputGroup);
  modalContent.appendChild(modalHeader);
  modalContent.appendChild(modalBody);
  modalContent.appendChild(modalFooter);
  modalDialog.appendChild(modalContent);
  modalDiv.appendChild(modalDialog);

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

  shareSpan.addEventListener("click", async function () {
    try {
      await navigator.clipboard.writeText(
        `http://127.0.0.1:5501/app/explore.html?postID=${postID}`
      );
      alert("Copied the link to the post");
    } catch (error) {
      console.error("Failed to copy: ", error);
    }
  });

  const shareCountSpan = document.createElement("span");
  shareCountSpan.className = "text-center";
  shareCountSpan.textContent = shareCount;

  // Append elements to their respective parent containers
  secondInnerDiv.appendChild(heartSpan);
  secondInnerDiv.appendChild(likeCountSpan);
  secondInnerDiv.appendChild(commentSpan);
  secondInnerDiv.appendChild(commentCountSpan);
  secondInnerDiv.appendChild(modalDiv);
  secondInnerDiv.appendChild(shareSpan);
  secondInnerDiv.appendChild(shareCountSpan);

  mainContainer.appendChild(firstInnerDiv);
  mainContainer.appendChild(secondInnerDiv);

  // Append the main container to the showcase
  const showcase = document.querySelector("#showcase");
  showcase.appendChild(mainContainer);
}
