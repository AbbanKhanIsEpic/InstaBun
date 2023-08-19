const { select } = require("./DB");
const { update } = require("./DB");

const UserManager = require("./UserManager");
const FollowManager = require("./FollowManager");

class PostManager {
  async total(userID) {
    var result = await select(
      `SELECT count(*) FROM abbankDB.Post where UserID = "${userID}";`
    );
    return result;
  }
  async upload(userID, postLink, title, tags) {
    const tagPromises = tags.map(async (tag) => {
      const doesTagExist = await this.doesTagExist(tag);
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
    return result[0]["count(*)"] == 1;
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
  async getPostIDs(tagID) {
    var result = await select(
      `SELECT distinct postID FROM abbankDB.PostTags where tagID in (${tagID});`
    );
    return result;
  }
  async getUserID(postID) {
    var result = await select(
      `SELECT UserID FROM abbankDB.Post where idPost = "${postID}";`
    );
    return result;
  }
  async getDetails(postID) {
    var result = await select(
      `SELECT PostLink,Title,LikeCount,ShareCount FROM abbankDB.Post where idPost = "${postID}";`
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
  async getPostViaTags(userID, tags) {
    let tagIDArray = [];
    const tagPromises = tags.map(async (tag) => {
      const tagID = (await this.getTagID(tag))[0]["idTag"];
      tagIDArray.push(tagID);
    });
    await Promise.all(tagPromises);
    const postIDsResult = await this.getPostIDs(tagIDArray);
    const filteredPostIDs = await this.filterPost(userID, postIDsResult);

    let filteredPostDetails = [];
    const postDetailsPromises = filteredPostIDs.map(async (filteredPostID) => {
      const details = await this.getDetails(filteredPostID);
      const uploaderID = (await this.getUserID(filteredPostID))[0]["UserID"];
      const user = new UserManager();
      const username = await user.getUsername(uploaderID);
      const userProfile = await user.getUserProfileIconLink(uploaderID);
      const rowArray = [];
      rowArray.push(filteredPostID);
      rowArray.push(details);
      rowArray.push(username);
      rowArray.push(userProfile);
      filteredPostDetails.push(rowArray);
    });
    await Promise.all(postDetailsPromises);

    return filteredPostDetails;
  }

  async filterPost(userID, postIDsResult) {
    let postIDs = [];
    const postIDPromises = postIDsResult.map(async (element) => {
      const postID = element["postID"];
      const uploaderID = (await this.getUserID(postID))[0]["UserID"];
      const user = new UserManager();
      const follow = new FollowManager();
      const uploaderIDVis = (await user.getVisibility(uploaderID))[0][
        "Visibility"
      ];
      if (uploaderIDVis == 0) {
        postIDs.push(postID);
      } else if (uploaderIDVis == 1) {
        const isFollowing =
          (await follow.isFollowing(userID, uploaderID))[0]["count(*)"] == 1;
        if (isFollowing) {
          postIDs.push(postID);
        }
      } else if (uploaderIDVis == 2) {
        const isMutural =
          (await follow.isMutural(userID, uploaderID))[0]["count(*)"] == 2;
        if (isMutural) {
          postIDs.push(postID);
        }
      }
    });
    await Promise.all(postIDPromises);

    return postIDs;
  }
}

module.exports = PostManager;
