import { sendDirectMessage } from "./message.js";
import { textAndEmojiToText } from "./emoji.js";
import { showDirectMessage } from "./message.js";
import { stopShowingDirectMessage } from "./message.js";
import { showGroupMessage } from "./message.js";
import { stopShowingGroupMessage } from "./message.js";
import { sendGroupMessage } from "./message.js";

const sendMessageButton = document.querySelector("#sendMessageButton");
const selectGroups = document.querySelector("#selectGroups");
const selectDirect = document.querySelector("#selectDirect");
const userSelection = document.querySelector("#userSelection");
const displayList = document.querySelector("#displayInteractions");
const messageOutput = document.querySelector("#messageOutput");

let currentlySelectedUserID = 0;
let currentlySelectedGroupID = 0;

userSelection.textContent = "Direct";

getDirectList();

selectDirect.addEventListener("click", function () {
  stopShowingDirectMessage(currentUserUserID, currentlySelectedUserID);
  stopShowingGroupMessage(currentlySelectedGroupID);
  clearList();
  userSelection.textContent = "Direct";
  getDirectList();
});

selectGroups.addEventListener("click", function () {
  stopShowingDirectMessage(currentUserUserID, currentlySelectedUserID);
  clearList();
  userSelection.textContent = "Groups";
  getGroupList();
});

function clearList() {
  while (displayList.childNodes[0]) {
    displayList.removeChild(displayList.childNodes[0]);
  }
  clearMessage();
}

function clearMessage() {
  while (messageOutput.childNodes[0]) {
    messageOutput.removeChild(messageOutput.childNodes[0]);
  }
}

function getGroupList() {
  fetch(`http://127.0.0.1:5000/api/group/groupList?userID=${currentUserUserID}`)
    .then((response) => response.json())
    .then((data) => {
      data.map((group) => {
        const groupID = group["GroupID"];
        const groupIconLink = group["GroupIconLink"];
        const groupName = group["GroupName"];
        appendGroup(groupID, groupIconLink, groupName);
      });
    })
    .catch((error) => {
      // Handle any errors that occurred during the request
      console.error(error);
    });
}

function getDirectList() {
  fetch(`http://127.0.0.1:5000/api/direct/list?userID=${currentUserUserID}`)
    .then((response) => response.json())
    .then((data) => {
      data.map((user) => {
        const profileIconLink = user["ProfileIconLink"];
        const displayName = user["displayName"];
        const userID = user["userID"];
        const username = user["username"];
        appendDirect(userID, username, displayName, profileIconLink);
      });
    })
    .catch((error) => {
      // Handle any errors that occurred during the request
      console.error(error);
    });
}

function appendGroup(groupID, groupIconLink, groupName) {
  // Create the parent container div
  const containerDiv = document.createElement("div");
  containerDiv.className = "ps-4 mt-4 w-100";
  containerDiv.role = "button";
  containerDiv.id = groupID;

  // Create the profile image element
  const profileImage = document.createElement("img");
  profileImage.alt = `${groupName}'s profile picture`;
  profileImage.draggable = false;
  profileImage.src = groupIconLink;
  profileImage.width = "30";
  profileImage.height = "30";
  profileImage.className = "rounded-circle";

  // Create the first span element for the username
  const groupNameSpan = document.createElement("span");

  const groupModal = document.getElementById("groupModal");
  const groupHeader = document.getElementById("groupName");
  const profileIconPreview = document.getElementById("profileIconPreview");
  const changeGroupName = document.getElementById("changeGroupName");
  const closeModal = document.getElementById("closeModal");

  groupNameSpan.textContent = groupName + " ";

  containerDiv.addEventListener("dblclick", function () {
    containerDiv.className = "ps-4 mt-4 w-100 bg-info";
    currentlySelectedGroupID = groupID;

    groupModal.classList.add("show");
    groupModal.style.display = "block";
    document.body.classList.add("modal-open");

    groupHeader.textContent = groupName;
    changeGroupName.value = groupName;

    profileIconPreview.src = groupIconLink;

    fetch(`http://127.0.0.1:5000/api/group/groupMembers?groupID=${groupID}`)
      .then((response) => response.json())
      .then((data) => {
        clearMemberList();
        data.map((groupMember) => {
          const userID = groupMember["UserID"];
          const ownerID = groupMember["OwnerID"];
          const username = groupMember["Username"];
          const displayName = groupMember["DisplayName"];
          const profileIcon = groupMember["ProfileIconLink"];
          appendMember(username, displayName, profileIcon, userID, ownerID);
        });
      })
      .catch((error) => {
        // Handle any errors that occurred during the request
        console.error(error);
      });
  });

  const showMembers = document.querySelector("#showMembers");

  function appendMember(username, displayName, profileIcon, userID, ownerID) {
    const divElement = document.createElement("div");
    divElement.className =
      "input-group-text d-flex align-items-center flex-column";

    const memberElement = document.createElement("div");
    memberElement.style.height = "70px";
    memberElement.className = "mb-4";

    // Create an img element
    const imgElement = document.createElement("img");
    imgElement.alt = `${username}'s profile picture`;
    imgElement.draggable = false;
    imgElement.src = profileIcon;
    imgElement.setAttribute("width", "60px");
    imgElement.setAttribute("height", "60px");
    imgElement.className = "rounded-circle";

    // Create the first span element
    const spanElement1 = document.createElement("span");
    spanElement1.className = "ms-2 display-6";
    spanElement1.textContent = username;

    // Create the second span element
    const spanElement2 = document.createElement("span");
    spanElement2.textContent = displayName;
    spanElement2.className = "ms-2";

    // Append all elements to the div
    memberElement.appendChild(imgElement);
    memberElement.appendChild(spanElement1);
    memberElement.appendChild(spanElement2);

    divElement.appendChild(memberElement);
    if (userID != ownerID) {
      const removeMember = document.createElement("div");
      removeMember.className = "btn btn-primary input-group";
      removeMember.textContent = "Remove";
      removeMember.role = "button";

      const transferOwnership = document.createElement("div");
      transferOwnership.className = "btn btn-primary input-group mt-2";
      transferOwnership.textContent = "Crown";
      transferOwnership.role = "button";
      divElement.appendChild(removeMember);
      divElement.appendChild(transferOwnership);
    }

    // Append the div to the main's first child
    showMembers.appendChild(divElement);
  }

  closeModal.addEventListener("click", function () {
    groupModal.classList.remove("show");
    groupModal.style.display = "none";
    document.body.classList.remove("modal-open");
  });

  function clearMemberList() {
    while (showMembers.childNodes[0]) {
      showMembers.removeChild(showMembers.childNodes[0]);
    }
  }

  // Append the elements to the parent container div in the desired order
  containerDiv.appendChild(profileImage);
  containerDiv.appendChild(groupNameSpan);

  displayList.appendChild(containerDiv);

  containerDiv.addEventListener("click", function () {
    const prev = document.getElementById(currentlySelectedGroupID);
    containerDiv.className = "ps-4 mt-4 w-100 bg-info";
    if (prev != null) {
      prev.className = "ps-4 mt-4 w-100";
    }
    if (prev == containerDiv) {
      stopShowingGroupMessage(currentlySelectedGroupID);
      currentlySelectedGroupID = 0;
      clearMessage();
    } else {
      stopShowingGroupMessage(currentlySelectedGroupID);
      clearMessage();
      currentlySelectedGroupID = groupID;
      showGroupMessage(currentlySelectedGroupID);
    }
  });
}

