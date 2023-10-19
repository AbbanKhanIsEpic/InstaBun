//Init global variables
const emojiMap = new Map();

const searchEmoji = document.querySelector("#searchEmoji");
const inputMessage = document.querySelector("#inputMessage");

//Get all the emojis
if (searchEmoji != null) {
  fetch("https://emoji.gg/api/")
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then((emojis) => {
    emojis.map((emoji) => {
      const key = emoji["title"].toLowerCase().replace(/_/g, "");
      const value = emoji["image"];
      emojiMap.set(key, value);
    });
  })
  .catch((error) => {
    console.error("Error:", error);
  });

fetch("https://api.github.com/emojis")
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then((emojis) => {
    Object.entries(emojis).map((emoji) => {
      let tempKey = emoji[0].toLowerCase().replace(/_/g, "");
      const key = emojiMap.has(tempKey) ? tempKey + "2" : tempKey;
      const value = emoji[1];
      emojiMap.set(key, value);
    });
  })
  .catch((error) => {
    console.error("Error:", error);
  });

for (let i = 0; i < 134; i++) {
  fetch(`/metadata/page_${i}.json`)
    .then((response) => response.json())
    .then((emojis) => {
      Object.entries(emojis).map((emoji) => {
        let count = i + 3;
        let tempKey = emoji[1]["name"]
          .toLowerCase()
          .replace(/_/g, "")
          .replace(/-/g, "");
        const key = emojiMap.has(tempKey) ? `${tempKey}${count}` : tempKey;
        const value = emoji[1]["image_url"];
        emojiMap.set(key, value);
      });
    })
    .catch((error) => {
      console.error("Error loading JSON data:", error);
    });
}

}
//When user seach for emoji
if (searchEmoji != null) {
  searchEmoji.addEventListener("click", function () {
    const listOfEmoji = document.querySelector("#listOfEmoji");
    const inputPrefixEmoji = document.querySelector("#inputPrefixEmoji");

    //Clear the previous search
    while (listOfEmoji.childNodes[0]) {
      listOfEmoji.removeChild(listOfEmoji.childNodes[0]);
    }

    const prefix = inputPrefixEmoji.value.toLowerCase().replace(/ /g, "");
    if (prefix.length == 0) {
      alert("Have something to search for");
    } else {
      for (const [key, value] of emojiMap.entries()) {
        if (key.includes(prefix)) {
          //Display emoji
          const emojiImage = document.createElement("img");
          emojiImage.src = value;
          emojiImage.setAttribute("width", "32");
          emojiImage.setAttribute("height", "32");
          emojiImage.role = "button";
          emojiImage.ariaLabel = key;
          //When user selected an emoji they want to use
          // A copy of the emoji will be in the input area
          emojiImage.addEventListener("click", function () {
            const copyEmoji = document.createElement("img");
            copyEmoji.src = value;
            copyEmoji.setAttribute("width", "32");
            copyEmoji.setAttribute("height", "32");
            copyEmoji.ariaLabel = key;
            inputMessage.appendChild(copyEmoji);
          });
          listOfEmoji.appendChild(emojiImage);
        }
      }
    }
  });
}

//Convert the text and emoji to text
//This is used to store message in MySQL
export function textAndEmojiToText() {
  let message = "";
  for (let i = 0; i < inputMessage.childNodes.length; i++) {
    let nextCloneNode = inputMessage.childNodes[i];
    if (nextCloneNode.ariaLabel == null) {
      const textWithEscape = nextCloneNode.textContent
        .replace(/"/g, '\\"')
        .replace(/'/g, "\\'")
        .replace(/\\/g, "\\\\");

      message += textWithEscape;
    } else {
      const representEmojiAsText = `:${nextCloneNode.ariaLabel}:`;
      message += representEmojiAsText;
    }
  }
  return message;
}

//Convert text to text and emoji
//This recieve the string text from MySQL
export function textToTextAndEmoji(message) {
  //This is the quickest way of converting text to emoji
  //There is another way but because there is a lot of emoji to select, it takes a long time
  const tempMessageArray = message.split(":");

  //Remove empty space
  const messageArray = tempMessageArray.filter((item) => item !== "");

  const divContainer = document.createElement("div");
  divContainer.className = "text-break";

  //Convert the slug to emoji
  for (let i = 0; i < messageArray.length; i++) {
    if (emojiMap.has(messageArray[i])) {
      const emoji = document.createElement("img");
      emoji.setAttribute("width", "32");
      emoji.setAttribute("height", "32");
      emoji.ariaLabel = messageArray[i];
      emoji.src = emojiMap.get(messageArray[i]);
      divContainer.appendChild(emoji);
    } else {
      const text = document.createElement("span");
      text.textContent = messageArray[i];
      divContainer.appendChild(text);
    }
  }
  return divContainer;
}
