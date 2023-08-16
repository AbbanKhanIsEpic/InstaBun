const messageOutput = document.querySelector("#messageOutput");
const sendMessage = document.querySelector("#sendMessage");
const inputText = document.querySelector("#inputMessage");
const selectGroups = document.querySelector("#selectGroups");
const selectFriends = document.querySelector("#selectFriends");
const userSelection = document.querySelector("#userSelection");

selectFriends.addEventListener("click", function () {
  userSelection.textContent = "Friends";
});

selectGroups.addEventListener("click", function () {
  userSelection.textContent = "Groups";
});

let prevSelectFriend = null;

var elements = document.getElementsByClassName("ps-4 mt-4 w-100");
for (var i = 0, len = elements.length; i < len; i++) {
  elements[i].id = "friend" + i;
  elements[i].addEventListener("click", function (event) {
    if (prevSelectFriend == null) {
      event.currentTarget.className = "ps-4 mt-4 w-100 bg-info";
      prevSelectFriend = event.currentTarget.id;
    } else {
      event.currentTarget.className = "ps-4 mt-4 w-100 bg-info";
      let prevSelect = document.getElementById(prevSelectFriend);
      prevSelect.className = "ps-4 mt-4 w-100";
      prevSelectFriend = event.currentTarget.id;
    }
  });
}

sendMessage.addEventListener("click", function () {
  if (inputText.value == "") {
    alert("It is better to have something to send");
  } else {
    // Create the main div element
    const mainDiv = document.createElement("div");
    mainDiv.classList.add(
      "me-4",
      "ms-4",
      "mt-4",
      "d-flex",
      "align-items-end",
      "flex-column",
      "bg-success",
      "rounded"
    );
    mainDiv.setAttribute("aria-label", "message send");

    // Create the inner div element
    const innerDiv = document.createElement("div");
    innerDiv.classList.add(
      "d-flex",
      "align-items-end",
      "flex-column",
      "ps-2",
      "pe-2",
      "pt-1",
      "w-100"
    );

    // Create the delete button
    const deleteButton = document.createElement("span");
    deleteButton.classList.add("btn", "btn-primary");
    deleteButton.textContent = "Delete";

    // Create the profile picture image
    const profileImage = document.createElement("img");
    profileImage.alt = "killerbunny1619's profile picture";
    profileImage.draggable = false;
    profileImage.src =
      "https://firebasestorage.googleapis.com/v0/b/cogent-osprey-390319.appspot.com/o/milk-cat.jfif?alt=media&token=86576da3-dc0a-40a6-89d2-e4037f2380ea";
    profileImage.width = "30";
    profileImage.height = "30";
    profileImage.classList.add("rounded-circle");

    // Append the delete button and profile image to a div element
    const spanElement = document.createElement("div");
    spanElement.classList.add("d-flex", "justify-content-between", "w-100");
    spanElement.appendChild(deleteButton);
    spanElement.appendChild(profileImage);

    // Create the lead div
    const leadDiv = document.createElement("div");
    leadDiv.classList.add("lead");

    // Create the username and timestamp spans within the lead div
    const usernameSpan = document.createElement("span");
    usernameSpan.textContent = "killerbunny1619";

    const timestampSpan = document.createElement("span");
    timestampSpan.classList.add("small");
    const now = moment().format("MMMM Do YYYY, h:mm:ss a");
    timestampSpan.textContent = "  " + now;

    // Append username and timestamp spans to the lead div
    leadDiv.appendChild(usernameSpan);
    leadDiv.appendChild(timestampSpan);

    // Create the content div
    const contentDiv = document.createElement("div");
    contentDiv.className="text-break";
    contentDiv.textContent = inputText.value;

    // Append the span elements and content div to the inner div
    innerDiv.appendChild(spanElement);
    innerDiv.appendChild(leadDiv);
    innerDiv.appendChild(contentDiv);

    // Append the inner div to the main div
    mainDiv.appendChild(innerDiv);

    // Append the main div to the message output
    messageOutput.appendChild(mainDiv);

    deleteButton.addEventListener("click", function () {
      messageOutput.removeChild(mainDiv);
    });
  }
});
