import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/9.4.0/firebase-storage.js";
import { initFirebase } from "/app/js/firebase-setup.js";
import { appendPost } from "./post.js";
import { sendDirectMessage } from "./message.js";

const app = initFirebase();
const storage = getStorage(app);

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

const username = urlParams.get("Username");

let profileUserID;
let profileUsername;
let profileBio;
let profileProfileIcon;
let profileDisplayName;
let tempDMLimit;
let tempPostVis;
let tempProfileProfileIcon;
let DMLimit;
let PostVis;
let selectedFile;

const profileIconElement = document.querySelector("#profileIcon");
const profileUsernameElement = document.querySelector("#profileUsername");
const profileDisplayNameElement = document.querySelector("#profileDisplayName");
const bioElement = document.querySelector("#bio");
const showLimit = document.querySelector("#showLimit");
const showVis = document.querySelector("#showVis");
const sendMessageButton = document.querySelector("#sendMessage");
const sendMessageInput = document.querySelector("#sendMessageInput");

const rowOfInteractive = document.querySelector("#rowOfInteractive");

if (username == null) {
  profileUserID = currentUserUserID;
  setProfile();
  getFollowings();
  getFollowers();
  getVisibility();
  getDMLimit();
  attachSetting();
  showPost();
} else {
  fetch(`http://127.0.0.1:5000/api/user/userID?username=${username}`)
    .then((response) => response.json())
    .then((data) => {
      profileUserID = data.UserID;
      setProfile();
      getFollowings();
      getFollowers();
      getVisibility();
      getDMLimit();
      showPost();
      console.log(profileUserID);
      if (currentUserUserID == profileUserID) {
        attachSetting();
      } else {
        attachFollowAndDMButton();
        attachBlockButton();
      }
    })
    .catch((error) => {
      // Handle any errors that occurred during the request
      console.error(error);
    });
}

function showPost() {
  fetch(
    `http://127.0.0.1:5000/api/post/profile?userID=${currentUserUserID}&profileUserID=${profileUserID}`
  )
    .then((response) => response.json())
    .then((data) => {
      if (data.length === undefined) {
      } else {
        data.map((post) => {
          const postID = post.postID;

          const uploadDetail = post.uploadDetail;
          const PostLink = uploadDetail.PostLink;
          const Title = uploadDetail.Title;
          const commentCount = uploadDetail.commentCount;
          const didUserLike = uploadDetail.didUserLike;
          const likeCount = uploadDetail.likeCount;
          const shareCount = uploadDetail.shareCount;

          const uploaderDetail = post.uploaderDetail;
          const Username = uploaderDetail.Username;
          const ProfileIconLink = uploaderDetail.ProfileIconLink;

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
      }
    })
    .catch((error) => {
      // Handle any errors that occurred during the request
      console.error(error);
    });
}

function getVisibility() {
  fetch(`http://127.0.0.1:5000/api/user/visibility?userID=${profileUserID}`)
    .then((response) => response.json())
    .then((data) => {
      PostVis = data.Visibility;
      tempPostVis = PostVis;
      switch (PostVis) {
        case 0:
          showVis.textContent = "Everyone";
          break;
        case 1:
          showVis.textContent = "Followers";
          break;
        case 2:
          showVis.textContent = "Mutural";
          break;
        case 3:
          showVis.textContent = "No one";
          break;
      }
    })
    .catch((error) => {
      // Handle any errors that occurred during the request
      console.error(error);
    });
}
function getDMLimit() {
  fetch(`http://127.0.0.1:5000/api/user/dmlimit?userID=${profileUserID}`)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      DMLimit = data.DMLimit;
      tempDMLimit = DMLimit;
      switch (DMLimit) {
        case 0:
          showLimit.textContent = "Everyone";
          break;
        case 1:
          showLimit.textContent = "Followers";
          break;
        case 2:
          showLimit.textContent = "Mutural";
          break;
        case 3:
          showLimit.textContent = "No one";
          break;
      }
    })
    .catch((error) => {
      // Handle any errors that occurred during the request
      console.error(error);
    });
}

