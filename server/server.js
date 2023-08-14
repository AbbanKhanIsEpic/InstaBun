const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
const cors = require("cors");

const { createConnection } = require("./DB");

const UserManager = require("./User");

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

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
