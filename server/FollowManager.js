const { select } = require("./DB");
const { update } = require("./DB");

class FollowManager {
  follow(followerID, followingID) {
    const query = `INSERT INTO abbankDB.Follows (FollowerID, FollowingID) VALUES ("${followerID}", "${followingID}");`;
    update(query);
  }
  unfollow(followerID, followingID) {
    const query = `DELETE FROM abbankDB.Follows WHERE (FollowerID = "${followerID}") and (FollowingID = "${followingID}");`;
    update(query);
  }
  async isFollowing(followerID, followingID) {
    var result = await select(
      `SELECT count(*) FROM abbankDB.Follows where FollowerID = "${followerID}" AND FollowingID = "${followingID}"`
    );
    return result;
  }
  async getFollowering(followerID) {
    var result = await select(
      `SELECT * FROM abbankDB.Follows where FollowerID = "${followerID}"`
    );
    return result;
  }
  async getFollowers(followingID) {
    var result = await select(
      `SELECT * FROM abbankDB.Follows where FollowingID = "${followingID}"`
    );
    return result;
  }
  //ChatGPT said for "word for you follow a person and the person follow you" is Mutal
  async getMutual(userID) {
    var result = await select(
      `SELECT FollowingID as Friends FROM abbankDB.Follows Where FollowerID  = "${userID}" OR FollowingID = "${userID}" AND FollowerID = FollowingID;`
    );
    return result;
  }
}

module.exports = FollowManager;
