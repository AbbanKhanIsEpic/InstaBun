const { select } = require("./DB");
const { update } = require("./DB");

class UserManager {
  username;

  constructor(username) {
    this.username = username;
  }

  updatePassword(password) {
    const query = `UPDATE abbankDB.Users SET Password = '${password}' WHERE (UserID = '${this.username}');`;
    update(query);
  }

  updateDisplayName(displayName) {
    const query = `UPDATE abbankDB.Users SET DisplayName = '${displayName}' WHERE (UserID = '${this.username}');`;
    update(query);
  }

  async login(password) {
    console.log(password);
    console.log(this.username);

    var result = await select(
      `SELECT count(*) FROM abbankDB.Users where Username = ${this.username} AND Password=${password};`
    );
    return result;
  }
}

module.exports = UserManager;
