//Imports
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

//Connect to MySQL server
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

//All the api end-points

//User
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
    .then((displayName) => {
      res.status(200).send({ DisplayName: displayName });
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

app.get("/api/user/isUserEmail", (req, res) => {
  const { username, emailAddress } = req.query;

  let user = new UserManager();

  user
    .doUserEmailMatch(username, emailAddress)
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

  user.block(userID, profileUserID);
  res.json({ message: "Data received and processed successfully" });
});

app.post("/api/user/createAccount", (req, res) => {
  const username = req.body.username;
  const displayName = req.body.displayName;
  const password = req.body.password;
  const profileIconLink = req.body.profileIconLink;
  const emailAddress = req.body.emailAddress;

  let user = new UserManager();
  user.createAccount(
    username,
    displayName,
    password,
    profileIconLink,
    emailAddress
  );
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
    .isEmailTaken(email)
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
    .isUsernameTaken(username)
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
    .then((username) => {
      res.status(200).send({ Username: username });
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
    .then((userID) => {
      res.status(200).send({ UserID: userID });
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
    .then((profileIconLink) => {
      res.status(200).send({ ProfileIconLink: profileIconLink });
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
    .then((visibility) => {
      res.status(200).send({ Visibility: visibility });
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
    .then((dmLimit) => {
      res.status(200).send({ DMLimit: dmLimit });
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

//Follow

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

//Post

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
  const isVideo = req.body.isVideo;

  let post = new PostManager();
  post.upload(userID, postLink, title, tags, isVideo);
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

//Story

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
  const isVideo = req.body.isVideo;

  let story = new StoryManager();
  story.upload(userID, storyLink, title, isVideo);
  res.json({ message: "Data received and processed successfully" });
});

//Direct

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

//Group

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

app.post("/api/group/groupProfileIcon", (req, res) => {
  const groupID = req.body.groupID;
  const groupIcon = req.body.groupIcon;

  console.log(groupIcon);

  let groupManager = new GroupManager();
  groupManager.updateGroupIcon(groupID, groupIcon);
  res.json({ message: "Data received and processed successfully" });
});

app.post("/api/group/groupName", (req, res) => {
  const groupID = req.body.groupID;
  const groupName = req.body.groupName;

  let groupManager = new GroupManager();
  groupManager.updateGroupName(groupID, groupName);
  res.json({ message: "Data received and processed successfully" });
});

app.post("/api/group/delete", (req, res) => {
  const groupID = req.body.groupID;
  const groupMembers = req.body.groupMembers;

  let groupManager = new GroupManager();
  groupManager.deleteGroup(groupID, groupMembers);
  res.json({ message: "Data received and processed successfully" });
});

app.post("/api/group/create", (req, res) => {
  const userID = req.body.userID;
  const groupName = req.body.groupName;
  const groupIcon = req.body.groupIcon;
  const groupMember = req.body.groupMember;

  let groupManager = new GroupManager();
  groupManager.createGroup(userID, groupName, groupIcon, groupMember);
  res.json({ message: "Data received and processed successfully" });
});

//Create server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
