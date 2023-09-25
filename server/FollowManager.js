const { select } = require("./DB");
const { update } = require("./DB");

class FollowManager {
  async follow(followerID, followingID) {
    try {
      const query = `INSERT INTO abbankDB.Follows (FollowerID, FollowingID) VALUES (?, ?);`;
      await update(query, [followerID, followingID]);
      return "Follow operation successful";
    } catch (error) {
      return error;
    }
  }
  async unfollow(followerID, followingID) {
    try {
      const query = `DELETE FROM abbankDB.Follows WHERE (FollowerID =?) and (FollowingID = ?);`;
      await update(query, [followerID, followingID]);
      return "Unfollow operation successful";
    } catch (error) {
      return error;
    }
  }
  async isFollowing(followerID, followingID) {
    try {
      const query = `SELECT count(*) FROM abbankDB.Follows where FollowerID = ? AND FollowingID = ?;`;
      const [result] = await select(query, [followerID, followingID]);
      return result["count(*)"] == 1;
    } catch (error) {
      return error;
    }
  }
  async getFollowings(followerID) {
    try {
      const query = `SELECT FollowingID FROM abbankDB.Follows where FollowerID = ?;`;
      const result = await select(query, [followerID]);
      const followings = result.map((row) => row.FollowingID);
      return followings;
    } catch (error) {
      return error;
    }
  }
  async getFollowers(followingID) {
    try {
      const query = `SELECT FollowerID FROM abbankDB.Follows where FollowingID = ?;`;
      const result = await select(query, [followingID]);
      const followers = result.map((row) => row.FollowerID);
      return followers;
    } catch (error) {
      return error;
    }
  }
}

module.exports = FollowManager;
