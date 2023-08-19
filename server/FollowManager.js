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
  async getFollowings(followerID) {
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
  async isMutural(viewingUserID, showingUserID) {
    //I am really bad with naming convension
    var result = await select(
      `SELECT count(*) FROM abbankDB.Follows Where (FollowerID = "${viewingUserID}" AND FollowingID = "${showingUserID}") or (FollowerID = "${showingUserID}" AND FollowingID = "${viewingUserID}");`
    );
    return result;
  }
}

module.exports = FollowManager;
