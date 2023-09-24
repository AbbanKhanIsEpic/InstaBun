const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
const cors = require("cors");

const { createConnection } = require("./DB");

const UserManager = require("./UserManager");
const FollowManager = require("./FollowManager");
const PostManager = require("./PostManager");
const StoryManager = require("./StoryManager");
const DirectMessage = require("./DirectMessage");
const GroupManager = require("./GroupManager");
const GroupMessage = require("./GroupMessage");

app.use(cors()); // Enable CORS for all routes

app.use(express.json());

async function connectToDatabase() {
  try {
    await createConnection();
    console.log("Connection established");
  } catch (error) {
    // Handle the error appropriately
    console.error("Error connecting to the database:", error);
  }
}

// Call the connectToDatabase function
connectToDatabase();

app.get("/api/user/login", (req, res) => {
  const { username, password } = req.query;

  let user = new UserManager();

  user
    .userLogin(username, password)
    .then((jsonifiedResult) => {
      res.status(200).send(jsonifiedResult);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error occurred");
    });
});

app.get("/api/user/displayName", (req, res) => {
  const { userID } = req.query;

  let user = new UserManager();

  user
    .getDisplayName(userID)
    .then((jsonifiedResult) => {
      res.status(200).send(jsonifiedResult);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error occurred");
    });
});

app.get("/api/user/block", (req, res) => {
  const { userID, profileUserID } = req.query;

  let user = new UserManager();

  user
    .isUserBlocked(userID, profileUserID)
    .then((jsonifiedResult) => {
      res.status(200).send(jsonifiedResult);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error occurred");
    });
});

app.post("/api/user/block", (req, res) => {
  const userID = req.body.userID;
  const profileUserID = req.body.profileUserID;

  let user = new UserManager();
  let follow = new FollowManager();

  follow.unfollow(userID, profileUserID);
  user.block(userID, profileUserID);
  res.json({ message: "Data received and processed successfully" });
});

app.post("/api/user/unblock", (req, res) => {
  const userID = req.body.userID;
  const profileUserID = req.body.profileUserID;

  let user = new UserManager();
  user.unblock(userID, profileUserID);
  res.json({ message: "Data received and processed successfully" });
});

app.get("/api/user/email", (req, res) => {
  const { email } = req.query;

  let user = new UserManager();

  user
    .doesEmailExist(email)
    .then((jsonifiedResult) => {
      res.status(200).send(jsonifiedResult);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error occurred");
    });
});

app.get("/api/user/usernameExist", (req, res) => {
  const { username } = req.query;

  let user = new UserManager();

  user
    .doesUsernameExist(username)
    .then((jsonifiedResult) => {
      res.status(200).send(jsonifiedResult);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error occurred");
    });
});

app.get("/api/user/username", (req, res) => {
  const { userID } = req.query;

  let user = new UserManager();

  user
    .getUsername(userID)
    .then((jsonifiedResult) => {
      res.status(200).send(jsonifiedResult);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error occurred");
    });
});

app.get("/api/user/userID", (req, res) => {
  const { username } = req.query;

  let user = new UserManager();

  user
    .getUserID(username)
    .then((jsonifiedResult) => {
      res.status(200).send(jsonifiedResult);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error occurred");
    });
});

app.get("/api/user/search", (req, res) => {
  const { userID, searchUser } = req.query;

  let user = new UserManager();

  user
    .getListOfUsernames(userID, searchUser)
    .then((jsonifiedResult) => {
      res.status(200).send(jsonifiedResult);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error occurred");
    });
});

app.get("/api/user/profile", (req, res) => {
  const { userID } = req.query;

  let user = new UserManager();

  user
    .getUserProfile(userID)
    .then((jsonifiedResult) => {
      res.status(200).send(jsonifiedResult);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error occurred");
    });
});

app.get("/api/user/profileIcon", (req, res) => {
  const { userID } = req.query;

  let user = new UserManager();

  user
    .getUserProfileIconLink(userID)
    .then((jsonifiedResult) => {
      res.status(200).send(jsonifiedResult);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error occurred");
    });
});

app.get("/api/user/visibility", (req, res) => {
  const { userID } = req.query;

  let user = new UserManager();

  user
    .getVisibility(userID)
    .then((jsonifiedResult) => {
      res.status(200).send(jsonifiedResult);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error occurred");
    });
});

app.get("/api/user/dmlimit", (req, res) => {
  const { userID } = req.query;

  let user = new UserManager();

  user
    .getDMLimit(userID)
    .then((jsonifiedResult) => {
      res.status(200).send(jsonifiedResult);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error occurred");
    });
});

app.post("/api/user/profile", (req, res) => {
  const userID = req.body.userID;
  const newDisplayName = req.body.newDisplayName;
  const newBio = req.body.newBio;
  const newProfileIconLink = req.body.newProfileIconLink;
  const newVisibility = req.body.newVisibility;
  const newDMLimit = req.body.newDMLimit;

  let user = new UserManager();
  user.updateProfile(
    userID,
    newDisplayName,
    newBio,
    newProfileIconLink,
    newVisibility,
    newDMLimit
  );
  res.json({ message: "Data received and processed successfully" });
});

