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
      previewVideo(file);
    } else if (file.type.match("image.*")) {
      previewImage(file);
    } else {
      alert("Sorry, you can not upload this file");
    }
  });

function previewVideo(file) {
  let video = document.createElement("video");
  let source = document.createElement("source");

  video.setAttribute("controls", true);
  video.setAttribute("width", "500px");

  video.append(source);

  setSource(file, source, video);
  displayScreen(video);
}
function previewImage(file) {
  let image = document.createElement("img");

  image.setAttribute("width", "250px");
  image.setAttribute("height", "400px");

  setSource(file, image);
  displayScreen(image);
}

function setSource(file, source, video) {
  const reader = new FileReader();
  reader.addEventListener("load", (event) => {
    if (source.nodeName == "A") {
      source.href = event.target.result;
    } else {
      source.src = event.target.result;
    }
    if (video != null) {
      video.load();
    }
  });
  reader.readAsDataURL(file);
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
  labelTags.className = "h2 text-center";
  labelTags.textContent = "Enter tags";

  // Create the <input> element for tags
  const inputTags = document.createElement("input");
  inputTags.type = "text";
  inputTags.id = "tags";

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
  const dropdownItems = ["Everyone", "Followers", "Friends", "Close Friends"];

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
    uploadScreen();
  });

  // Create the "Upload" button
  const uploadButton = document.createElement("button");
  uploadButton.className = "btn btn-primary mt-3";
  uploadButton.textContent = "Upload";

  // Append all the created elements to the section
  sectionElement.appendChild(labelTags);
  sectionElement.appendChild(inputTags);
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
}

function uploadScreen() {
  while (main.firstChild) {
    main.removeChild(main.firstChild);
  }
  main.className =
    "container-fluid d-flex justify-content-center align-items-center flex-column";
  // Create the <svg> element
  const svgElement = document.createElement("svg");
  svgElement.setAttribute(
    "aria-label",
    "Icon to represent media such as images or videos or GIFs"
  );
  svgElement.setAttribute("color", "rgb(245, 245, 245)");
  svgElement.setAttribute("fill", "rgb(245, 245, 245)");
  svgElement.setAttribute("height", "200");
  svgElement.setAttribute("role", "img");
  svgElement.setAttribute("viewBox", "0 0 97.6 77.3");
  svgElement.setAttribute("width", "200");
  svgElement.width = "200px";

  // Create the first <path> element within the <svg> element
  const path1 = document.createElement("path");
  path1.setAttribute(
    "d",
    "M16.3 24h.3c2.8-.2 4.9-2.6 4.8-5.4-.2-2.8-2.6-4.9-5.4-4.8s-4.9 2.6-4.8 5.4c.1 2.7 2.4 4.8 5.1 4.8zm-2.4-7.2c.5-.6 1.3-1 2.1-1h.2c1.7 0 3.1 1.4 3.1 3.1 0 1.7-1.4 3.1-3.1 3.1-1.7 0-3.1-1.4-3.1-3.1 0-.8.3-1.5.8-2.1z"
  );
  path1.setAttribute("fill", "currentColor");

  // Create the second <path> element within the <svg> element
  const path2 = document.createElement("path");
  path2.setAttribute("d", "M84.7 18.4 ..."); // Truncated for brevity
  path2.setAttribute("fill", "currentColor");

  // Append the <path> elements to the <svg> element
  svgElement.appendChild(path1);
  svgElement.appendChild(path2);

  // Create the <input> element for file upload
  const inputElement = document.createElement("input");
  inputElement.type = "file";
  inputElement.id = "uploadImagesVideosGIFs";
  inputElement.setAttribute("aria-label", "user upload files");
  inputElement.className = "position-absolute visually-hidden";

  // Create the <label> element associated with the file input
  const labelElement = document.createElement("label");
  labelElement.setAttribute("for", "uploadImagesVideosGIFs");
  labelElement.className = "bg-primary rounded text-center";
  labelElement.setAttribute("role", "button");
  labelElement.style.width = "100px";
  labelElement.style.height = "100px";
  labelElement.textContent = "Upload";

  main.appendChild(svgElement);
  main.appendChild(inputElement);
  main.appendChild(labelElement);
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
