// directMessageThread.js
let latestMessageID = 0;
let senderID;
let receiverID;

self.onmessage = function (communicatorData) {
  userID = communicatorData.data["senderID"];
  receiverID = communicatorData.data["receiverID"];
  getMessages();
};

function getMessages() {
  const server = "http://127.0.0.1:5000/api/direct/message";
  const query = `?senderID=${userID}&receiverID=${receiverID}&messageID=${latestMessageID}`;

  fetch(server + query)
    .then((response) => response.json())
    .then((data) => {
      let lastestMessage = data[data.length - 1];
      //The cases where latestMessage will be undefined
      //Is when there is no new message at all
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
