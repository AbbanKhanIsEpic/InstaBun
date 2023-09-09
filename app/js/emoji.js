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
      console.log(emojis);
    })
    .catch((error) => {
      console.error("Error loading JSON data:", error);
    });
}

if (searchEmoji != null) {
  searchEmoji.addEventListener("click", function () {
    const listOfEmoji = document.querySelector("#listOfEmoji");
    const inputPrefixEmoji = document.querySelector("#inputPrefixEmoji");

    while (listOfEmoji.childNodes[0]) {
      listOfEmoji.removeChild(listOfEmoji.childNodes[0]);
    }

    const prefix = inputPrefixEmoji.value.toLowerCase().replace(/ /g, "");
    if (prefix.length == 0) {
      alert("Have something to search for");
    } else {
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
        if (value == "https://cdn3.emoji.gg/emojis/5994-sadistcrab.png") {
          console.log(key);
        }
      }
    }
  });
}

export function textAndEmojiToText() {
  let message = "";
  for (let i = 0; i < inputText.childNodes.length; i++) {
    let nextCloneNode = inputText.childNodes[i];
    if (nextCloneNode.ariaLabel == null) {
      let textWithEscape = nextCloneNode.textContent
        .replace(/"/g, '\\"')
        .replace(/'/g, "\\'")
        .replace(/\\/g, "\\\\");

      message += textWithEscape;
    } else {
      let representEmojiAsText = `:${nextCloneNode.ariaLabel}:`;
      message += representEmojiAsText;
    }
  }
  return message;
}

export function textToTextAndEmoji(message) {
  const modifiedMessage = message
    .replace(/::/g, ",")
    .replace(/:/g, ",")
    .replace(/^,|,$/g, "");

  const messageArray = modifiedMessage.split(",");

  const divContainer = document.createElement("div");
  divContainer.className = "text-break";

  console.log(messageArray);

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
  console.log(divContainer);
  return divContainer;
}
