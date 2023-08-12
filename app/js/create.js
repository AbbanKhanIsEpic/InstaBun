import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/9.4.0/firebase-storage.js";
import { initFirebase } from "/app/js/firebase-setup.js";

const app = initFirebase();
const storage = getStorage(app);

const main = document.getElementsByTagName("main")[0];

document
  .querySelector("#uploadImagesVideosGIFs")
  .addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file.type.match("video.*")) {
      if (file.type == "video/mp4") {
        previewVideo(file);
      } else {
        alert("Sorry, only mp4 videos");
      }
    } else if (file.type.match("image.*")) {
      previewImage(file);
    } else {
      alert("Sorry, you can not upload this file");
    }
  });

function previewVideo(file) {
  let video = document.createElement("video");
  let source = document.createElement("source");

  video.setAttribute("width", "250px");
  video.setAttribute("height", "400px");
  video.setAttribute("controls", "true");
  source.type = "video/mp4";

  source.src = URL.createObjectURL(file);

  video.appendChild(source);

  displayScreen(video);
}
function previewImage(file) {
  let image = document.createElement("img");

  image.setAttribute("width", "250px");
  image.setAttribute("height", "400px");

  const reader = new FileReader();
  reader.addEventListener("load", (event) => {
    image.src = event.target.result;
  });
  reader.readAsDataURL(file);

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
      //Create an <input> element to show the tag
      const uneditableTagShowcase = document.createElement("input");
      uneditableTagShowcase.className = "form-control text-dark";
      uneditableTagShowcase.readOnly = "true";
      uneditableTagShowcase.value = inputTags.value;
      showDivTags.appendChild(uneditableTagShowcase);
    } else {
      alert("Too much tags");
    }
  });

  // Create the second <label> element for "Description:"
  const labelDescription = document.createElement("label");
  labelDescription.setAttribute("for", "description");
  labelDescription.className = "h2 text-center mt-3";
  labelDescription.textContent = "Description:";

  // Create the <input> element for description
  const inputDescription = document.createElement("input");
  inputDescription.type = "text";
  inputDescription.id = "description";

  // Create the <div> element with class "btn-group dropend mt-3"
  const divElement = document.createElement("div");
  divElement.className = "btn-group dropend mt-3";

  // Create the first button element
  const button1 = document.createElement("button");
  button1.type = "button";
  button1.className = "btn btn-primary";
  button1.textContent = "Split dropend";

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

  // Append all the created elements to the section
  sectionElement.appendChild(labelTags);
  divTag.appendChild(inputTags);
  divTag.appendChild(spanTag);
  sectionElement.appendChild(divTag);
  sectionElement.appendChild(showDivTags);
  sectionElement.appendChild(labelDescription);
  sectionElement.appendChild(inputDescription);
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

function uploadToFirebase(file) {
  const type = file.type.match("video.*") ? "video" : "image";
  const url = `${type}/${file.name}`;
  const storageRef = ref(storage, url);
  uploadBytes(storageRef, file)
    .then((snapshot) => {
      console.log("Image uploaded successfully!");
      getDownloadURL(storageRef)
        .then((url) => {
          console.log("URL:", url);
        })
        .catch((error) => {
          console.error("Error getting video URL:", error);
        });
    })
    .catch((error) => {
      console.error("Error uploading image:", error);
    });
}
