import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/9.4.0/firebase-storage.js";
import { initFirebase } from "/app/js/firebase-setup.js";

import { sendDirectMessage } from "./message.js";
import { textAndEmojiToText } from "./emoji.js";
import { showDirectMessage } from "./message.js";
import { stopShowingDirectMessage } from "./message.js";
import { showGroupMessage } from "./message.js";
import { stopShowingGroupMessage } from "./message.js";
import { sendGroupMessage } from "./message.js";
import { clearGroupMessage } from "./message.js";
import { clearDirectMessage } from "./message.js";

const app = initFirebase();
const storage = getStorage(app);

const sendMessageButton = document.querySelector("#sendMessageButton");
const selectGroups = document.querySelector("#selectGroups");
const selectDirect = document.querySelector("#selectDirect");
const userSelection = document.querySelector("#userSelection");
const displayList = document.querySelector("#displayInteractions");
const messageOutput = document.querySelector("#messageOutput");
const clearMessageConvesation = document.querySelector("#clearMessage");
const groupModal = document.getElementById("groupModal");
const createGroupModal = document.getElementById("createGroup");
const groupHeader = document.getElementById("groupName");
const profileIconPreview = document.getElementById("profileIconPreview");
const changeGroupName = document.getElementById("changeGroupName");
const closeModal = document.getElementById("closeModal");
const uploadGroupProfile = document.getElementById("uploadGroupProfile");
const uploadProfileIcon = document.getElementById("uploadProfileIcon");
const uploadNewProfileIcon = document.getElementById("uploadNewProfileIcon");
const newProfileIconPreview = document.getElementById("newProfileIconPreview");
const addUserForNewGroupButton = document.getElementById(
  "addUserForNewGroupButton"
);
const addUserForNewGroupInput = document.getElementById(
  "addUserForNewGroupInput"
);
const showMembers = document.querySelector("#showMembers");

createGroupModal.dataset.bsToggle = "modal";
createGroupModal.dataset.bsTarget = "#createGroupModal";

addUserForNewGroupButton.addEventListener("click", function () {
  fetch(
    `http://127.0.0.1:5000/api/user/usernameExist?username=${addUserForNewGroupInput.value}`
  )
    .then((response) => response.json())
    .then((data) => {
      if (!data) {
        alert("User does not exits");
      } else {
      }
    })
    .catch((error) => {
      // Handle any errors that occurred during the request
      console.error(error);
    });
});

uploadNewProfileIcon.addEventListener("change", function () {
  console.log("Hi");
  let file = event.target.files[0];
  if (file.type.match("image.*")) {
    const reader = new FileReader();
    reader.addEventListener("load", (event) => {
      newProfileIconPreview.src = event.target.result;
    });
    reader.readAsDataURL(file);
  } else {
    alert("Sorry, only images");
  }
});

let selectedFile = null;
let originalGroupName = null;

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
        const ownerID = group["OwnerID"];
        const groupIconLink = group["GroupIconLink"];
        const groupName = group["GroupName"];
        appendGroup(ownerID, groupID, groupIconLink, groupName);
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
      console.log(data);
      data.map((user) => {
        console.log(user);
        const profileIconLink = user.profileIconLink;
        const displayName = user.displayName;
        const userID = user.userID;
        const username = user.username;
        appendDirect(userID, username, displayName, profileIconLink);
      });
    })
    .catch((error) => {
      // Handle any errors that occurred during the request
      console.error(error);
    });
}

const updateGroup = document.getElementById("updateGroup");
const leaveGroup = document.getElementById("leaveGroup");
const deleteGroup = document.getElementById("deleteGroup");
const addUser = document.querySelector("#addUserButton");
const addUserUsernameInput = document.querySelector("#addUserInput");

leaveGroup.addEventListener("click", function () {
  const numberOfMemebers = showMembers.childNodes.length;
  if (numberOfMemebers == 3) {
    alert("Can not leave because group needs a minium of three people");
  } else {
    var dataObject = {
      groupID: currentlySelectedGroupID,
      userID: currentUserUserID,
    };
    var jsonObject = JSON.stringify(dataObject);
    fetch("http://127.0.0.1:5000/api/group/removeMember", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: jsonObject,
    })
      .then((response) => response.text())
      .then((responseData) => {
        alert("Left group: Might need to refresh to view affect");
      })
      .catch((error) => {
        alert("Unable to leave group");
      });
  }
});

