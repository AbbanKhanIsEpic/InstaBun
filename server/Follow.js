const { select } = require("./DB");
const { update } = require("./DB");

class Follow {
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
}

module.exports = Follow;
