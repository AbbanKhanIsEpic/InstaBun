import { textAndEmojiToText } from "./emoji.js";
import { sendDirectMessage } from "./message.js";
import { showDirectMessage } from "./message.js";
import { stopShowingDirectMessage } from "./message.js";

const sendMessageButton = document.querySelector("#sendMessageButton");
const inputText = document.querySelector("#inputMessage");
const selectGroups = document.querySelector("#selectGroups");
const selectDirect = document.querySelector("#selectDirect");
const userSelection = document.querySelector("#userSelection");
const displayList = document.querySelector("#displayInteractions");
const messageOutput = document.querySelector("#messageOutput");

let currentlySelected = 0;

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
        console.log(group);
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
    const prev = document.getElementById(currentlySelected);
    containerDiv.className = "ps-4 mt-4 w-100 bg-info";
    if (prev != null) {
      prev.className = "ps-4 mt-4 w-100";
    }
    if (prev == containerDiv) {
      currentlySelected = 0;
      stopShowingDirectMessage(currentUserUserID, currentlySelected);
      clearMessage();
    } else {
      stopShowingDirectMessage(currentUserUserID, currentlySelected);
      clearMessage();
      currentlySelected = userID;
      showDirectMessage(
        currentUserUserID,
        currentlySelected,
        profileIconLink,
        displayName
      );
    }
  });
}

sendMessageButton.addEventListener("click", function () {
  console.log(inputText.innerText);
});
