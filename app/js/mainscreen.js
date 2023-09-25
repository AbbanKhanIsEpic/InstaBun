import { appendPost } from "./post.js";
import { appendStory } from "./story.js";

fetch(`http://127.0.0.1:5000/api/post/followings?userID=${currentUserUserID}`)
  .then((response) => response.json())
  .then((data) => {
    if (data.length === undefined) {
      alert("Can not find post");
    }
    data.map((post) => {
      const postID = post.postID;

      const uploadDetail = post.uploadDetail;
      const PostLink = uploadDetail.PostLink;
      const Title = uploadDetail.Title;
      const commentCount = uploadDetail.commentCount;
      const didUserLike = uploadDetail.didUserLike;
      const likeCount = uploadDetail.likeCount;
      const shareCount = uploadDetail.shareCount;

      const uploaderDetail = post.uploaderDetail;
      const Username = uploaderDetail.Username;
      const ProfileIconLink = uploaderDetail.ProfileIconLink;

      appendPost(
        postID,
        PostLink,
        Title,
        commentCount,
        didUserLike,
        likeCount,
        shareCount,
        Username,
        ProfileIconLink
      );
    });
  })
  .catch((error) => {
    // Handle any errors that occurred during the request
    console.error(error);
  });

fetch(`http://127.0.0.1:5000/api/story/following?userID=${currentUserUserID}`)
  .then((response) => response.json())
  .then((data) => {
    if (!data) {
      alert("Can not find story");
    }
    data.map((story) => {
      console.log(story);
      const idStory = story["idStory"];
      const profileIconLink = story["ProfileIconLink"];
      const storyLink = story["StoryLink"];
      const title = story["Title"];
      appendStory(idStory, profileIconLink, storyLink, title);
    });
  })
  .catch((error) => {
    // Handle any errors that occurred during the request
    console.error(error);
  });
