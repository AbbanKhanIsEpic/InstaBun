const emojiMap = new Map();

const searchEmoji = document.querySelector("#searchEmoji");
const inputText = document.querySelector("#inputMessage");

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

searchEmoji.addEventListener("click", function () {
  const listOfEmoji = document.querySelector("#listOfEmoji");
  const inputPrefixEmoji = document.querySelector("#inputPrefixEmoji");

  while (listOfEmoji.childNodes[0]) {
    listOfEmoji.removeChild(listOfEmoji.childNodes[0]);
  }

  const prefix = inputPrefixEmoji.value.toLowerCase().replace(/ /g, "");
  for (const [key, value] of emojiMap.entries()) {
    if (key.includes(prefix)) {
      const emojiImage = document.createElement("img");
      emojiImage.src = value;
      emojiImage.setAttribute("width", "32");
      emojiImage.setAttribute("height", "32");
      emojiImage.role = "button";
      emojiImage.ariaLabel = key;
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
});

export function textAndEmojiToText() {
  let message = "";
  for (let i = 0; i <= inputText.childElementCount; i++) {
    let nextCloneNode = inputText.childNodes[i];
    if (nextCloneNode.ariaLabel == null) {
      message += nextCloneNode.textContent;
    } else {
      let representEmojiAsText = `:${nextCloneNode.ariaLabel}:`;
      message += representEmojiAsText;
    }
  }
  return message;
}
