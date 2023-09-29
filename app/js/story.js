import { sendDirectMessage } from "./message.js";
export function appendStory(
  userID,
  idStory,
  profileIconLink,
  storyLink,
  title,
  isVideo
) {
  const modal = `storyModal${idStory}`;
  // Create the <div> element
  const divElement = document.createElement("div");
  divElement.className = "normal-story";
  divElement.setAttribute("role", "button");
  divElement.setAttribute("data-bs-toggle", "modal");
  divElement.setAttribute("data-bs-target", `#${modal}`);

  // Create the <img> element
  const imgElement = document.createElement("img");
  imgElement.src = profileIconLink;
  imgElement.alt = "story_icon_1";
  imgElement.className = "rounded-circle m-3";
  imgElement.width = "100";
  imgElement.height = "100";

  // Append the <img> element to the <div> element
  divElement.appendChild(imgElement);

  // Assuming you have an existing element in the DOM where you want to add this <div> element
  const storyHeader = document.querySelector("#storyHeader");
  storyHeader.appendChild(divElement);

  // Create the <div> element with the modal structure
  const modalDiv = document.createElement("div");
  modalDiv.className = "modal fade";
  modalDiv.id = modal;
  modalDiv.tabIndex = "-1";
  modalDiv.setAttribute("aria-hidden", "true");

  // Create the modal dialog <div>
  const modalDialogDiv = document.createElement("div");
  modalDialogDiv.className = "modal-dialog";

  // Create the modal content <div>
  const modalContentDiv = document.createElement("div");
  modalContentDiv.className = "modal-content";

  // Create the modal header <div>
  const modalHeaderDiv = document.createElement("div");
  modalHeaderDiv.className = "modal-header";

  // Create the modal title <h1> element
  const modalTitle = document.createElement("h1");
  modalTitle.className = "modal-title fs-5 text-black";
  modalTitle.id = "sendDMHeader";
  modalTitle.textContent = title;

  // Create the close button <button> element
  const closeButton = document.createElement("button");
  closeButton.type = "button";
  closeButton.className = "btn-close";
  closeButton.setAttribute("data-bs-dismiss", "modal");
  closeButton.setAttribute("aria-label", "Close");

  // Append the title and close button to the header
  modalHeaderDiv.appendChild(modalTitle);
  modalHeaderDiv.appendChild(closeButton);

  // Create the modal body <div>
  const modalFooterDiv = document.createElement("div");
  modalFooterDiv.className = "modal-footer text-black";

  const modalBodyDiv = document.createElement("div");
  modalBodyDiv.className =
    "modal-body flex justify-content-center align-self-center";

  // Create the input group <div>
  const inputGroupDiv = document.createElement("div");
  inputGroupDiv.className = "input-group";

  // Create the input field <input> element
  const inputField = document.createElement("input");
  inputField.type = "text";
  inputField.className = "form-control";

  // Create the send message button <span> element
  const sendMessageButton = document.createElement("span");
  sendMessageButton.className = "input-group-text";
  sendMessageButton.textContent = "Send message";
  sendMessageButton.setAttribute("role", "button");

  sendMessageButton.addEventListener("click", function () {
    if (inputField.value.length == 0) {
      alert("Please have something to say");
    } else if (inputField.value.length > 1100) {
      alert("Message too long, max length is 1100");
    } else {
      sendDirectMessage(userID, inputField.value);
      window.open("http://127.0.0.1:5501/app/message.html", "_blank");
    }
  });

  // Append the input field and send message button to the input group
  inputGroupDiv.appendChild(inputField);
  inputGroupDiv.appendChild(sendMessageButton);

  // Append the input group to the modal body
  modalFooterDiv.appendChild(inputGroupDiv);

  if (isVideo) {
    const video = document.createElement("video");
    video.className = "post";
    video.src = storyLink;
    video.controls = true;
    modalBodyDiv.appendChild(video);
  } else {
    const image = document.createElement("img");
    image.className = "post";
    image.src = storyLink;
    modalBodyDiv.append(image);
  }

  // Append the modal header and modal body to the modal content
  modalContentDiv.appendChild(modalHeaderDiv);
  modalContentDiv.appendChild(modalBodyDiv);
  modalContentDiv.appendChild(modalFooterDiv);

  // Append the modal content to the modal dialog
  modalDialogDiv.appendChild(modalContentDiv);

  // Append the modal dialog to the main modal <div>
  modalDiv.appendChild(modalDialogDiv);

  // Assuming you have an existing element in the DOM where you want to add this modal
  const containerElement = document.getElementById("collectionOfStories");
  containerElement.appendChild(modalDiv);
}
