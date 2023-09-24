const { select } = require("./DB");
const { update } = require("./DB");

class UserManager {
  async updateProfile(
    userID,
    newDisplayName,
    newBio,
    newProfileIconLink,
    newVisibility,
    newDMLimit
  ) {
    try {
      const query = `UPDATE abbankDB.Users SET DisplayName = ?, Bio = ?, ProfileIconLink = ?, Visibility = ?, DMLimit = ?  WHERE (UserID = ?)`;
      await update(query, [
        newDisplayName,
        newBio,
        newProfileIconLink,
        newVisibility,
        newDMLimit,
        userID,
      ]);
      return "Update profile operation successful";
    } catch (error) {
      return error;
    }
  }

  async isUserBlocked(blockerUserID, blockedUserID) {
    try {
      const query = `SELECT count(*) FROM abbankDB.BlockUser where BlockerUserID = ? AND BlockedUserID = ?;`;
      const [result] = await select(query, [blockerUserID, blockedUserID]);
      return result["count(*)"] == 1;
    } catch (error) {
      return error;
    }
  }

  async block(blockerUserID, blockedUserID) {
    try {
      const query = `INSERT INTO BlockUser(BlockerUserID,BlockedUserID) VALUE(?,?);`;
      await update(query, [blockerUserID, blockedUserID]);
      return "Block operation successful";
    } catch (error) {
      return error;
    }
  }

  async unblock(blockerUserID, blockedUserID) {
    try {
      const query = `DELETE FROM BlockUser WHERE BlockerUserID = ? AND BlockedUserID = ?;`;
      await update(query, [blockerUserID, blockedUserID]);
      return "Unblock operation successful";
    } catch (error) {
      return error;
    }
  }

  async getUserID(username) {
    try {
      const query = `SELECT UserID FROM abbankDB.Users where Username = ?`;
      const [result] = await select(query, [username]);
      return result;
    } catch (error) {
      return error;
    }
  }

  async getUsername(userID) {
    try {
      const query = `SELECT Username FROM abbankDB.Users where UserID = ?`;
      const [result] = await select(query, [userID]);
      return result;
    } catch (error) {
      return error;
    }
  }

  async getDisplayName(userID) {
    try {
      const query = `SELECT DisplayName FROM abbankDB.Users where UserID = ?`;
      const [result] = await select(query, [userID]);
      return result;
    } catch (error) {
      return error;
    }
  }

  async getUserProfile(userID) {
    try {
      const query = `SELECT Username,DisplayName,ProfileIconLink,Bio  FROM abbankDB.Users where UserID = ?;`;
      const [result] = await select(query, [userID]);
      return result;
    } catch (error) {
      return error;
    }
  }

  async getUserProfileIconLink(userID) {
    try {
      const query = `SELECT ProfileIconLink FROM abbankDB.Users where UserID = ?`;
      const [result] = await select(query, [userID]);
      if (result.length === 0) {
        return new Error("Unable to get the link of the user's profile icon");
      }
      return result;
    } catch (error) {
      return error;
    }
  }

  async getListOfUsernames(userID, searchingUsername) {
    searchingUsername = "%" + searchingUsername + "%";
    try {
      const query = `SELECT Username,DisplayName,ProfileIconLink FROM abbankDB.Users where Username Like ? AND UserID !=  ?;`;
      const result = await select(query, [searchingUsername, userID]);
      return result;
    } catch (error) {
      return error;
    }
  }

  async userLogin(username, password) {
    try {
      const query = `SELECT count(*) FROM abbankDB.Users where Username = ? AND Password = ?`;
      const [result] = await select(query, [username, password]);
      return result["count(*)"] == 1;
    } catch (error) {
      return error;
    }
  }

  async doesUsernameExist(username) {
    try {
      const query = `SELECT count(*) FROM abbankDB.Users where Username = ?;`;
      const [result] = await select(query, [username]);
      return result["count(*)"] == 1;
    } catch (error) {
      return error;
    }
  }

  async doesEmailExist(email) {
    try {
      const query = `SELECT count(*) FROM abbankDB.Users where EmailAddress = ?;`;
      const [result] = await select(query, [email]);
      return result["count(*)"] == 1;
    } catch (error) {
      return error;
    }
  }

  async getVisibility(userID) {
    try {
      const query = `SELECT Visibility FROM abbankDB.Users where UserID = ?`;
      const [result] = await select(query, [userID]);
      return result;
    } catch (error) {
      return error;
    }
  }

  async getDMLimit(userID) {
    try {
      const query = `SELECT DMLimit FROM abbankDB.Users where UserID = ?;`;
      const [result] = await select(query, [userID]);
      return result;
    } catch (error) {
      return error;
    }
  }
}

module.exports = UserManager;
