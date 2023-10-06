//Imports
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

//Init global variables
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
const uploadNewProfileIcon = document.getElementById("uploadNewGroupIcon");
const newGroupIconPreview = document.getElementById("newGroupIconPreview");
const createGroupButton = document.getElementById("createGroupButton");
const updateGroup = document.getElementById("updateGroup");
const leaveGroup = document.getElementById("leaveGroup");
const deleteGroup = document.getElementById("deleteGroup");
const addUser = document.querySelector("#addUserButton");
const addUserUsernameInput = document.querySelector("#addUserInput");
const createGroupName = document.querySelector("#createGroupName");
const addUserForNewGroupButton = document.getElementById(
  "addUserForNewGroupButton"
);
const addUserForNewGroupInput = document.getElementById(
  "addUserForNewGroupInput"
);
const showNewMemberInNewGroup = document.getElementById(
  "showNewMemberInNewGroup"
);

const showMembers = document.querySelector("#showMembers");

let newGroupIcon = null;

createGroupModal.dataset.bsToggle = "modal";
createGroupModal.dataset.bsTarget = "#createGroupModal";

let selectedFile = null;
let originalGroupName = null;
let confirmClear = false;

let currentlySelectedUserID = 0;
let currentlySelectedGroupID = 0;

const membersForNewGroup = [];
const membersForCurrentGroup = [];

userSelection.textContent = "Direct";

getDirectList();

showOwnerForNewGroup();

//Event listeners

sendMessageButton.addEventListener("click", function () {
  if (currentlySelectedUserID == 0 && userSelection.textContent == "Direct") {
    alert("Select someone");
  }
  if (currentlySelectedGroupID == 0 && userSelection.textContent == "Groups") {
    alert("Select a group");
  }
  if (currentlySelectedGroupID != 0) {
    const message = textAndEmojiToText();
    if (message.length == 0) {
      alert("Please have something to say");
    } else if (message.length > 1100) {
      alert("Message too long, max length is 1100");
    } else {
      sendGroupMessage(currentUserUserID, currentlySelectedGroupID, message);
    }
  } else if (currentlySelectedUserID != 0) {
    let message = textAndEmojiToText();
    if (message.length == 0) {
      alert("Please have something to say");
    } else if (message.length > 1100) {
      alert("Message too long, max length is 1100");
    } else {
      sendDirectMessage(currentlySelectedUserID, message);
    }
  }
});

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

