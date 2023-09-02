const { select } = require("./DB");
const { update } = require("./DB");

class UserManager {
  updateProfile(
    userID,
    newDisplayName,
    newBio,
    newProfileIconLink,
    newVisibility,
    newDMLimit
  ) {
    const query = `UPDATE abbankDB.Users SET DisplayName = "${newDisplayName}", Bio = "${newBio}", ProfileIconLink = "${newProfileIconLink}", Visibility = "${newVisibility}", DMLimit = "${newDMLimit}" WHERE (UserID = "${userID}")`;
    update(query);
  }

  async getUserID(username) {
    var result = await select(
      `SELECT UserID FROM abbankDB.Users where Username = "${username}"`
    );
    return result;
  }

  async getUsername(userID) {
    var result = await select(
      `SELECT Username FROM abbankDB.Users where UserID = "${userID}"`
    );
    return result;
  }

  async getUserProfile(userID) {
    var result = await select(
      `SELECT Username,DisplayName,ProfileIconLink,Bio  FROM abbankDB.Users where UserID = "${userID}";`
    );
    return result;
  }

  async getUserProfileIconLink(userID) {
    var result = await select(
      `SELECT ProfileIconLink FROM abbankDB.Users where UserID = "${userID}";`
    );
    return result;
  }

  async getListOfUsernames(userID, searchingUsername) {
    var result = await select(
      `SELECT Username,DisplayName,ProfileIconLink FROM abbankDB.Users where Username Like "${
        "%" + searchingUsername + "%"
      }" AND UserID !=  "${userID}";`
    );
    return result;
  }

  async userLogin(username, password) {
    var result = await select(
      `SELECT count(*) FROM abbankDB.Users where Username = "${username}" AND Password = "${password}"`
    );
    return result;
  }

  async doesUsernameExist(username) {
    var result = await select(
      `SELECT count(*) FROM abbankDB.Users where Username = "${username}";`
    );
    return result;
  }

  async doesEmailExist(email) {
    var result = await select(
      `SELECT count(*) FROM abbankDB.Users where EmailAddress = "${email}";`
    );
    return result;
  }

  async getVisibility(userID) {
    var result = await select(
      `SELECT Visibility FROM abbankDB.Users where UserID = "${userID}";`
    );
    return result;
  }

  async getDMLimit(userID) {
    var result = await select(
      `SELECT DMLimit FROM abbankDB.Users where UserID = "${userID}";`
    );
    return result;
  }
}

module.exports = UserManager;