app.get("/api/follow/following", (req, res) => {
  const { currentID, profileID } = req.query;

  let follow = new FollowManager();

  follow
    .isFollowing(currentID, profileID)
    .then((jsonifiedResult) => {
      res.status(200).send(jsonifiedResult);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error occurred");
    });
});

app.get("/api/follow/listOfFollowers", (req, res) => {
  const { profileID } = req.query;

  let follow = new FollowManager();

  follow
    .getFollowers(profileID)
    .then((jsonifiedResult) => {
      res.status(200).send(jsonifiedResult);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error occurred");
    });
});

app.get("/api/follow/listOfFollowings", (req, res) => {
  const { profileID } = req.query;

  let follow = new FollowManager();

  follow
    .getFollowings(profileID)
    .then((jsonifiedResult) => {
      res.status(200).send(jsonifiedResult);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error occurred");
    });
});

app.post("/api/follow/becomeFollower", (req, res) => {
  const followerID = req.body.currentID;
  const followingID = req.body.profileID;

  let follow = new FollowManager();
  follow.follow(followerID, followingID);
  res.json({ message: "Data received and processed successfully" });
});

app.post("/api/follow/unfollow", (req, res) => {
  const followerID = req.body.currentID;
  const followingID = req.body.profileID;

  let follow = new FollowManager();
  follow.unfollow(followerID, followingID);

  res.json({ message: "Data received and processed successfully" });
});

app.get("/api/post/total", (req, res) => {
  const { userID } = req.query;

  let post = new PostManager();

  post
    .total(userID)
    .then((jsonifiedResult) => {
      res.status(200).send(String(jsonifiedResult));
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error occurred");
    });
});

app.get("/api/post/followings", (req, res) => {
  const { userID } = req.query;

  let post = new PostManager();

  post
    .getFollowingPost(userID)
    .then((jsonifiedResult) => {
      res.status(200).send(jsonifiedResult);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error occurred");
    });
});

app.get("/api/post/profile", (req, res) => {
  const { userID, profileUserID } = req.query;

  let post = new PostManager();

  post
    .getProfilePost(userID, profileUserID)
    .then((jsonifiedResult) => {
      res.status(200).send(jsonifiedResult);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error occurred");
    });
});

app.post("/api/post/createPost", (req, res) => {
  const userID = req.body.userID;
  const postLink = req.body.postLink;
  const title = req.body.title;
  const tags = req.body.tags;

  let post = new PostManager();
  post.upload(userID, postLink, title, tags);
  res.json({ message: "Data received and processed successfully" });
});

app.get("/api/post/search", (req, res) => {
  const { userID, tags } = req.query;

  const tagsArray = tags.split(",");

  let post = new PostManager();

  post
    .getPostViaTags(userID, tagsArray)
    .then((jsonifiedResult) => {
      res.status(200).send(jsonifiedResult);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error occurred");
    });
});

app.get("/api/post/comment", (req, res) => {
  const { postID } = req.query;

  let post = new PostManager();

  post
    .getComments(postID)
    .then((jsonifiedResult) => {
      res.status(200).send(jsonifiedResult);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error occurred");
    });
});

app.get("/api/post/placeholder", (req, res) => {
  const { userID } = req.query;

  let post = new PostManager();

  post
    .getPostBasedLike(userID)
    .then((jsonifiedResult) => {
      res.status(200).send(jsonifiedResult);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error occurred");
    });
});

app.get("/api/post/select", (req, res) => {
  const { userID, postID } = req.query;

  let post = new PostManager();

  console.log(postID);

  post
    .getSingularPost(userID, postID)
    .then((jsonifiedResult) => {
      res.status(200).send(jsonifiedResult);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error occurred");
    });
});

app.post("/api/post/comment", (req, res) => {
  const postID = req.body.postID;
  const userID = req.body.userID;
  const comment = req.body.comment;

  const post = new PostManager();
  post.comment(postID, userID, comment);

  res.json({ message: "Data received and processed successfully" });
});

app.post("/api/post/like", (req, res) => {
  const postID = req.body.postID;
  const userID = req.body.userID;

  const post = new PostManager();
  post.like(postID, userID);

  res.json({ message: "Data received and processed successfully" });
});

app.post("/api/post/unlike", (req, res) => {
  const postID = req.body.postID;
  const userID = req.body.userID;

  const post = new PostManager();
  post.unlike(postID, userID);

  res.json({ message: "Data received and processed successfully" });
});

app.get("/api/post/share", (req, res) => {
  const { userID, postID } = req.query;

  let post = new PostManager();

  post
    .hasShared(userID, postID)
    .then((jsonifiedResult) => {
      res.status(200).send(jsonifiedResult);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error occurred");
    });
});

app.post("/api/post/share", (req, res) => {
  const userID = req.body.userID;
  const postID = req.body.postID;

  let post = new PostManager();
  post.share(userID, postID);
  res.json({ message: "Data received and processed successfully" });
});