updateGroup.addEventListener("click", async function () {
  console.log(selectedFile != null);
  if (selectedFile != null) {
    await uploadFirebase();
  }
  if (changeGroupName.value != originalGroupName) {
    var dataObject = {
      groupID: currentlySelectedGroupID,
      groupName: changeGroupName.value,
    };
    var jsonObject = JSON.stringify(dataObject);
    fetch("http://127.0.0.1:5000/api/group/groupName", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: jsonObject,
    })
      .then((response) => response.text())
      .then((responseData) => {
        alert("Group name updated: Might need to refresh to view affect");
      })
      .catch((error) => {
        alert("Unable to update group name");
      });
  }
});

async function uploadFirebase() {
  const url = `/profileIcon/${currentlySelectedGroupID}:${currentUserUserID}`;
  const storageRef = ref(storage, url);
  uploadBytes(storageRef, selectedFile)
    .then((snapshot) => {
      console.log("Image uploaded successfully!");
      getDownloadURL(storageRef).then((url) => {
        var dataObject = {
          groupID: currentlySelectedGroupID,
          groupIcon: url,
        };
        var jsonObject = JSON.stringify(dataObject);
        fetch("http://127.0.0.1:5000/api/group/groupProfileIcon", {
          method: "POST",
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
          body: jsonObject,
        })
          .then((response) => response.text())
          .then((responseData) => {
            alert(
              "Group profile icon updated: Might need to refresh to view affect"
            );
          })
          .catch((error) => {
            alert("Unable to update group profile icon");
          });
      });
    })
    .catch((error) => {
      console.error("Error uploading image:", error);
    });
}

