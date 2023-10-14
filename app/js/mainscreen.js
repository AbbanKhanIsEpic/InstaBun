//Imports
import { displayPost } from "./post.js";
import { appendStory } from "./story.js";
//Get the post of who the user follows
fetch(`http://127.0.0.1:5000/api/post/followings?userID=${currentUserUserID}`)
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

//Get the stort of who the user follows
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
