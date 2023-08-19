const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
const cors = require("cors");

const { createConnection } = require("./DB");

const UserManager = require("./UserManager");
const FollowManager = require("./FollowManager");
const PostManager = require("./PostManager");
const StoryManager = require("./StoryManager");

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

app.get("/api/user/username", (req, res) => {
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

app.get("/api/post/viaTags", (req, res) => {
  const { userID, tags } = req.query;

  console.log(tags);

  const tagsArray = tags.split(",");

  console.log(tagsArray);

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

app.get("/api/story/total", (req, res) => {
  const { userID } = req.query;

  let story = new StoryManager();

  story
    .total(userID)
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

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
