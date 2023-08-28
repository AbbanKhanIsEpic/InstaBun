const { select } = require("./DB");
const { update } = require("./DB");
const FollowManager = require("./FollowManager");

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

  async getStories(userID) {
    const follow = new FollowManager();
    const result = await follow.getFollowings(userID);
    const followingArray = result.map((followingID) => {
      return `"${followingID["FollowingID"]}"`;
    });

    const followingsStories = await select(
      `SELECT 
      Story.UserID,
      Story.idStory,
      Story.StoryLink,
      Story.Title,
      Users.Visibility,
      Users.ProfileIconLink
  FROM
      Story
          INNER JOIN
      Users ON Users.UserID = Story.UserID
  WHERE
      Story.UserID in (${followingArray});`
    );

    return followingsStories;
  }
}

module.exports = StoryManager;
