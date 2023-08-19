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

let isPost = true;

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

  displayScreen(video);
}
function previewImage() {
  let image = document.createElement("img");

  image.setAttribute("width", "250px");
  image.setAttribute("height", "400px");

  const reader = new FileReader();
  reader.addEventListener("load", (event) => {
    image.src = event.target.result;
  });
  reader.readAsDataURL(selectedFile);

  displayScreen(image);
}

function displayScreen(display) {
  while (main.firstChild) {
    main.removeChild(main.firstChild);
  }
  main.className =
    "container-fluid d-flex justify-content-center align-items-center flex-row";
  const sectionElement = document.createElement("section");
  sectionElement.className =
    "d-flex justify-content-center align-content-center flex-column ms-3";

  //Create a div container element for "Enter tags"
  const tagDivContainer = document.createElement("div");

  // Create the first <label> element for "Enter tags"
  const labelTags = document.createElement("label");
  labelTags.setAttribute("for", "tags");
  labelTags.className = "h2 text-center ";
  labelTags.textContent = "Enter tags";

  //Create the <div> element for tags
  const divTag = document.createElement("div");
  divTag.className = "input-group";

  // Create the <input> element for tags
  const inputTags = document.createElement("input");
  inputTags.className = "form-control";
  inputTags.type = "text";
  inputTags.id = "tags";

  //Create the <span> element for tags
  const spanTag = document.createElement("span");
  spanTag.className = "input-group-text";
  spanTag.innerText = "Add";
  spanTag.role = "button";
  spanTag.id = "addTags";

  //Create the <div> element to show the tags
  const showDivTags = document.createElement("div");
  showDivTags.className =
    "d-flex justify-content-center align-items-center gap-2 flex-column pt-2";

  spanTag.addEventListener("click", function () {
    if (showDivTags.children.length < 3) {
      if (inputTags.value.length < 3) {
        alert("The tag is too short");
        let text =
          "https://firebasestorage.googleapis.com/v0/b/cogent-osprey-390319.appspot.com/o/image%2FS1%3A0?alt=media&token=d4efe230-ff22-490a-b6fa-6721da768a61";
        console.log(text.charAt(79));
      } else if (inputTags.value.length > 100) {
        alert("The tag is too long");
      } else {
        //Create an <input> element to show the tag
        const uneditableTagShowcase = document.createElement("input");
        uneditableTagShowcase.className = "form-control text-dark";
        uneditableTagShowcase.readOnly = "true";
        uneditableTagShowcase.value = inputTags.value;
        uploadTags[showDivTags.children.length] = inputTags.value;
        console.log(uploadTags);
        showDivTags.appendChild(uneditableTagShowcase);
      }
    } else {
      alert("Too much tags");
    }
  });

  // Create the second <label> element for "Title:"
  const labelTitle = document.createElement("label");
  labelTitle.setAttribute("for", "description");
  labelTitle.className = "h2 text-center mt-3";
  labelTitle.textContent = "Title:";

  // Create the <input> element for description
  const inputTitle = document.createElement("input");
  inputTitle.type = "text";
  inputTitle.id = "title";

  // Create the <div> element with class "btn-group dropend mt-3"
  const divElement = document.createElement("div");
  divElement.className = "btn-group dropend mt-3";

  // Create the first button element
  const button1 = document.createElement("button");
  button1.type = "button";
  button1.className = "btn btn-primary";
  button1.textContent = "Post";

  // Create the second button element with dropdown-toggle classes
  const button2 = document.createElement("button");
  button2.type = "button";
  button2.className = "btn btn-primary dropdown-toggle dropdown-toggle-split";
  button2.setAttribute("data-bs-toggle", "dropdown");
  button2.setAttribute("aria-expanded", "false");

  // Create the <span> element within the second button
  const spanElement = document.createElement("span");
  spanElement.className = "visually-hidden";
  spanElement.textContent = "Toggle Dropend";

  // Append the <span> element to the second button
  button2.appendChild(spanElement);

  // Create the <ul> element with class "dropdown-menu"
  const ulElement = document.createElement("ul");
  ulElement.className = "dropdown-menu";

  // Create an array of dropdown item names
  const dropdownItems = ["Post", "Story"];

  // Create <li> elements with <a> elements as their children for each dropdown item
  dropdownItems.forEach((itemText) => {
    const liElement = document.createElement("li");
    const aElement = document.createElement("a");
    aElement.className = "dropdown-item";
    aElement.textContent = itemText;
    aElement.addEventListener("click", function () {
      button1.textContent = itemText;
      if (itemText == "Post") {
        tagDivContainer.style.display = "block";
        isPost = true;
      } else {
        tagDivContainer.style.display = "none";
        while (showDivTags.firstChild) {
          showDivTags.removeChild(showDivTags.firstChild);
        }
        uploadTags = ["", "", ""];
        isPost = false;
      }
    });
    liElement.appendChild(aElement);
    ulElement.appendChild(liElement);
  });

  // Create the "Cancel" button
  const cancelButton = document.createElement("button");
  cancelButton.className = "btn btn-primary mt-3";
  cancelButton.textContent = "Cancel";

  cancelButton.addEventListener("click", function () {
    window.location.reload();
  });

  // Create the "Upload" button
  const uploadButton = document.createElement("button");
  uploadButton.className = "btn btn-primary mt-3";
  uploadButton.textContent = "Upload";
  uploadButton.addEventListener("click", function () {
    uploadTitle = inputTitle.value;
    if (uploadTitle.length == 0) {
      alert("Please write something for title");
    } else if (uploadTitle.length > 50) {
      alert("The title is too long");
    } else {
      if (isPost) {
        if (showDivTags.children.length != 3) {
          alert("Must have three tags");
        } else {
          uploadButton.disabled = true;
          fetch(`http://127.0.0.1:5000/api/post/total?userID=${currentUser}`)
            .then((response) => response.json())
            .then((data) => {
              let postName = "P" + currentUser + ":" + data[0]["count(*)"];
              uploadToFirebase(postName);
            })
            .catch((error) => {
              // Handle any errors that occurred during the request
              console.error(error);
            });
        }
      } else {
        uploadButton.disabled = true;
        fetch(`http://127.0.0.1:5000/api/story/total?userID=${currentUser}`)
          .then((response) => response.json())
          .then((data) => {
            let storyName = "S" + currentUser + ":" + data[0]["count(*)"];
            uploadToFirebase(storyName);
          })
          .catch((error) => {
            // Handle any errors that occurred during the request
            console.error(error);
          });
      }
    }
  });

  // Append all the created elements to the section
  tagDivContainer.appendChild(labelTags);
  divTag.appendChild(inputTags);
  divTag.appendChild(spanTag);
  tagDivContainer.appendChild(divTag);
  tagDivContainer.appendChild(showDivTags);
  sectionElement.appendChild(tagDivContainer);
  sectionElement.appendChild(labelTitle);
  sectionElement.appendChild(inputTitle);
  divElement.appendChild(button1);
  divElement.appendChild(button2);
  divElement.appendChild(ulElement);
  sectionElement.appendChild(divElement);
  sectionElement.appendChild(cancelButton);
  sectionElement.appendChild(uploadButton);

  main.appendChild(display);
  main.appendChild(sectionElement);

  display.load();
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
