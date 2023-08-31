import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/9.4.0/firebase-storage.js";
import { initFirebase } from "/app/js/firebase-setup.js";

const app = initFirebase();
const storage = getStorage(app);

const currentUser = getCookie("userID");

const showImage = document.querySelector("#showImage")

let selectedFile;

let uploadTitle;

let uploadTags = ["", "", ""];

const main = document.getElementsByTagName("main")[0];

document
  .querySelector("#uploadImagesVideosGIFs")
  .addEventListener("change", (event) => {
    selectedFile = event.target.files[0];
    if (selectedFile.type.match("video.*")) {
      if (selectedFile.type == "video/mp4") {
        previewVideo();
      } else {
        alert("Sorry, only mp4 videos");
      }
    } else if (selectedFile.type.match("image.*")) {
      previewImage();
    } else {
      alert("Sorry, you can not upload this file");
    }
  });

function previewVideo() {
  let video = document.createElement("video");
  let source = document.createElement("source");

  video.setAttribute("width", "250px");
  video.setAttribute("height", "400px");
  video.setAttribute("controls", "true");
  source.type = "video/mp4";

  source.src = URL.createObjectURL(selectedFile);

  video.appendChild(source);

}
function previewImage() {
  let image = document.createElement("img");

  image.setAttribute("width", "250px");
  image.setAttribute("height", "400px");

  const reader = new FileReader();
  reader.addEventListener("load", (event) => {
    showImage.src = event.target.result;
  });
  reader.readAsDataURL(selectedFile);

}

function uploadStory(url) {
  var dataObject = {
    userID: currentUser,
    storyLink: url,
    title: uploadTitle,
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
      window.location.reload();
      alert("Story created");
      console.log("Response:", responseData);
    })
    .catch((error) => {
      window.location.reload();
      alert("Story not created");
      console.error("Error:", error);
    });
}
function uploadPost(url) {
  var dataObject = {
    userID: currentUser,
    postLink: url,
    title: uploadTitle,
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
      window.location.reload();
      alert("Post created");
      console.log("Response:", responseData);
    })
    .catch((error) => {
      window.location.reload();
      alert("Post not created");
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
