//Import
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/9.4.0/firebase-storage.js";
import { initFirebase } from "/app/js/firebase-setup.js";

//Initialise global variables

const app = initFirebase();
const storage = getStorage(app);

const IMG = "IMG";
const VIDEO = "VIDEO";

let isPost = true;

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

const uploadTags = [];

//Event listerners

//When user upload file
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

//When user add a new tag to the post
addTags.addEventListener("click", function () {
  uploadTags.push(tags.value);
  //Sets are type of data type that only stores unique data
  //So, by converting the existing array to a Set and checking if the length are the same
  //This comparising is checking if the tags are different
  const isDuplicateTags = new Set(uploadTags).size !== uploadTags.length;
  if (tags.value.length == 0) {
    alert("Enter something");
  } else if (tags.value.length >= 100) {
    alert("Tag is too long");
  } else if (isDuplicateTags) {
    alert("Don't enter same tag twice");
    uploadTags.pop(tags.value);
  }
  //This just check if there are spaces around the tags
  //Because how the posts will be seach is based on the indiviual tags
  else if (/\s/g.test(tags.value)) {
    alert("Don't enter tags with spaces");
    uploadTags.pop(tags.value);
  } else {
    //Show the tag that the user want to apply to the post
    const tagContainer = document.createElement("div");
    const tag = document.createElement("input");
    const removeButton = document.createElement("span");

    tagContainer.className = "input-group";

    tag.setAttribute("readonly", "true");
    tag.className = "form-control text-dark";
    tag.value = tags.value;

    removeButton.className = "input-group-text";
    removeButton.role = "button";
    removeButton.innerText = "Remove";

    tagContainer.appendChild(tag);
    tagContainer.appendChild(removeButton);

    removeButton.addEventListener("click", function () {
      uploadTags.pop(tags.value);
      displayTags.removeChild(tagContainer);
    });

    displayTags.appendChild(tagContainer);
  }
});

selectStory.addEventListener("click", function () {
  showSelect.innerText = "Story";
  tagsSection.classList.add("visually-hidden");
  isPost = false;
});

selectPost.addEventListener("click", function () {
  showSelect.innerText = "Post";
  tagsSection.classList.remove("visually-hidden");
  isPost = true;
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
  } else if (title.value.length >= 50) {
    alert("The title is too long");
  } else {
    if (isPost) {
      if (uploadTags.length < 3) {
        alert("Add some more tags");
      } else {
        fetch(
          `http://127.0.0.1:5000/api/post/total?userID=${currentUserUserID}`
        )
          .then((response) => response.json())
          .then((data) => {
            const totalPost = data;
            const name = `P${currentUserUserID}:${totalPost}`;
            uploadToFirebase(name, true);
          })
          .catch((error) => {
            // Handle any errors that occurred during the request
            console.error(error);
          });
      }
    } else {
      fetch(`http://127.0.0.1:5000/api/story/total?userID=${currentUserUserID}`)
        .then((response) => response.json())
        .then((data) => {
          const name = `S${currentUserUserID}:${data}`;
          uploadToFirebase(name, false);
        })
        .catch((error) => {
          // Handle any errors that occurred during the request
          console.error(error);
        });
    }
  }
});

//Functions

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
  const sizeInMB = selectedFile.size / 1024 / 1024;
  if (sizeInMB > 15) {
    alert("Video size is too large. 15MB max");
    window.location.reload();
  }
  showUpload.append(source);

  showUpload.load();
}

function previewImage() {
  const reader = new FileReader();
  reader.addEventListener("load", (event) => {
    previewUpload(IMG);
    const showUpload = document.querySelector("#showUpload");
    showUpload.src = event.target.result;
    const sizeInMB = selectedFile.size / 1024 / 1024;
    if (sizeInMB > 15) {
      alert("Image size is too large. 15MB max");
      window.location.reload();
    }
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

function uploadPost(url) {
  var dataObject = {
    userID: currentUser,
    postLink: url,
    title: title.value,
    tags: uploadTags,
    isVideo: selectedFile.type.match("video.*") ? true : false,
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

function uploadStory(url) {
  var dataObject = {
    userID: currentUser,
    storyLink: url,
    title: title.value,
    isVideo: selectedFile.type.match("video.*") ? true : false,
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

function uploadToFirebase(name, isPost) {
  const type = selectedFile.type.match("video.*") ? "video" : "image";
  const url = `${type}/${name}`;
  const storageRef = ref(storage, url);
  uploadBytes(storageRef, selectedFile)
    .then((snapshot) => {
      getDownloadURL(storageRef)
        .then((url) => {
          if (isPost) {
            uploadPost(url);
          } else {
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
