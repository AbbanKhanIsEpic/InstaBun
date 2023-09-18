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
      throw error;
    }
  }

  async isUserBlocked(blockerUserID, blockedUserID) {
    try {
      const query = `SELECT count(*) FROM abbankDB.BlockUser where BlockerUserID = ? AND BlockedUserID = ?;`;
      const result = await select(query, [blockerUserID, blockedUserID]);
      if (result.length === 0) {
        throw new Error(
          `Unable to verify if user with the ID ${blockerUserID} has blocked the user with the ID ${blockedUserID}`
        );
      }

      return result[0]["count(*)"] == 1;
    } catch (error) {
      throw error;
    }
  }

  async block(blockerUserID, blockedUserID) {
    try {
      const query = `INSERT INTO BlockUser(BlockerUserID,BlockedUserID) VALUE(?,?);`;
      await update(query, [blockerUserID, blockedUserID]);
      return "Block operation successful";
    } catch (error) {
      throw error;
    }
  }

  async unblock(blockerUserID, blockedUserID) {
    try {
      const query = `DELETE FROM BlockUser WHERE BlockerUserID = ? AND BlockedUserID = ?;`;
      await update(query, [blockerUserID, blockedUserID]);
      return "Unblock operation successful";
    } catch (error) {
      throw error;
    }
  }

  async getUserID(username) {
    try {
      const query = `SELECT UserID FROM abbankDB.Users where Username = ?`;
      const result = await select(query, [username]);
      if (result.length === 0) {
        throw new Error(`UserID of the username: ${username} can not be found`);
      }
      return result[0]["UserID"];
    } catch (error) {
      throw error;
    }
  }

  async getUsername(userID) {
    try {
      const query = `SELECT Username FROM abbankDB.Users where UserID = ?`;
      const result = await select(query, [userID]);
      if (result.length === 0) {
        throw new Error(`Username of the userID: ${userID} can not be found`);
      }
      return result[0]["Username"];
    } catch (error) {
      throw error;
    }
  }

  async getDisplayName(userID) {
    try {
      const query = `SELECT DisplayName FROM abbankDB.Users where UserID = ?`;
      const result = await select(query, [userID]);
      if (result.length === 0) {
        throw new Error(`Display name of the user can not be found`);
      }
      return result[0]["DisplayName"];
    } catch (error) {
      throw error;
    }
  }

  async getUserProfile(userID) {
    try {
      const query = `SELECT Username,DisplayName,ProfileIconLink,Bio  FROM abbankDB.Users where UserID = ?;`;
      const result = await select(query, [userID]);
      if (result.length === 0) {
        throw new Error(`The profile of the user can not be found`);
      }
      return result;
    } catch (error) {
      throw error;
    }
  }

  async getUserProfileIconLink(userID) {
    try {
      const query = `SELECT ProfileIconLink FROM abbankDB.Users where UserID = ?;`;
      const result = await select(query, [userID]);
      if (result.length === 0) {
        throw new Error(`The link of the user's profile icon can not be found`);
      }
      return result[0]["ProfileIconLink"];
    } catch (error) {
      throw error;
    }
  }

  async getListOfUsernames(userID, searchingUsername) {
    searchingUsername = "%" + searchingUsername + "%";
    try {
      const query = `SELECT Username,DisplayName,ProfileIconLink FROM abbankDB.Users where Username Like ? AND UserID !=  ?;`;
      const result = await select(query, [searchingUsername, userID]);
      if (result.length === 0) {
        throw new Error(
          `Unable to retrieve a list of usernames containing '${searchingUsername}'`
        );
      }
      return result;
    } catch (error) {
      throw error;
    }
  }

  async userLogin(username, password) {
    try {
      const query = `SELECT count(*) FROM abbankDB.Users where Username = ? AND Password = ?`;
      const result = await select(query, [username, password]);
      if (result.length === 0) {
        throw new Error(
          `Unable to determine if the user with the username ${username} has entered credentials correctly`
        );
      }
      return result[0]["count(*)"] == 1;
    } catch (error) {
      throw error;
    }
  }

  async doesUsernameExist(username) {
    try {
      const query = `SELECT count(*) FROM abbankDB.Users where Username = ?;`;
      const result = await select(query, [username]);
      if (result.length === 0) {
        throw new Error(
          `Unable to determine if the username: ${username} exits`
        );
      }
      return result[0]["count(*)"] == 1;
    } catch (error) {
      throw error;
    }
  }

  async doesEmailExist(email) {
    try {
      const query = `SELECT count(*) FROM abbankDB.Users where EmailAddress = ?;`;
      const result = await select(query, [email]);
      if (result.length === 0) {
        throw new Error(
          `Email: ${email} is unable to be determined if it exists or not `
        );
      }
      return result[0]["count(*)"] == 1;
    } catch (error) {
      throw error;
    }
  }

  async getVisibility(userID) {
    try {
      const query = `SELECT Visibility FROM abbankDB.Users where UserID = ?`;
      const result = await select(query, [userID]);
      if (result.length === 1) {
        throw new Error("Unable to retrieve the visibility of the user");
      }
      return result[0]["Visibility"];
    } catch (error) {
      throw error;
    }
  }

  async getDMLimit(userID) {
    try {
      const query = `SELECT DMLimit FROM abbankDB.Users where UserID = ?;`;
      const result = await select(query, [userID]);
      if (result.length === 0) {
        throw new Error(`Unable to retrieve the DM Limit of the user`);
      }
      return result[0]["DMLimit"];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = UserManager;