app.get("/api/story/total", (req, res) => {
  const { userID } = req.query;

  let story = new StoryManager();

  story
    .total(userID)
    .then((jsonifiedResult) => {
      res.status(200).send(String(jsonifiedResult));
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error occurred");
    });
});

app.get("/api/story/following", (req, res) => {
  const { userID } = req.query;

  let story = new StoryManager();

  story
    .getStories(userID)
    .then((jsonifiedResult) => {
      res.status(200).send(jsonifiedResult);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error occurred");
    });
});

app.post("/api/story/createStory", (req, res) => {
  const userID = req.body.userID;
  const storyLink = req.body.storyLink;
  const title = req.body.title;

  let story = new StoryManager();
  story.upload(userID, storyLink, title);
  res.json({ message: "Data received and processed successfully" });
});

app.get("/api/direct/permission", (req, res) => {
  const { senderID, receiverID } = req.query;

  let directMessage = new DirectMessage();

  directMessage
    .hasAbilityToSend(senderID, receiverID)
    .then((jsonifiedResult) => {
      res.status(200).send(jsonifiedResult);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error occurred");
    });
});

app.post("/api/direct/message", (req, res) => {
  const senderID = req.body.senderID;
  const receiverID = req.body.receiverID;
  const message = req.body.message;

  let directMessage = new DirectMessage();
  directMessage.sendMessage(senderID, receiverID, message);
  res.json({ message: "Data received and processed successfully" });
});

app.post("/api/direct/deleteMessage", (req, res) => {
  const messageID = req.body.messageID;

  let directMessage = new DirectMessage();
  directMessage.deleteMessage(messageID);
  res.json({ message: "Data received and processed successfully" });
});

app.post("/api/direct/clearMessage", (req, res) => {
  const senderID = req.body.senderID;
  const receiverID = req.body.receiverID;

  let directMessage = new DirectMessage();
  directMessage.clearMessage(senderID, receiverID);
  res.json({ message: "Data received and processed successfully" });
});

app.get("/api/direct/list", (req, res) => {
  const { userID } = req.query;

  let directMessage = new DirectMessage();

  directMessage
    .getDirectList(userID)
    .then((jsonifiedResult) => {
      res.status(200).send(jsonifiedResult);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error occurred");
    });
});

app.get("/api/direct/message", (req, res) => {
  const { senderID, receiverID, messageID } = req.query;

  let directMessage = new DirectMessage();

  directMessage
    .getMessage(senderID, receiverID, messageID)
    .then((jsonifiedResult) => {
      res.status(200).send(jsonifiedResult);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error occurred");
    });
});

app.get("/api/group/groupList", (req, res) => {
  const { userID } = req.query;

  let groupManager = new GroupManager();
  groupManager
    .getGroupList(userID)
    .then((jsonifiedResult) => {
      res.status(200).send(jsonifiedResult);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error occurred");
    });
});

app.get("/api/group/groupMembers", (req, res) => {
  const { groupID } = req.query;

  let groupManager = new GroupManager();
  groupManager
    .getGroupMembers(groupID)
    .then((jsonifiedResult) => {
      res.status(200).send(jsonifiedResult);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error occurred");
    });
});

app.post("/api/group/message", (req, res) => {
  const senderID = req.body.senderID;
  const groupID = req.body.groupID;
  const message = req.body.message;

  let groupMessage = new GroupMessage();
  groupMessage.sendMessage(senderID, groupID, message);
  res.json({ message: "Data received and processed successfully" });
});

app.post("/api/group/deleteMessage", (req, res) => {
  const messageID = req.body.messageID;

  let groupMessage = new GroupMessage();
  groupMessage.deleteMessage(messageID);
  res.json({ message: "Data received and processed successfully" });
});

app.post("/api/group/clearMessage", (req, res) => {
  const userID = req.body.userID;
  const groupID = req.body.groupID;

  let groupMessage = new GroupMessage();
  groupMessage.clearMessage(userID, groupID);
  res.json({ message: "Data received and processed successfully" });
});

app.get("/api/group/message", (req, res) => {
  const { userID, groupID, messageID } = req.query;

  let groupMessage = new GroupMessage();

  groupMessage
    .getMessage(userID, groupID, messageID)
    .then((jsonifiedResult) => {
      res.status(200).send(jsonifiedResult);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error occurred");
    });
});

app.post("/api/group/transferOwnership", (req, res) => {
  const groupID = req.body.groupID;
  const newOwnerID = req.body.newOwnerID;

  let groupManager = new GroupManager();
  groupManager.transferOwnership(groupID, newOwnerID);
  res.json({ message: "Data received and processed successfully" });
});

app.post("/api/group/addMember", (req, res) => {
  const groupID = req.body.groupID;
  const userID = req.body.userID;

  let groupManager = new GroupManager();
  groupManager.addMember(groupID, userID);
  res.json({ message: "Data received and processed successfully" });
});

app.post("/api/group/removeMember", (req, res) => {
  const groupID = req.body.groupID;
  const userID = req.body.userID;

  let groupManager = new GroupManager();
  groupManager.removeMemeber(groupID, userID);
  res.json({ message: "Data received and processed successfully" });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
