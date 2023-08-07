document
  .querySelector("#uploadImagesVideosGIFs")
  .addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (!file.type) {
      return;
    }
    if (file.type.match("video.*")) {
      sendVideo(file);
    } else if (file.type.match("image.*")) {
      console.log(sendImage(file));
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