addUserForNewGroupButton.addEventListener("click", function () {
  let isNotExistingMember = false;
  showNewMemberInNewGroup.childNodes.forEach((member) => {
    const memberUsername = member.firstChild.childNodes[1].textContent;
    if (
      memberUsername.toLowerCase() ==
      addUserForNewGroupInput.value.toLowerCase()
    ) {
      alert("You can not add an existing member");
      isNotExistingMember = true;
      return;
    }
  });
  if (!isNotExistingMember) {
    fetch(
      `http://127.0.0.1:5000/api/user/usernameExist?username=${addUserForNewGroupInput.value}`
    )
      .then((response) => response.json())
      .then((data) => {
        if (!data) {
          alert("User does not exits");
        } else {
          fetch(
            `http://127.0.0.1:5000/api/user/userID?username=${addUserForNewGroupInput.value}`
          )
            .then((response) => response.json())
            .then((data) => {
              let userID = data["UserID"];
              showMememberForNewGroup(addUserForNewGroupInput.value, userID);
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

createGroupButton.addEventListener("click", function () {
  console.log(membersForNewGroup);
  if (showNewMemberInNewGroup.children.length < 3) {
    alert("To create a group, there must be a minimum of 3 people");
  } else if (newGroupIcon == null) {
    alert("To create a group, there must be a group icon");
  } else if (createGroupName.value.length == 0) {
    alert("To create a group, there must be a group name");
  } else if (createGroupName.value.length > 100) {
    alert("The group name is too long. Maximum length is 100 characters");
  } else {
    createGroup();
  }
});

uploadNewProfileIcon.addEventListener("change", function () {
  newGroupIcon = event.target.files[0];
  if (newGroupIcon.type.match("image.*")) {
    const reader = new FileReader();
    reader.addEventListener("load", (event) => {
      newGroupIconPreview.src = event.target.result;
    });
    reader.readAsDataURL(newGroupIcon);
  } else {
    alert("Sorry, only images");
  }
});

selectDirect.addEventListener("click", function () {
  stopShowingDirectMessage(currentUserUserID, currentlySelectedUserID);
  stopShowingGroupMessage(currentlySelectedGroupID);
  currentlySelectedGroupID = 0;
  currentlySelectedUserID = 0;
  clearList();
  userSelection.textContent = "Direct";
  getDirectList();
});

selectGroups.addEventListener("click", function () {
  stopShowingDirectMessage(currentUserUserID, currentlySelectedUserID);
  stopShowingGroupMessage(currentlySelectedGroupID);
  currentlySelectedGroupID = 0;
  currentlySelectedUserID = 0;
  clearList();
  userSelection.textContent = "Groups";
  getGroupList();
});

addUser.addEventListener("click", function () {
  let isNotExistingMember = false;
  showMembers.childNodes.forEach((member) => {
    const memberUsername = member.firstChild.childNodes[1].textContent;
    if (
      memberUsername.toLowerCase() == addUserUsernameInput.value.toLowerCase()
    ) {
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
  if (selectedFile != null) {
    await updateCurrentGroupIcon();
  }
  if (changeGroupName.value != originalGroupName) {
    if (changeGroupName.value.length > 100) {
      alert("Group name too long");
    } else if (changeGroupName.value.length == 0) {
      alert("Group must have a name");
    } else {
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
  }
});

deleteGroup.addEventListener("click", function () {
  var dataObject = {
    groupID: currentlySelectedGroupID,
    groupMembers: membersForCurrentGroup,
  };
  var jsonObject = JSON.stringify(dataObject);
  fetch("http://127.0.0.1:5000/api/group/delete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: jsonObject,
  })
    .then((response) => response.text())
    .then((responseData) => {
      alert("Group deleted: Might need to refresh to view affect");
    })
    .catch((error) => {
      alert("Unable to delete group");
    });
});

//Functions

async function showMememberForNewGroup(username, userID) {
  fetch(`http://127.0.0.1:5000/api/user/displayName?userID=${userID}`)
    .then((response) => response.json())
    .then(async (data) => {
      const displayName = await data["DisplayName"];

      fetch(`http://127.0.0.1:5000/api/user/profileIcon?userID=${userID}`)
        .then((response) => response.json())
        .then(async (data) => {
          membersForNewGroup.push(userID);
          let profileIcon = await data["ProfileIconLink"];

          // Create a new div element
          const memeberElement = document.createElement("div");
          memeberElement.className =
            "input-group-text d-flex align-items-center flex-column";

          // Create the first inner div element with the class 'mb-4' and inline style
          const innerDiv1 = document.createElement("div");
          innerDiv1.className = "mb-4";
          innerDiv1.style.height = "70px";

          // Create an img element
          const imgElement = document.createElement("img");
          imgElement.alt = `${username}'s profile picture`;
          imgElement.draggable = false;
          imgElement.src = profileIcon;
          imgElement.width = "60";
          imgElement.height = "60";
          imgElement.className = "rounded-circle";
          imgElement.role = "button";

          imgElement.addEventListener("click", function () {
            window.open(
              `http://127.0.0.1:5501/app/profile.html?Username=${username}`,
              "_blank"
            );
          });

          // Create a span element to show username
          const userNameElement = document.createElement("span");
          userNameElement.className = "ms-2 display-6";
          userNameElement.textContent = username;

          // Create a span element to show display name
          const displayNameElement = document.createElement("span");
          displayNameElement.className = "ms-2";
          displayNameElement.textContent = displayName;

          // Append the img and span elements to innerDiv1
          innerDiv1.appendChild(imgElement);
          innerDiv1.appendChild(userNameElement);
          innerDiv1.appendChild(displayNameElement);

          // Create the 'Remove' button
          const removeButton = document.createElement("div");
          removeButton.className = "btn btn-danger input-group";
          removeButton.textContent = "Remove";
          removeButton.role = "button";

          removeButton.addEventListener("click", function () {
            membersForNewGroup.pop(userID);
            showNewMemberInNewGroup.removeChild(memeberElement);
          });

          // Append innerDiv1 and removeButton to the main div
          memeberElement.appendChild(innerDiv1);
          memeberElement.appendChild(removeButton);

          showNewMemberInNewGroup.appendChild(memeberElement);
        })
        .catch((error) => {
          // Handle any errors that occurred during the request
          console.error(error);
        });
    })
    .catch((error) => {
      // Handle any errors that occurred during the request
      console.error(error);
    });
}

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
      data.map((user) => {
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

async function updateCurrentGroupIcon() {
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

async function createGroup() {
  //Since it is a new group -> there is no way to get the groupID
  const url = `/profileIcon/${currentUserUserID}:${currentUserUserID}`;
  const storageRef = ref(storage, url);
  uploadBytes(storageRef, newGroupIcon)
    .then((snapshot) => {
      console.log("Image uploaded successfully!");
      getDownloadURL(storageRef).then((url) => {
        var dataObject = {
          userID: currentUserUserID,
          groupName: createGroupName.value,
          groupIcon: url,
          groupMember: membersForNewGroup,
        };
        var jsonObject = JSON.stringify(dataObject);
        fetch("http://127.0.0.1:5000/api/group/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
          body: jsonObject,
        })
          .then((response) => response.text())
          .then((responseData) => {
            alert("Group created: Might need to refresh to view affect");
          })
          .catch((error) => {
            alert("Unable to create group");
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
    membersForCurrentGroup.push(userID);
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
    const usernameElement = document.createElement("span");
    usernameElement.className = "ms-2 display-6";
    usernameElement.textContent = username;

    // Create the second span element
    const displayElement = document.createElement("span");
    displayElement.textContent = displayName;
    displayElement.className = "ms-2";

    // Append all elements to the div
    memberElement.appendChild(imgElement);
    memberElement.appendChild(usernameElement);
    memberElement.appendChild(displayElement);

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
    membersForCurrentGroup.pop(
      membersForCurrentGroup[membersForCurrentGroup.length - 1]
    );
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

function showOwnerForNewGroup() {
  membersForNewGroup.push(currentUserUserID);
  fetch(
    `http://127.0.0.1:5000/api/user/displayName?userID=${currentUserUserID}`
  )
    .then((response) => response.json())
    .then(async (displayName) => {
      // Create a new div element
      const memeberElement = document.createElement("div");
      memeberElement.className =
        "input-group-text d-flex align-items-center flex-column";

      // Create the first inner div element with the class 'mb-4' and inline style
      const innerDiv1 = document.createElement("div");
      innerDiv1.className = "mb-4";
      innerDiv1.style.height = "70px";

      // Create an img element
      const imgElement = document.createElement("img");
      imgElement.alt = `${currentUserUsername}'s profile picture`;
      imgElement.draggable = false;
      imgElement.src = currentUserProfileLink;
      imgElement.width = "60";
      imgElement.height = "60";
      imgElement.className = "rounded-circle";
      imgElement.role = "button";

      imgElement.addEventListener("click", function () {
        window.open(
          `http://127.0.0.1:5501/app/profile.html?Username=${currentUserUsername}`,
          "_blank"
        );
      });

      // Create a span element to show username
      const userNameElement = document.createElement("span");
      userNameElement.className = "ms-2 display-6";
      userNameElement.textContent = currentUserUsername;

      // Create a span element to show display name
      const displayNameElement = document.createElement("span");
      displayNameElement.className = "ms-2";
      displayNameElement.textContent = displayName["DisplayName"];

      // Append the img and span elements to innerDiv1
      innerDiv1.appendChild(imgElement);
      innerDiv1.appendChild(userNameElement);
      innerDiv1.appendChild(displayNameElement);

      // Append innerDiv1 to the main div
      memeberElement.appendChild(innerDiv1);

      showNewMemberInNewGroup.appendChild(memeberElement);
    })
    .catch((error) => {
      // Handle any errors that occurred during the request
      console.error(error);
    });
}
