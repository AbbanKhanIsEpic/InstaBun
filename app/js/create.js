import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/9.4.0/firebase-storage.js";
import { initFirebase } from "/app/js/firebase-setup.js";

const app = initFirebase();
const storage = getStorage(app);

document
  .querySelector("#uploadImagesVideosGIFs")
  .addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (!file.type) {
      return;
    }
    if (file.type.match("video.*") || file.type.match("image.*")) {
      uploadToFirebase(file);
    } else {
      console.log("Na");
    }
  });

export function sendVideo(file) {
  let video = document.createElement("video");
  let source = document.createElement("source");

  video.setAttribute("controls", true);
  video.setAttribute("width", "500px");

  video.append(source);

  setSource(file, source, video);
  return video;
}
export function sendImage(file) {
  let image = document.createElement("img");

  image.setAttribute("width", "500px");

  setSource(file, image);
  return image;
}
export function sendFile(file) {
  let image = document.createElement("img");
  let container = document.createElement("div");
  let text = document.createTextNode(`${file.name}`);
  let anchor = document.createElement("a");

  container.setAttribute("class", "container");
  image.setAttribute("width", "200px");
  anchor.setAttribute("target", "_blank");

  image.src = "https://img.icons8.com/ios/512/file--v1.png";

  anchor.appendChild(text);
  container.append(image);
  container.append(anchor);

  setSource(file, anchor);
  return container;
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
