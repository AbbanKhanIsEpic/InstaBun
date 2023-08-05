const { select } = require("./DB");
const { update } = require("./DB");

class UserManager {
  #username;
  #userID;
  #email;

  constructor(input) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(input)) {
      this.#email = input;
    } else {
      this.#username = input;
    }
  }

  updatePassword(newPassword) {
    const query = `UPDATE abbankDB.Users SET Password = '${newPassword}' WHERE (UserID = ${
      this.#userID
    });`;
    update(query);
  }

  updateDisplayName(newDisplayName) {
    const query = `UPDATE abbankDB.Users SET DisplayName = '${newDisplayName}' WHERE (UserID = ${
      this.#userID
    });`;
    update(query);
  }

  async userLogin(password) {
    var result = await select(
      `SELECT count(*) FROM abbankDB.Users where Username = ${
        this.#username
      }  AND Password=${password};`
    );
    return result;
  }

  async doesUsernameExist() {
    var result = await select(
      `SELECT count(*) FROM abbankDB.Users where Username = ${this.#username};`
    );
    return result;
  }

  async doesEmailExist() {
    var result = await select(
      `SELECT count(*) FROM abbankDB.Users where EmailAddress = ${this.#email};`
    );
    return result;
  }
}

module.exports = UserManager;
