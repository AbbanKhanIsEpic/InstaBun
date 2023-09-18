const { select } = require("./DB");
const { update } = require("./DB");
const FollowManager = require("./FollowManager");

class StoryManager {
  async upload(userID, StoryLink, Title) {
    try {
      const query = `INSERT INTO abbankDB.Story (UserID, StoryLink,Title,uploadDateTime) VALUES (?, ?, ?,now());`;
      await update(query, [userID, StoryLink, Title]);
      return "Upload story operation successful";
    } catch (error) {
      throw error;
    }
  }

  async total(userID) {
    try {
      const query = `SELECT count(*) FROM abbankDB.Story where UserID = ?;`;
      const result = await select(query, [userID]);
      if (result.length === 0) {
        throw new Error(
          `Unable to retrieve the how many stories the user has uploaded`
        );
      }
      return result[0]["count(*)"];
    } catch (error) {
      throw error;
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
 Having hoursOlD <= 24;
 Order by hoursOlD;`;

      const result = await select(query, [followingArray]);
      if (result.length === 0) {
        throw new Error(`Unable to retrieve stories for the user`);
      }

      return result;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = StoryManager;
