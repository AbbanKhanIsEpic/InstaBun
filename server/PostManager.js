const { select } = require("./DB");
const { update } = require("./DB");

class PostManager {
  async total(userID) {
    var result = await select(
      `SELECT count(*) FROM abbankDB.Post where UserID = "${userID}";`
    );
    return result;
  }
  async upload(userID, postLink, title, tags) {
    const tagPromises = tags.map(async (tag) => {
      const doesTagExist = (await this.doesTagExist(tag))[0]["count(*)"] == 1;
      if (!doesTagExist) {
        await this.createTag(tag);
      }
    });
    await Promise.all(tagPromises);

    const query = `INSERT INTO abbankDB.Post (UserID, PostLink,Title,LikeCount,ShareCount) VALUES ("${userID}", "${postLink}", "${title}","0","0");`;
    await update(query);
    const postIDResult = await this.getCurrentPostID(userID);
    const postID = postIDResult[0]["idPost"];
    await this.attachTagsToPost(tags, postID);
  }
  async doesTagExist(tag) {
    var result = await select(
      `SELECT count(*) FROM abbankDB.Tag where TagName = "${tag}";`
    );
    return result;
  }
  createTag(tag) {
    const query = `INSERT INTO abbankDB.Tag (TagName) VALUES ("${tag}");`;
    update(query);
  }
  async getTagID(tag) {
    var result = await select(
      `SELECT idTag FROM abbankDB.Tag where TagName = "${tag}";`
    );
    return result;
  }
  async getCurrentPostID(userID) {
    var result = await select(
      `SELECT idPost FROM abbankDB.Post where UserID = "${userID}" Order by idPost DESC Limit 1;`
    );
    return result;
  }
  async attachTagsToPost(tags, postID) {
    const tagPromises = tags.map(async (tag) => {
      const tagIDResult = await this.getTagID(tag);
      const tagID = tagIDResult[0]["idTag"];
      await this.attachTagToPost(tagID, postID);
    });
    await Promise.all(tagPromises);
  }
  attachTagToPost(tagID, postID) {
    const query = `INSERT INTO abbankDB.PostTags (postID,tagID) VALUES ("${postID}","${tagID}");`;
    update(query);
  }
  async getPostViaTags(tags) {}
}

module.exports = PostManager;
