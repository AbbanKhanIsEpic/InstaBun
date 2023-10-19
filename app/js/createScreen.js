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

let selectedFile = null;

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
      //Do not accept file that is neither a video or image
      //The file should have been anything from a .exe file or a pdf
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
    uploadTags.pop(tags.value);
  } else if (tags.value.length >= 100) {
    alert("Tag is too long");
    uploadTags.pop(tags.value);
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
    //Create a container to show and seperate the tag/s
    const tagContainer = document.createElement("div");
    tagContainer.className = "input-group";

    //Create an input element to show the tag the user has linked to the post
    const tag = document.createElement("input");
    tag.setAttribute("readonly", "true");
    tag.className = "form-control text-dark";
    tag.value = tags.value;

    //Create a span element to allow user to delete the tag if the tag the user entered is incorrect
    const removeButton = document.createElement("span");
    removeButton.className = "input-group-text";
    removeButton.role = "button";
    removeButton.innerText = "Remove";

    removeButton.addEventListener("click", function () {
      uploadTags.pop(tags.value);
      displayTags.removeChild(tagContainer);
    });

    //Append all the elements to the container
    tagContainer.appendChild(tag);
    tagContainer.appendChild(removeButton);

    //Diplay the tag
    displayTags.appendChild(tagContainer);
  }
});

//Display to the user what they have choosen
selectStory.addEventListener("click", function () {
  showSelect.innerText = "Story";
  tagsSection.classList.add("visually-hidden");
  isPost = false;
});

//Display to the user what they have choosen
selectPost.addEventListener("click", function () {
  showSelect.innerText = "Post";
  tagsSection.classList.remove("visually-hidden");
  isPost = true;
});

cancelButton.addEventListener("click", function () {
  //To say that the user have not uploaded a file because they have cancelled it
  selectedFile = null;
  const image = document.createElement("img");
  const showUpload = document.querySelector("#showUpload");
  image.setAttribute("width", "300");
  image.setAttribute("height", "400");
  image.id = "showUpload";
  //The reason for "/app/image/default.png" is because it is a custom image
  //That informs the user that they have to upload a file to create a post or a story
  image.src = "/app/image/default.png";
  //The reason for this is there is a possibility that the user has upload a video and then cancelled it
  showUpload.replaceWith(image);
});

createButton.addEventListener("click", function () {
  if (selectedFile == null) {
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
          .then((totalPost) => {
            //Need a standard naming convention so that the the post will not be overwritten in the database later on
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
        .then((totalStory) => {
          //Need a standard naming convention so that the the post will not be overwritten in the database later on
          const name = `S${currentUserUserID}:${totalStory}`;
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
  changeToPreview(VIDEO);

  const showUpload = document.querySelector("#showUpload");

  let source;

  //If the preview changed from an image to video
  //There will be no source element
  if (showUpload.childNodes[0] == undefined) {
    //If so, create one
    source = document.createElement("source");
  } else {
    source = showUpload.childNodes[0];
  }

  source.type = "video/mp4";

  source.src = URL.createObjectURL(selectedFile);

  const sizeInMB = selectedFile.size / 1024 / 1024;

  //Limit the video size
  //Do not want user to upload movies
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
    changeToPreview(IMG);
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
function changeToPreview(target) {
  const showUpload = document.querySelector("#showUpload");
  if (showUpload.tagName != target) {
    if (target == IMG) {
      //The showUpload is a video and we need an image element to show the image the user uploaded
      const image = document.createElement("img");
      image.setAttribute("width", "300");
      image.setAttribute("height", "400");
      image.id = "showUpload";
      showUpload.replaceWith(image);
    } else {
      //The showUpload is an image and we need a video element to show the video the user uploaded
      const video = document.createElement("video");
      video.setAttribute("width", "300");
      video.setAttribute("height", "400");
      video.setAttribute("controls", "true");
      video.id = "showUpload";

      showUpload.replaceWith(video);
    }
  }
}

//The function creates a post
function uploadPost(url) {
  const isVideo = selectedFile.type.match("video.*") ? true : false;
  var dataObject = {
    userID: currentUser,
    postLink: url,
    title: title.value,
    tags: uploadTags,
    isVideo: isVideo,
  };

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

//The function creates a story
function uploadStory(url) {
  const isVideo = selectedFile.type.match("video.*") ? true : false;
  var dataObject = {
    userID: currentUser,
    storyLink: url,
    title: title.value,
    isVideo: isVideo,
  };

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

//This uploads the user's file to firebase
function uploadToFirebase(name, isPost) {
  const type = selectedFile.type.match("video.*") ? "video" : "image";
  //The url is the directory of post / story
  //There are two folders: video and image
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
