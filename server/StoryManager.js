const { select } = require("./DB");
const { update } = require("./DB");

class StoryManager {
  upload(userID, StoryLink, Title) {
    const query = `INSERT INTO abbankDB.Story (UserID, StoryLink,Title) VALUES ("${userID}", "${StoryLink}", "${Title}");`;
    update(query);
  }

  async total(userID) {
    var result = await select(
      `SELECT count(*) FROM abbankDB.Story where UserID = "${userID}";`
    );
    return result;
  }
}

module.exports = StoryManager;
