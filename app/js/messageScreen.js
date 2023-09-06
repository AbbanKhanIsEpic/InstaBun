import { sendDirectMessage } from "./message.js";
import { textAndEmojiToText } from "./emoji.js";
import { showDirectMessage } from "./message.js";
import { stopShowingDirectMessage } from "./message.js";

const sendMessageButton = document.querySelector("#sendMessageButton");
const selectGroups = document.querySelector("#selectGroups");
const selectDirect = document.querySelector("#selectDirect");
const userSelection = document.querySelector("#userSelection");
const displayList = document.querySelector("#displayInteractions");
const messageOutput = document.querySelector("#messageOutput");

let currentlySelectedUserID = 0;
let currentlySelectedGroupID = 0;

getDirectList();

selectDirect.addEventListener("click", function () {
  clearList();
  userSelection.textContent = "Direct";
  getDirectList();
});

selectGroups.addEventListener("click", function () {
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
        appendGroup(groupID,groupIconLink,groupName)
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

function appendGroup(groupID,groupIconLink,groupName){
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
  groupNameSpan.textContent = groupName + " ";

  profileImage.dataset.bsToggle = "modal";
  profileImage.dataset.bsTarget = "#groupModal";

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
      currentlySelectedGroupID = 0;
      clearMessage();
    } else {
      clearMessage();
      currentlySelectedGroupID = groupID;
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
  if (currentlySelectedUserID == 0) {
    alert("Select someone");
  } else {
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
