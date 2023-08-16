const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
const cors = require("cors");

const { createConnection } = require("./DB");

const User = require("./User");
const Follow = require("./Follow");

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

  let user = new User();

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

  let user = new User();

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

  let user = new User();

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

  let user = new User();

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

  let user = new User();

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

  let user = new User();

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

app.get("/api/follow/following", (req, res) => {
  const { currentID, profileID } = req.query;

  let follow = new Follow();

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

app.get("/api/follow/followerCount", (req, res) => {
  const { profileID } = req.query;

  let follow = new Follow();

  follow
    .getFollowersCount(profileID)
    .then((jsonifiedResult) => {
      res.status(200).send(jsonifiedResult);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error occurred");
    });
});

app.get("/api/follow/followingCount", (req, res) => {
  const { profileID } = req.query;

  let follow = new Follow();

  follow
    .getFolloweringCount(profileID)
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

  let follow = new Follow();
  follow.follow(followerID, followingID);
  res.json({ message: "Data received and processed successfully" });
});

app.post("/api/follow/unfollow", (req, res) => {
  const followerID = req.body.currentID;
  const followingID = req.body.profileID;

  let follow = new Follow();
  follow.unfollow(followerID, followingID);

  res.json({ message: "Data received and processed successfully" });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
