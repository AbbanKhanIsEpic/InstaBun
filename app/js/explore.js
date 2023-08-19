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
    searchPost(userID, search);
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

function searchPost(userID, search) {
  const tags = search.replace(/ /g, ",");
  const server = "http://127.0.0.1:5000/api/post/viaTags";
  const query = `?userID=${userID}&tags=${tags}`;

  fetch(server + query)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      data.map((post) => {
        console.log(post);
        const details = post[1][0];
        console.log(details);
        const postID = post[0];
        const likeCount = details.LikeCount;
        const postLink = details.PostLink;
        const shareCount = details.ShareCount;
        const title = details.Title;
        const username = post[2][0].Username;
        const profileIconLink = post[3][0].ProfileIconLink;
        appendPost(
          postID,
          likeCount,
          postLink,
          shareCount,
          title,
          username,
          profileIconLink
        );
      });
    })
    .catch((error) => {
      // Handle any errors that occurred during the request
      console.error(error);
    });
}

function appendPost(
  postID,
  likeCount,
  postLink,
  shareCount,
  title,
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
    video.src = postLink;
    video.controls = true;
    firstInnerDiv.appendChild(video);
  } else {
    const image = document.createElement("img");
    image.src = postLink;
    image.width = "500";
    image.height = "400";
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
  heartSvg.setAttribute("fill", "white");
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
  commentCountSpan.className = "text center";
  commentCountSpan.textContent = "1M";

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
  modalBody.textContent = postID;

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
