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

function previewVideo(file) {
  let video = document.createElement("video");
  let source = document.createElement("source");

  video.setAttribute("controls", true);
  video.setAttribute("width", "500px");

  video.append(source);

  setSource(file, source, video);
  return video;
}
function previewImage(file) {
  let image = document.createElement("img");

  image.setAttribute("width", "500px");

  setSource(file, image);
  return image;
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
