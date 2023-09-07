let latestMessageID = 0;
let userID;
let groupID;

self.onmessage = function (communicatorData) {
  console.log(communicatorData.data);
  userID = communicatorData.data["userID"];
  groupID = communicatorData.data["groupID"];
  getMessages();
};

function getMessages() {
  const server = "http://127.0.0.1:5000/api/group/message";
  const query = `?userID=${userID}&groupID=${groupID}&messageID=${latestMessageID}`;

  fetch(server + query)
    .then((response) => response.json())
    .then((data) => {
      let lastestMessage = data[data.length - 1];
      if (lastestMessage != undefined) {
        latestMessageID = lastestMessage["MessageID"];
      }
      postMessage(data);
    })
    .catch((error) => {
      // Handle any errors that occurred during the request
      console.error(error);
    });
  setTimeout(getMessages, 2000);
}
