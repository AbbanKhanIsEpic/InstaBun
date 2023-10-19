//Imports
import { displayPost } from "./post.js";
import { appendStory } from "./story.js";

let page = 0;

showPost();

//Get the story of who the user follows
fetch(`http://127.0.0.1:5000/api/story/following?userID=${currentUserUserID}`)
  .then((response) => response.json())
  .then((data) => {
    data.map((story) => {
      const userID = story["UserID"];
      const idStory = story["idStory"];
      const profileIconLink = story["ProfileIconLink"];
      const storyLink = story["StoryLink"];
      const title = story["Title"];
      const isVideo = story["isVideo"];
      appendStory(userID, idStory, profileIconLink, storyLink, title, isVideo);
    });
  })
  .catch((error) => {
    // Handle any errors that occurred during the request
    console.error(error);
  });

//Event istener
  // Check if the element is within the viewport
document.addEventListener("mousewheel", function (event) {
  // event.deltaY contains information about the scroll direction
  let canAppendMore = false;
  if (event.deltaY > 0) {
    // Scroll down
    const elements = document.getElementsByClassName("result");
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      const rect = element.getBoundingClientRect();

      // Check if the element is within the viewport
      if (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= window.innerHeight &&
        rect.right <= window.innerWidth
      ) {
        if (
          (i / (elements.length - 1)) * 100 >= 80 ||
          i == elements.length - 1 //There might be just one post (0/0 -> NaN)
        ) {
          page++;
          canAppendMore = true;
        }
      }
    }
  }
  if (canAppendMore) {
    showPost();
  }
});

//Function 
function showPost(){
  //Get the post of who the user follows
fetch(`http://127.0.0.1:5000/api/post/followings?userID=${currentUserUserID}&page=${page}`)
.then((response) => response.json())
.then((data) => {
  data.map((post) => {
    displayPost(post);
  });
})
.catch((error) => {
  // Handle any errors that occurred during the request
  console.error(error);
});
}
