const { select, update } = require("./DB");
const FollowManager = require("./FollowManager");

class StoryManager {
  async upload(userID, StoryLink, Title) {
    try {
      const query = `INSERT INTO abbankDB.Story (UserID, StoryLink,Title,uploadDateTime) VALUES (?, ?, ?,now());`;
      await update(query, [userID, StoryLink, Title]);
      return "Upload story operation successful";
    } catch (error) {
      return error;
    }
  }

  async total(userID) {
    try {
      const query = `SELECT count(*) FROM abbankDB.Story where UserID = ?;`;
      const [result] = await select(query, [userID]);
      return result["count(*)"];
    } catch (error) {
      return error;
    }
  }

  async getStories(userID) {
    try {
      const follow = new FollowManager();
      const followingArray = await follow.getFollowings(userID);
      const query = `SELECT 
      timestampdiff(HOUR,Story.uploadDateTime,now()) as hoursOlD,
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
      Story.UserID in (?)
 Having hoursOlD <= 24
 Order by hoursOlD;`;

      const result = await select(query, [followingArray]);
      return result;
    } catch (error) {
      return error;
    }
  }
}

module.exports = StoryManager;