function appendGroup(groupOwnerID, groupID, groupIconLink, groupName) {
  originalGroupName = groupName;
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

  containerDiv.addEventListener("dblclick", function () {
    if (groupOwnerID != currentUserUserID) {
      updateGroup.classList.add("visually-hidden");
      deleteGroup.classList.add("visually-hidden");
      leaveGroup.classList.remove("visually-hidden");
      changeGroupName.setAttribute("readonly", "readonly");
      uploadGroupProfile.classList.add("visually-hidden");
      addUser.classList.add("visually-hidden");
      addUserUsernameInput.classList.add("visually-hidden");
    } else {
      leaveGroup.classList.add("visually-hidden");
      updateGroup.classList.remove("visually-hidden");
      deleteGroup.classList.remove("visually-hidden");
      uploadGroupProfile.classList.remove("visually-hidden");
      changeGroupName.removeAttribute("readonly", "readonly");
      addUser.classList.remove("visually-hidden");
      addUserUsernameInput.classList.remove("visually-hidden");
    }

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
          const username = groupMember["Username"];
          const displayName = groupMember["DisplayName"];
          const profileIcon = groupMember["ProfileIconLink"];
          appendMember(
            username,
            displayName,
            profileIcon,
            userID,
            groupOwnerID
          );
        });
      })
      .catch((error) => {
        // Handle any errors that occurred during the request
        console.error(error);
      });
  });

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
    imgElement.role = "button";

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

    imgElement.addEventListener("click", function () {
      window.open(
        `http://127.0.0.1:5501/app/profile.html?Username=${username}`,
        "_blank"
      );
    });

    divElement.appendChild(memberElement);

    if (currentUserUserID == ownerID) {
      if (userID != ownerID) {
        const removeMember = document.createElement("div");
        removeMember.className = "btn btn-primary input-group";
        removeMember.textContent = "Remove";
        removeMember.role = "button";

        removeMember.addEventListener("click", function () {
          const numberOfMemebers = showMembers.childNodes.length;
          if (numberOfMemebers == 3) {
            alert(
              "Can not remove member becase group needs a minium of three people"
            );
          } else {
            var dataObject = {
              userID: userID,
              groupID: groupID,
            };

            // Convert the JavaScript object to a JSON string
            var jsonObject = JSON.stringify(dataObject);

            fetch("http://127.0.0.1:5000/api/group/removeMember", {
              method: "POST",
              headers: {
                "Content-Type": "application/json; charset=utf-8",
              },
              body: jsonObject,
            })
              .then((response) => response.text())
              .then((responseData) => {
                alert("Member removed: Might need to refresh to view affect");
              })
              .catch((error) => {
                alert("Unable to remove member");
              });
          }
        });

        const transferOwnership = document.createElement("div");
        transferOwnership.className = "btn btn-primary input-group mt-2";
        transferOwnership.textContent = "Crown";
        transferOwnership.role = "button";

        let confirmTransfer = false;
        transferOwnership.addEventListener("click", function () {
          if (confirmTransfer) {
            var dataObject = {
              newOwnerID: userID,
              groupID: groupID,
            };

            // Convert the JavaScript object to a JSON string
            var jsonObject = JSON.stringify(dataObject);

            fetch("http://127.0.0.1:5000/api/group/transferOwnership", {
              method: "POST",
              headers: {
                "Content-Type": "application/json; charset=utf-8",
              },
              body: jsonObject,
            })
              .then((response) => response.text())
              .then((responseData) => {
                alert(
                  `Transfered ownership to ${username}: Might need to refresh to view affect`
                );
              })
              .catch((error) => {
                alert("Unable to transfer ownership");
              });
          } else {
            alert(
              `Are you sure you want to transfer ownership of the group to ${username}`
            );
            confirmTransfer = true;
          }
        });

        divElement.appendChild(removeMember);
        divElement.appendChild(transferOwnership);
      }
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

addUser.addEventListener("click", function () {
  let isNotExistingMember = false;
  showMembers.childNodes.forEach((member) => {
    const memberUsername = member.firstChild.childNodes[1].textContent;
    if (memberUsername == addUserUsernameInput.value) {
      alert("You can not add an existing member");
      isNotExistingMember = true;
      return;
    }
  });
  if (!isNotExistingMember) {
    fetch(
      `http://127.0.0.1:5000/api/user/usernameExist?username=${addUserUsernameInput.value}`
    )
      .then((response) => response.json())
      .then((data) => {
        if (!data) {
          alert("User does not exits");
        } else {
          fetch(
            `http://127.0.0.1:5000/api/user/userID?username=${addUserUsernameInput.value}`
          )
            .then((response) => response.json())
            .then((data) => {
              const newMemberUserID = data["UserID"];
              var dataObject = {
                userID: newMemberUserID,
                groupID: currentlySelectedGroupID,
              };

              // Convert the JavaScript object to a JSON string
              var jsonObject = JSON.stringify(dataObject);

              fetch("http://127.0.0.1:5000/api/group/addMember", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json; charset=utf-8",
                },
                body: jsonObject,
              })
                .then((response) => response.text())
                .then((responseData) => {
                  alert("Member added: Might need to refresh to view affect");
                })
                .catch((error) => {
                  alert("Unable to add new member");
                });
            })
            .catch((error) => {
              // Handle any errors that occurred during the request
              console.error(error);
            });
        }
      })
      .catch((error) => {
        // Handle any errors that occurred during the request
        console.error(error);
      });
  }
});

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
    const message = textAndEmojiToText();
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

let confirmClear = false;
clearMessageConvesation.addEventListener("click", function () {
  if (currentlySelectedUserID == 0 && userSelection.textContent == "Direct") {
    alert("Select someone");
    confirmClear = false;
  } else if (
    currentlySelectedGroupID == 0 &&
    userSelection.textContent == "Group"
  ) {
    alert("Select a group");
    confirmClear = false;
  } else if (!confirmClear) {
    alert("Are you sure you want to clear all the messages?");
    confirmClear = true;
  } else if (currentlySelectedUserID != 0) {
    clearDirectMessage(currentlySelectedUserID);
    clearMessage();
  } else if (currentlySelectedGroupID != 0) {
    clearGroupMessage(currentlySelectedGroupID);
    clearMessage();
  }
});
