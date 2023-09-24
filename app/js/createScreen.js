import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/9.4.0/firebase-storage.js";
import { initFirebase } from "/app/js/firebase-setup.js";

const app = initFirebase();
const storage = getStorage(app);

const IMG = "IMG";
const VIDEO = "VIDEO";

let select = "Post";

const currentUser = getCookie("userID");
const addTags = document.querySelector("#addTags");
const displayTags = document.querySelector("#displayTags");
const tags = document.querySelector("#tags");
const createButton = document.querySelector("#createButton");
const cancelButton = document.querySelector("#cancelButton");
const selectStory = document.querySelector("#selectStory");
const selectPost = document.querySelector("#selectPost");
const showSelect = document.querySelector("#showSelect");
const tagsSection = document.querySelector("#tagsSection");
const title = document.querySelector("#title");

let selectedFile;

let uploadTags = [];

document
  .querySelector("#uploadImagesVideosGIFs")
  .addEventListener("change", (event) => {
    selectedFile = event.target.files[0];
    if (selectedFile.type.match("video.*")) {
      if (selectedFile.type == "video/mp4") {
        previewVideo(VIDEO);
      } else {
        alert("Sorry, only mp4 videos");
      }
    } else if (selectedFile.type.match("image.*")) {
      previewImage(IMG);
    } else {
      alert("Sorry, you can not upload this file");
    }
  });

function previewVideo() {
  previewUpload(VIDEO);

  const showUpload = document.querySelector("#showUpload");

  let source;

  if (showUpload.childNodes[0] == undefined) {
    source = document.createElement("source");
  } else {
    source = showUpload.childNodes[0];
  }

  source.type = "video/mp4";
  source.src = URL.createObjectURL(selectedFile);
  console.log(source);
  showUpload.append(source);

  showUpload.load();
}

function previewImage() {
  const reader = new FileReader();
  reader.addEventListener("load", (event) => {
    previewUpload(IMG);
    const showUpload = document.querySelector("#showUpload");
    showUpload.src = event.target.result;
  });
  reader.readAsDataURL(selectedFile);
}

//This function will replace the image element to video element and versa visa
function previewUpload(target) {
  const showUpload = document.querySelector("#showUpload");
  if (showUpload.tagName != target) {
    if (target == IMG) {
      const image = document.createElement("img");
      image.setAttribute("width", "300");
      image.setAttribute("height", "400");
      image.id = "showUpload";
      showUpload.replaceWith(image);
    } else {
      const video = document.createElement("video");

      video.setAttribute("width", "300");
      video.setAttribute("height", "400");
      video.setAttribute("controls", "true");
      video.id = "showUpload";

      showUpload.replaceWith(video);
    }
  }
}

addTags.addEventListener("click", function () {
  uploadTags.push(tags.value);
  const isDuplicateTags = new Set(uploadTags).size !== uploadTags.length;
  if (tags.value.length == 0) {
    alert("Enter something");
  } else if (isDuplicateTags) {
    alert("Don't enter same tag twice");
    uploadTags.pop(tags.value);
  } else if (/\s/g.test(tags.value)) {
    alert("Don't enter tags with spaces");
    uploadTags.pop(tags.value);
  } else {
    const div = document.createElement("div");
    const input = document.createElement("input");
    const span = document.createElement("span");

    div.className = "input-group";

    input.setAttribute("readonly", "true");
    input.className = "form-control text-dark";
    input.value = tags.value;

    span.className = "input-group-text";
    span.role = "button";
    span.innerText = "Remove";

    div.appendChild(input);
    div.appendChild(span);

    span.addEventListener("click", function () {
      uploadTags.pop(tags.value);
      displayTags.removeChild(div);
    });

    displayTags.appendChild(div);
  }
  console.log(uploadTags);
});

selectStory.addEventListener("click", function () {
  showSelect.innerText = "Story";
  tagsSection.classList.add("visually-hidden");
  select = "Story";
});

selectPost.addEventListener("click", function () {
  showSelect.innerText = "Post";
  tagsSection.classList.remove("visually-hidden");
  select = "Post";
});

cancelButton.addEventListener("click", function () {
  const image = document.createElement("img");
  const showUpload = document.querySelector("#showUpload");
  image.setAttribute("width", "300");
  image.setAttribute("height", "400");
  image.id = "showUpload";
  image.src = "/app/image/default.png";
  showUpload.replaceWith(image);
});

createButton.addEventListener("click", function () {
  const showUpload = document.querySelector("#showUpload");
  if (showUpload.src == "http://127.0.0.1:5501/app/image/default.png") {
    alert("Please select something");
  } else if (title.value.length == 0) {
    alert("There must be a title");
  } else if (title.value.length >= 30) {
    alert("The title is too long");
  } else {
    if (select == "Post") {
      if (uploadTags.length < 3) {
        alert("Add some more tags");
      } else {
        fetch(
          `http://127.0.0.1:5000/api/post/total?userID=${currentUserUserID}`
        )
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            const totalPost = data;
            const name = `P${currentUserUserID}:${totalPost}`;
            uploadToFirebase(name);
          })
          .catch((error) => {
            // Handle any errors that occurred during the request
            console.error(error);
          });
      }
    }
    fetch(`http://127.0.0.1:5000/api/story/total?userID=${currentUserUserID}`)
      .then((response) => response.json())
      .then((data) => {
        const totalStory = data["0"]["count(*)"];
        const name = `S${currentUserUserID}:${totalStory}`;
        uploadToFirebase(name);
      })
      .catch((error) => {
        // Handle any errors that occurred during the request
        console.error(error);
      });
  }
});

function uploadStory(url) {
  var dataObject = {
    userID: currentUser,
    storyLink: url,
    title: title.value,
  };

  // Convert the JavaScript object to a JSON string
  var jsonObject = JSON.stringify(dataObject);

  fetch("http://127.0.0.1:5000/api/story/createStory", {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: jsonObject,
  })
    .then((response) => response.text())
    .then((responseData) => {
      alert("Story created");
      window.location.reload();
      console.log("Response:", responseData);
    })
    .catch((error) => {
      alert("Story not created");
      window.location.reload();
      console.error("Error:", error);
    });
}

function uploadPost(url) {
  var dataObject = {
    userID: currentUser,
    postLink: url,
    title: title.value,
    tags: uploadTags,
  };

  // Convert the JavaScript object to a JSON string
  var jsonObject = JSON.stringify(dataObject);

  fetch("http://127.0.0.1:5000/api/post/createPost", {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: jsonObject,
  })
    .then((response) => response.text())
    .then((responseData) => {
      alert("Post created");
      window.location.reload();
      console.log("Response:", responseData);
    })
    .catch((error) => {
      alert("Post not created");
      window.location.reload();
      console.error("Error:", error);
    });
}

function uploadToFirebase(name) {
  const type = selectedFile.type.match("video.*") ? "video" : "image";
  const url = `${type}/${name}`;
  const storageRef = ref(storage, url);
  uploadBytes(storageRef, selectedFile)
    .then((snapshot) => {
      console.log("Image uploaded successfully!");
      getDownloadURL(storageRef)
        .then((url) => {
          if (name.charAt(0) == "P") {
            uploadPost(url);
          } else if (name.charAt(0) == "S") {
            uploadStory(url);
          }
        })
        .catch((error) => {
          console.error("Error getting video URL:", error);
        });
    })
    .catch((error) => {
      console.error("Error uploading image:", error);
    });
}
