const { select } = require("./DB");
const { update } = require("./DB");

class User {
  updateDisplayName(username, newDisplayName) {
    const query = `UPDATE abbankDB.Users SET DisplayName = '${newDisplayName}' WHERE (Username = ${username});`;
    update(query);
  }

  async getUserID(username) {
    var result = await select(
      `SELECT UserID FROM abbankDB.Users where Username = ${username}`
    );
    return result;
  }

  async getListOfUsernames(username,searchingUsername) {
    var result = await select(
      `SELECT count(*) FROM abbankDB.Users where Username Like "${searchingUsername}" AND Username !=  ${username};`
    );
    return result;
  }

  async userLogin(username, password) {
    var result = await select(
      `SELECT count(*) FROM abbankDB.Users where Username = ${username} AND Password = ${password}`
    );
    return result;
  }

  async doesUsernameExist(username) {
    var result = await select(
      `SELECT count(*) FROM abbankDB.Users where Username = ${username};`
    );
    return result;
  }

  async doesEmailExist(email) {
    var result = await select(
      `SELECT count(*) FROM abbankDB.Users where EmailAddress = ${email};`
    );
    return result;
  }
}

module.exports = User;
