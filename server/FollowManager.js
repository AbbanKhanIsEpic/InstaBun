const { select } = require("./DB");
const { update } = require("./DB");

class FollowManager {
  async follow(followerID, followingID) {
    try {
      const query = `INSERT INTO abbankDB.Follows (FollowerID, FollowingID) VALUES (?, ?);`;
      await update(query, [followerID, followingID]);
      return "Follow operation successful";
    } catch (error) {
      throw error;
    }
  }
  async unfollow(followerID, followingID) {
    try {
      const query = `DELETE FROM abbankDB.Follows WHERE (FollowerID =?) and (FollowingID = ?);`;
      await update(query, [followerID, followingID]);
      return "Unfollow operation successful";
    } catch (error) {
      throw error;
    }
  }
  async isFollowing(followerID, followingID) {
    try {
      const query = `SELECT count(*) FROM abbankDB.Follows where FollowerID = ? AND FollowingID = ?;`;
      const result = await select(query, [followerID, followingID]);
      if (result.length === 0) {
        throw new Error(
          `Unable to retrieve to determine if the user is following or not`
        );
      }
      return result[0]["count(*)"] == 1;
    } catch (error) {
      throw error;
    }
  }
  async getFollowings(followerID) {
    try {
      const query = `SELECT FollowingID FROM abbankDB.Follows where FollowerID = ?;`;
      const result = await select(query, [followerID]);
      if (result.length === 0) {
        throw new Error(`Unable to retrieve who the user follow`);
      }
      const followings = result.map((row) => row.FollowingID);
      return followings;
    } catch (error) {
      throw error;
    }
  }
  async getFollowers(followingID) {
    try {
      const query = `SELECT FollowerID FROM abbankDB.Follows where FollowingID = ?;`;
      const result = await select(query, [followingID]);
      if (result.length === 0) {
        throw new Error(`Unable to retrieve who following the user`);
      }
      const followers = result.map((row) => row.FollowingID);
      return followers;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = FollowManager;