function attachSetting() {
  // Create the <span> element
  const spanElement = document.createElement("span");
  spanElement.className = "ms-3 mt-1";
  spanElement.role = "button";
  spanElement.dataset.bsToggle = "modal";
  spanElement.dataset.bsTarget = "#settings";

  spanElement.addEventListener("click", function () {
    const profileIconPreview = document.querySelector("#profileIconPreview");
    tempProfileProfileIcon = profileProfileIcon;
    profileIconPreview.src = profileProfileIcon;

    const changeBio = document.querySelector("#changeBio");
    changeBio.value = profileBio;

    const changeDisplayName = document.querySelector("#changeDisplayName");
    changeDisplayName.value = profileDisplayName;

    const limitEveryone = document.querySelector("#limitEveryone");
    const limitFollowers = document.querySelector("#limitFollowers");
    const limitMutural = document.querySelector("#limitMutural");
    const limitNoOne = document.querySelector("#limitNoOne");

    limitEveryone.addEventListener("click", function () {
      showLimit.textContent = "Everyone";
      tempDMLimit = 0;
    });
    limitFollowers.addEventListener("click", function () {
      showLimit.textContent = "Followers";
      tempDMLimit = 1;
    });
    limitMutural.addEventListener("click", function () {
      showLimit.textContent = "Mutural";
      tempDMLimit = 2;
    });
    limitNoOne.addEventListener("click", function () {
      showLimit.textContent = "No one";
      tempDMLimit = 3;
    });

    const visEveryone = document.querySelector("#visEveryone");
    const visFollowers = document.querySelector("#visFollowers");
    const visMutural = document.querySelector("#visMutural");
    const visNoOne = document.querySelector("#visNoOne");

    visEveryone.addEventListener("click", function () {
      showVis.textContent = "Everyone";
      tempPostVis = 0;
    });
    visFollowers.addEventListener("click", function () {
      showVis.textContent = "Followers";
      tempPostVis = 1;
    });
    visMutural.addEventListener("click", function () {
      showVis.textContent = "Mutural";
      tempPostVis = 2;
    });
    visNoOne.addEventListener("click", function () {
      showVis.textContent = "No one";
      tempPostVis = 3;
    });

    const uploadProfileIcon = document.querySelector("#uploadProfileIcon");

    uploadProfileIcon.addEventListener("change", function () {
      selectedFile = event.target.files[0];
      if (selectedFile.type.match("image.*")) {
        const reader = new FileReader();
        reader.addEventListener("load", (event) => {
          profileIconPreview.src = event.target.result;
        });
        reader.readAsDataURL(selectedFile);
      } else {
        alert("Sorry, only images");
      }
    });

    const updateProfile = document.querySelector("#updateProfile");

    updateProfile.addEventListener("click", function () {
      updateUserProfile();
    });
  });

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

async function updateUserProfile() {
  await uploadFirebase();
  PostVis = tempPostVis;
  DMLimit = tempDMLimit;
  var dataObject = {
    userID: currentUserUserID,
    newDisplayName: changeDisplayName.value,
    newBio: changeBio.value,
    newProfileIconLink: tempProfileProfileIcon,
    newVisibility: tempPostVis,
    newDMLimit: tempDMLimit,
  };

  // Convert the JavaScript object to a JSON string
  var jsonObject = JSON.stringify(dataObject);

  console.log(jsonObject);

  fetch("http://127.0.0.1:5000/api/user/profile", {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: jsonObject,
  })
    .then((response) => response.text())
    .then((responseData) => {
      window.location.reload();
      alert("Profile updated");
      console.log("Response:", responseData);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function uploadFirebase() {
  const url = `/profileIcon/${currentUserUserID}:${profileUsername}`;
  const storageRef = ref(storage, url);
  uploadBytes(storageRef, selectedFile)
    .then((snapshot) => {
      console.log("Image uploaded successfully!");
      getDownloadURL(storageRef)
        .then((url) => {
          tempProfileProfileIcon = url;
        })
        .catch((error) => {
          console.error("Error getting video URL:", error);
        });
    })
    .catch((error) => {
      console.error("Error uploading image:", error);
    });
}

function setProfile() {
  fetch(`http://127.0.0.1:5000/api/user/profile?userID=${profileUserID}`)
    .then((response) => response.json())
    .then((data) => {
      profileDisplayName = data.DisplayName;
      profileUsername = data.Username;
      profileProfileIcon = data.ProfileIconLink;
      profileBio = data.Bio;
      profileIconElement.src = profileProfileIcon;
      profileIconElement.alt = `${profileUsername}'s profile picture`;
      profileUsernameElement.textContent = profileUsername;
      profileDisplayNameElement.textContent = profileDisplayName;
      bioElement.textContent = profileBio;
    })
    .catch((error) => {
      // Handle any errors that occurred during the request
      console.error(error);
    });
}

function attachFollowAndDMButton() {
  fetch(
    `http://127.0.0.1:5000/api/follow/following?currentID=${currentUserUserID}&profileID=${profileUserID}`
  )
    .then((response) => response.json())
    .then((data) => {
      const sendDMButton = document.createElement("button");
      sendDMButton.className = "ms-3 btn btn-primary";
      sendDMButton.dataset.bsToggle = "modal";
      sendDMButton.dataset.bsTarget = "#sendDMModal";
      sendDMButton.textContent = "Send DM";
      const sendDMHeader = document.querySelector("#sendDMHeader");
      sendDMHeader.textContent = `Sending message to: ${username}`;
      let follow = data ? "Unfollow" : "Follow";
      //create follow button
      const followButton = document.createElement("button");
      followButton.className = "ms-3 btn btn-primary";
      followButton.id = "followButton";
      followButton.textContent = follow;
      followButton.addEventListener("click", function () {
        if (followButton.textContent == "Follow") {
          becomeFollower();
          followButton.textContent = "Unfollow";
        } else {
          unfollow();
          followButton.textContent = "Follow";
        }
      });
      rowOfInteractive.appendChild(sendDMButton);
      rowOfInteractive.appendChild(followButton);

      sendMessageButton.addEventListener("click", async function () {
        if (sendMessageInput.value.length > 1100) {
          alert("The message is too long");
        } else if (sendMessageInput.value.length == 0) {
          alert("Better have something to send");
        } else {
          await sendDirectMessage(profileUserID, sendMessageInput.value);
          window.open("http://127.0.0.1:5501/app/message.html", "_blank");
        }
      });
    })
    .catch((error) => {
      // Handle any errors that occurred during the request
      console.error(error);
    });
}

function becomeFollower() {
  var dataObject = { currentID: currentUserUserID, profileID: profileUserID };

  // Convert the JavaScript object to a JSON string
  var jsonObject = JSON.stringify(dataObject);

  fetch("http://127.0.0.1:5000/api/follow/becomeFollower", {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: jsonObject,
  })
    .then((response) => response.text())
    .then((responseData) => {
      console.log("Response:", responseData);
      const followersCount = document.querySelector("#followersCount");
      followersCount.textContent = parseInt(followersCount.textContent) + 1;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function unfollow() {
  var dataObject = { currentID: currentUserUserID, profileID: profileUserID };

  // Convert the JavaScript object to a JSON string
  var jsonObject = JSON.stringify(dataObject);

  console.log(jsonObject);

  fetch("http://127.0.0.1:5000/api/follow/unfollow", {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: jsonObject,
  })
    .then((response) => response.text())
    .then((responseData) => {
      console.log("Response:", responseData);
      const followersCount = document.querySelector("#followersCount");
      followersCount.textContent = followersCount.textContent - 1;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function getFollowers() {
  fetch(
    `http://127.0.0.1:5000/api/follow/listOfFollowers?profileID=${profileUserID}`
  )
    .then((response) => response.json())
    .then((data) => {
      const followersCount = document.querySelector("#followersCount");
      followersCount.textContent = data.length;
      data.forEach(function (element) {
        showCaseFollowers(element);
      });
    })
    .catch((error) => {
      // Handle any errors that occurred during the request
      console.error(error);
    });
}

function showCaseFollowers(userID) {
  fetch(`http://127.0.0.1:5000/api/user/profile?userID=${userID}`)
    .then((response) => response.json())
    .then((data) => {
      // Create a div element
      const divElement = document.createElement("div");
      divElement.style.width = "400px";
      divElement.style.minHeight = "70px";
      divElement.className = "mb-4";
      divElement.role = "button";

      // Create an img element
      const imgElement = document.createElement("img");
      imgElement.alt = `${data.Username}'s profile picture`;
      imgElement.draggable = false;
      imgElement.src = data.ProfileIconLink;
      imgElement.setAttribute("width", "60px");
      imgElement.setAttribute("height", "60px");
      imgElement.className = "rounded-circle";

      // Create the first span element
      const spanElement1 = document.createElement("span");
      spanElement1.className = "ms-2 display-6 text-break";
      spanElement1.textContent = data.Username;

      // Create the second span element
      const spanElement2 = document.createElement("span");
      spanElement2.textContent = data.DisplayName;
      spanElement2.className = "ms-2 text-break";

      // Append all elements to the div
      divElement.appendChild(imgElement);
      divElement.appendChild(spanElement1);
      divElement.appendChild(spanElement2);

      // Append the div to the modal
      const listOfFollowers = document.querySelector("#listOfFollowers");
      listOfFollowers.appendChild(divElement);

      //Add event listener to send user to the profile screen of the clicked user
      divElement.addEventListener("click", function (event) {
        const selectedUser = event.currentTarget.childNodes[1].textContent;
        window.open(
          `http://127.0.0.1:5501/app/profile.html?Username=${selectedUser}`,
          "_blank"
        );
      });
    })
    .catch((error) => {
      // Handle any errors that occurred during the request
      console.error(error);
    });
}

function getFollowings() {
  fetch(
    `http://127.0.0.1:5000/api/follow/listOfFollowings?profileID=${profileUserID}`
  )
    .then((response) => response.json())
    .then((data) => {
      const followingCount = document.querySelector("#followingCount");
      followingCount.textContent = data.length;
      data.forEach(function (element) {
        showCaseFollowing(element);
      });
    })
    .catch((error) => {
      // Handle any errors that occurred during the request
      console.error(error);
    });
}

function showCaseFollowing(userID) {
  fetch(`http://127.0.0.1:5000/api/user/profile?userID=${userID}`)
    .then((response) => response.json())
    .then((data) => {
      // Create a div element
      const divElement = document.createElement("div");
      divElement.style.width = "400px";
      divElement.style.minHeight = "70px";
      divElement.className = "mb-4 ";
      divElement.role = "button";

      // Create an img element
      const imgElement = document.createElement("img");
      imgElement.alt = `${data.Username}'s profile picture`;
      imgElement.draggable = false;
      imgElement.src = data.ProfileIconLink;
      imgElement.setAttribute("width", "60px");
      imgElement.setAttribute("height", "60px");
      imgElement.className = "rounded-circle";

      // Create the first span element
      const spanElement1 = document.createElement("span");
      spanElement1.className = "ms-2 display-6 text-break";
      spanElement1.textContent = data.Username;

      // Create the second span element
      const spanElement2 = document.createElement("span");
      spanElement2.textContent = data.DisplayName;
      spanElement2.className = "ms-2 text-break";

      // Append all elements to the div
      divElement.appendChild(imgElement);
      divElement.appendChild(spanElement1);
      divElement.appendChild(spanElement2);

      // Append the div to the modal
      const listOfFollowering = document.querySelector("#listOfFollowering");
      listOfFollowering.appendChild(divElement);

      //Add event listener to send user to the profile screen of the clicked user
      divElement.addEventListener("click", function (event) {
        const selectedUser = event.currentTarget.childNodes[1].textContent;
        window.open(
          `http://127.0.0.1:5501/app/profile.html?Username=${selectedUser}`,
          "_blank"
        );
      });
    })
    .catch((error) => {
      // Handle any errors that occurred during the request
      console.error(error);
    });
}

function attachBlockButton() {
  fetch(
    `http://127.0.0.1:5000/api/user/block?userID=${currentUserUserID}&profileUserID=${profileUserID}`
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      let block = data ? "Unlock" : "Block";
      const blockButton = document.createElement("button");
      blockButton.className = "ms-3 btn btn-primary";
      blockButton.id = "blockButton";
      blockButton.textContent = block;
      blockButton.addEventListener("click", function () {
        if (blockButton.textContent == "Block") {
          blockUser();
          blockButton.textContent = "Unblock";
        } else {
          unBlockUser();
          blockButton.textContent = "Block";
        }
      });
      rowOfInteractive.appendChild(blockButton);
    })
    .catch((error) => {
      // Handle any errors that occurred during the request
      console.error(error);
    });
}

function unBlockUser() {
  var dataObject = { userID: currentUserUserID, profileUserID: profileUserID };

  // Convert the JavaScript object to a JSON string
  var jsonObject = JSON.stringify(dataObject);

  console.log(jsonObject);

  fetch("http://127.0.0.1:5000/api/user/unblock", {
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

function blockUser() {
  var dataObject = { userID: currentUserUserID, profileUserID: profileUserID };

  // Convert the JavaScript object to a JSON string
  var jsonObject = JSON.stringify(dataObject);

  console.log(jsonObject);

  fetch("http://127.0.0.1:5000/api/user/block", {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: jsonObject,
  })
    .then((response) => response.text())
    .then((responseData) => {
      console.log("Response:", responseData);
      const followersCount = document.querySelector("#followersCount");
      followersCount.textContent = followersCount.textContent - 1;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
