import { textToTextAndEmoji } from "./emoji.js";

const messageOutput = document.querySelector("#messageOutput");

let directMessageWorker;
let groupMessageWorker;

let currentUserDisplayName;

fetch(`http://127.0.0.1:5000/api/user/displayName?userID=${currentUserUserID}`)
  .then((response) => response.json())
  .then((data) => {
    currentUserDisplayName = data[0]["DisplayName"];
  })
  .catch((error) => {
    // Handle any errors that occurred during the request
    console.error(error);
  });

export function sendDirectMessage(recieverID, message) {
  message = message
    .replace(/"/g, '\\"')
    .replace(/'/g, "\\'")
    .replace(/\\/g, "\\\\");

  console.log(message.length);
  fetch(
    `http://127.0.0.1:5000/api/direct/permission?senderID=${currentUserUserID}&receiverID=${recieverID}`
  )
    .then((response) => response.json())
    .then((data) => {
      if (data) {
        var dataObject = {
          senderID: currentUserUserID,
          receiverID: recieverID,
          message: message,
        };

        // Convert the JavaScript object to a JSON string
        var jsonObject = JSON.stringify(dataObject);

        fetch("http://127.0.0.1:5000/api/direct/message", {
          method: "POST",
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
          body: jsonObject,
        })
          .then((response) => response.text())
          .then((responseData) => {})
          .catch((error) => {});
      } else {
        alert("You do not have permission to send message");
      }
    })
    .catch((error) => {
      alert("Unable to send message");
      console.error(error);
    });
}

export function showDirectMessage(
  currentUserID,
  receiverID,
  receiverProfileIcon,
  receiverDisplayName
) {
  if (typeof directMessageWorker == "undefined") {
    directMessageWorker = new Worker("/app/js/directMessageThread.js");
    directMessageWorker.onmessage = function (messages) {
      messages.data.map((message) => {
        const messageSent = message["Message"];
        const messageID = message["MessageID"];
        const senderID = message["SenderID"];
        const time = message["Time"];
        if (senderID == currentUserID) {
          showSenderMessage(messageID, messageSent, time, false);
        } else {
          showReceiverMessage(
            messageSent,
            time,
            receiverProfileIcon,
            receiverDisplayName
          );
        }
      });
    };
    const communicatorData = {
      senderID: currentUserID,
      receiverID: receiverID,
    };
    directMessageWorker.postMessage(communicatorData);
  }
}

function showSenderMessage(messageID, messageSent, time, isGroup) {
  // Create the main div element
  const mainDiv = document.createElement("div");
  mainDiv.classList.add(
    "me-4",
    "ms-4",
    "mt-4",
    "d-flex",
    "align-items-end",
    "flex-column",
    "bg-success",
    "rounded"
  );
  mainDiv.setAttribute("aria-label", "message send");

  // Create the inner div element
  const innerDiv = document.createElement("div");
  innerDiv.classList.add(
    "d-flex",
    "align-items-end",
    "flex-column",
    "ps-2",
    "pe-2",
    "pt-1",
    "w-100"
  );

  // Create the delete button
  const deleteButton = document.createElement("span");
  deleteButton.classList.add("btn", "btn-primary");
  deleteButton.textContent = "Delete";

  // Create the profile picture image
  const profileImage = document.createElement("img");
  profileImage.alt = "killerbunny1619's profile picture";
  profileImage.draggable = false;
  profileImage.src = currentUserProfileLink;
  profileImage.width = "30";
  profileImage.height = "30";
  profileImage.classList.add("rounded-circle");

  // Append the delete button and profile image to a div element
  const spanElement = document.createElement("div");
  spanElement.classList.add("d-flex", "justify-content-between", "w-100");

  spanElement.appendChild(deleteButton);
  spanElement.appendChild(profileImage);

  // Create the lead div
  const leadDiv = document.createElement("div");
  leadDiv.classList.add("lead");

  // Create the username and timestamp spans within the lead div
  const displayNameSpan = document.createElement("span");
  displayNameSpan.textContent = currentUserDisplayName + "\t";

  const timestampSpan = document.createElement("span");
  timestampSpan.classList.add("small");
  var inputDatetime = new Date(time);

  var outputDatetimeStr =
    inputDatetime.getFullYear() +
    "/" +
    ("0" + (inputDatetime.getMonth() + 1)).slice(-2) +
    "/" +
    ("0" + inputDatetime.getDate()).slice(-2) +
    " " +
    ("0" + inputDatetime.getHours()).slice(-2) +
    ":" +
    ("0" + inputDatetime.getMinutes()).slice(-2) +
    ":" +
    ("0" + inputDatetime.getSeconds()).slice(-2) +
    " " +
    (inputDatetime.getHours() >= 12 ? "pm" : "am");
  timestampSpan.textContent = outputDatetimeStr;

  leadDiv.appendChild(displayNameSpan);
  leadDiv.appendChild(timestampSpan);

  const message = textToTextAndEmoji(messageSent);

  innerDiv.appendChild(spanElement);
  innerDiv.appendChild(leadDiv);
  innerDiv.appendChild(message);

  mainDiv.appendChild(innerDiv);

  messageOutput.appendChild(mainDiv);

  deleteButton.addEventListener("click", function () {
    messageOutput.removeChild(mainDiv);
    if (isGroup) {
      deleteGroupMessage(messageID);
    } else {
      deleteDirectMessage(messageID);
    }
  });
}

function deleteDirectMessage(messageID) {
  var dataObject = {
    messageID: messageID,
  };

  // Convert the JavaScript object to a JSON string
  var jsonObject = JSON.stringify(dataObject);

  fetch("http://127.0.0.1:5000/api/direct/deleteMessage", {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: jsonObject,
  })
    .then((response) => response.text())
    .then((responseData) => {})
    .catch((error) => {
      alert("Unable to delete message");
    });
}

function showReceiverMessage(
  messageSent,
  time,
  receiverProfileIcon,
  receiverDisplayName
) {
  // Create a div element with the class "me-4 ms-4 mt-4 bg-secondary rounded"
  const messageDiv = document.createElement("div");
  messageDiv.className = "me-4 ms-4 mt-4 bg-secondary rounded";
  messageDiv.setAttribute("aria-label", "message recieve");

  // Create the inner elements and set their attributes and content
  const innerDiv = document.createElement("div");
  innerDiv.className = "ps-2 pt-2";

  const profileImage = document.createElement("img");
  profileImage.setAttribute("alt", `${receiverDisplayName}'s profile picture`);
  profileImage.setAttribute("draggable", "false");
  profileImage.setAttribute("src", receiverProfileIcon);
  profileImage.setAttribute("width", "30px");
  profileImage.setAttribute("height", "30px");
  profileImage.className = "rounded-circle";

  const leadDiv = document.createElement("div");
  leadDiv.className = "lead";

  const usernameSpan = document.createElement("span");
  usernameSpan.textContent = receiverDisplayName + "\t";

  const dateSpan = document.createElement("span");
  dateSpan.className = "small";
  var inputDatetime = new Date(time);

  var outputDatetimeStr =
    inputDatetime.getFullYear() +
    "/" +
    ("0" + (inputDatetime.getMonth() + 1)).slice(-2) +
    "/" +
    ("0" + inputDatetime.getDate()).slice(-2) +
    " " +
    ("0" + inputDatetime.getHours()).slice(-2) +
    ":" +
    ("0" + inputDatetime.getMinutes()).slice(-2) +
    ":" +
    ("0" + inputDatetime.getSeconds()).slice(-2) +
    " " +
    (inputDatetime.getHours() >= 12 ? "pm" : "am");
  dateSpan.textContent = outputDatetimeStr;

  const message = textToTextAndEmoji(messageSent);

  // Append the inner elements to the appropriate parent elements
  leadDiv.appendChild(usernameSpan);
  leadDiv.appendChild(dateSpan);

  innerDiv.appendChild(profileImage);
  innerDiv.appendChild(leadDiv);
  innerDiv.appendChild(message);

  messageDiv.appendChild(innerDiv);

  messageOutput.appendChild(messageDiv);
}

export function stopShowingDirectMessage() {
  if (directMessageWorker != undefined) {
    directMessageWorker.terminate();
  }
  directMessageWorker = undefined;
}

export function showGroupMessage(groupID) {
  if (typeof groupMessageWorker == "undefined") {
    groupMessageWorker = new Worker("/app/js/groupMessageThread.js");
    groupMessageWorker.onmessage = function (messages) {
      messages.data.map((message) => {
        console.log(message);
        const messageSent = message["Message"];
        const messageID = message["MessageID"];
        const senderID = message["UserID"];
        const displayName = message["DisplayName"];
        const profileIcon = message["ProfileIconLink"];
        const time = message["Time"];
        if (senderID == currentUserUserID) {
          showSenderMessage(messageID, messageSent, time, true);
        } else {
          showReceiverMessage(messageSent, time, profileIcon, displayName);
        }
      });
    };
    const communicatorData = {
      userID: currentUserUserID,
      groupID: groupID,
    };
    groupMessageWorker.postMessage(communicatorData);
  }
}

export function stopShowingGroupMessage() {
  if (groupMessageWorker != undefined) {
    groupMessageWorker.terminate();
  }
  groupMessageWorker = undefined;
}

export function sendGroupMessage(senderID, groupID, message) {
  message = message
    .replace(/"/g, '\\"')
    .replace(/'/g, "\\'")
    .replace(/\\/g, "\\\\");

  var dataObject = {
    senderID: senderID,
    groupID: groupID,
    message: message,
  };

  // Convert the JavaScript object to a JSON string
  var jsonObject = JSON.stringify(dataObject);

  fetch("http://127.0.0.1:5000/api/group/message", {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: jsonObject,
  })
    .then((response) => response.text())
    .then((responseData) => {})
    .catch((error) => {});
}

function deleteGroupMessage(messageID) {
  var dataObject = {
    messageID: messageID,
  };

  // Convert the JavaScript object to a JSON string
  var jsonObject = JSON.stringify(dataObject);

  fetch("http://127.0.0.1:5000/api/group/message", {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: jsonObject,
  })
    .then((response) => response.text())
    .then((responseData) => {})
    .catch((error) => {
      alert("Unable to delete message");
    });
}

export function clearDirectMessage(receiverID) {
  var dataObject = {
    senderID: currentUserUserID,
    receiverID: receiverID,
  };

  // Convert the JavaScript object to a JSON string
  var jsonObject = JSON.stringify(dataObject);

  fetch("http://127.0.0.1:5000/api/direct/clearMessage", {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: jsonObject,
  })
    .then((response) => response.text())
    .then((responseData) => {
      alert("Message cleared");
    })
    .catch((error) => {
      alert("Unable to delete message");
    });
}

export function clearGroupMessage(groupID) {
  var dataObject = {
    userID: currentUserUserID,
    groupID: groupID,
  };

  // Convert the JavaScript object to a JSON string
  var jsonObject = JSON.stringify(dataObject);

  fetch("http://127.0.0.1:5000/api/group/clearMessage", {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: jsonObject,
  })
    .then((response) => response.text())
    .then((responseData) => {
      alert("Message cleared");
    })
    .catch((error) => {
      alert("Unable to delete message");
    });
}