function appendDirect(userID, username, displayName, profileIconLink) {
  // Create the parent container div
  const containerDiv = document.createElement("div");
  containerDiv.className = "ps-4 mt-4 w-100";
  containerDiv.role = "button";
  containerDiv.id = userID;

  // Create the profile image element
  const profileImage = document.createElement("img");
  profileImage.alt = `${displayName}'s profile picture`;
  profileImage.draggable = false;
  profileImage.src = profileIconLink;
  profileImage.width = "30";
  profileImage.height = "30";
  profileImage.className = "rounded-circle";

  // Create the first span element for the username
  const displayNameSpan = document.createElement("span");
  displayNameSpan.textContent = displayName + " ";

  // Append the elements to the parent container div in the desired order
  containerDiv.appendChild(profileImage);
  containerDiv.appendChild(displayNameSpan);

  displayList.appendChild(containerDiv);

  containerDiv.addEventListener("dblclick", function () {
    window.open(
      `http://127.0.0.1:5501/app/profile.html?Username=${username}`,
      "_blank"
    );
  });
  containerDiv.addEventListener("click", function () {
    const prev = document.getElementById(currentlySelectedUserID);
    containerDiv.className = "ps-4 mt-4 w-100 bg-info";
    if (prev != null) {
      prev.className = "ps-4 mt-4 w-100";
    }
    if (prev == containerDiv) {
      currentlySelectedUserID = 0;
      stopShowingDirectMessage(currentUserUserID, currentlySelectedUserID);
      clearMessage();
    } else {
      stopShowingDirectMessage(currentUserUserID, currentlySelectedUserID);
      clearMessage();
      currentlySelectedUserID = userID;
      showDirectMessage(
        currentUserUserID,
        currentlySelectedUserID,
        profileIconLink,
        displayName
      );
    }
  });
}

sendMessageButton.addEventListener("click", function () {
  if (currentlySelectedUserID == 0 && userSelection.textContent == "Direct") {
    alert("Select someone");
  }
  if (currentlySelectedGroupID == 0 && userSelection.textContent == "Group") {
    alert("Select a group");
  }
  if (currentlySelectedGroupID != 0) {
    let message = textAndEmojiToText();
    console.log(message.length);
    if (message.length == 0) {
      alert("Please have something to say");
    } else if (message.length > 1100) {
      alert("Woah buddy, too much. Cut that down");
    } else {
      sendGroupMessage(currentUserUserID, currentlySelectedGroupID, message);
    }
  } else if (currentlySelectedUserID != 0) {
    let message = textAndEmojiToText();
    console.log(message.length);
    if (message.length == 0) {
      alert("Please have something to say");
    } else if (message.length > 1100) {
      alert("Woah buddy, too much. Cut that down");
    } else {
      sendDirectMessage(currentlySelectedUserID, message);
    }
  }
});
