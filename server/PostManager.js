const { select } = require("./DB");
const { update } = require("./DB");

class PostManager {
  //This is used for the naming convension for uploading files to firebase
  async total(userID) {
    var result = await select(
      `SELECT count(*) FROM abbankDB.Post where UserID = "${userID}";`
    );
    return result;
  }

  async upload(userID, postLink, title, tags) {
    //It is a promise because this needs to run first
    //So we can create the tags first then upload the post then attach the tags to the post
    const tagPromises = tags.map(async (tag) => {
      //Look through each of the tags
      const doesTagExist = await this.#doesTagExist(tag);
      //Check if that tag exits
      //If not: create it
      if (!doesTagExist) {
        this.#createTag(tag);
      }
    });
    await Promise.all(tagPromises);

    //Create the post
    const query = `INSERT INTO abbankDB.Post (UserID, PostLink,Title,LikeCount,ShareCount) VALUES ("${userID}", "${postLink}", "${title}","0","0");`;
    update(query);
    //Since this is the latest post, we can get its ID
    const postID = await this.#getCurrentPostID(userID);
    await this.#attachTagsToPost(tags, postID);
  }

  //This is a private method because only need to run this when a post is being uploaded
  async #doesTagExist(tag) {
    var result = await select(
      `SELECT count(*) FROM abbankDB.Tag where TagName = "${tag}";`
    );
    return result[0]["count(*)"] == 1;
  }

  //This is a private method because only need to run this when a post is being uploaded
  #createTag(tag) {
    const query = `INSERT INTO abbankDB.Tag (TagName) VALUES ("${tag}");`;
    update(query);
  }

  async getTagID(tag) {
    var result = await select(
      `SELECT idTag FROM abbankDB.Tag where TagName = "${tag}";`
    );
    return result;
  }

  async #getPostIDs(tagID) {
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
  async #getCurrentPostID(userID) {
    var result = await select(
      `SELECT idPost FROM abbankDB.Post where UserID = "${userID}" Order by idPost DESC Limit 1;`
    );
    return result[0]["idPost"];
  }
  async #attachTagsToPost(tags, postID) {
    const tagIDsArray = await this.#getTagIDs(tags);
    const attachTagIDToPostPromise = tagIDsArray.map(async (tagID) => {
      //Now attaching individual tag to the post
      const query = `INSERT INTO abbankDB.PostTags (postID,tagID) VALUES ("${postID}","${tagID}");`;
      update(query);
    });

    await Promise.all(attachTagIDToPostPromise);
  }

  //get the posts from the tags the user entered
  async getPostViaTags(userID, tags) {
    const tagIDsArray = await this.#getTagIDs(tags);

    console.log(tagIDsArray);

    const postIDsJson = await this.#getPostIDs(tagIDsArray);

    const postIDsArray = postIDsJson.map((element) => element.postID);

    const postDetailsArray = await this.#getPostDetails(userID, postIDsArray);

    return postDetailsArray;
  }

  async #filterPost(userID, postIDsArray) {
    var filteringPost = await select(
      `SELECT Post.idPost,Users.UserID, Users.Visibility, (SELECT COUNT(*) FROM abbankDB.Follows WHERE (FollowerID = ${userID} AND FollowingID = Users.UserID) OR (FollowerID = Users.UserID AND FollowingID = ${userID})) AS Status
      FROM abbankDB.Post INNER JOIN Users ON Users.UserID = Post.UserID WHERE Post.idPost IN (${postIDsArray}) HAVING Status >= Users.Visibility;`
    );

    const postIDAndUserIDArray = filteringPost.map((element) => {
      const postID = element.idPost;
      const userID = element.UserID;
      const postIDAndUserID = {
        postID: postID,
        userID: userID,
      };
      return postIDAndUserID;
    });

    return postIDAndUserIDArray;
  }

  async #getPostDetails(userID, postIDsArray) {
    const filteredPost = await this.#filterPost(userID, postIDsArray);

    const postDetailsArray = [];

    const extractDetailsPromise = filteredPost.map(async (element) => {
      const uploader = element.userID;
      const upload = element.postID;

      const uploaderDetail = await select(
        `SELECT DisplayName,ProfileIconLink FROM abbankDB.Users WHERE UserID = ${uploader};`
      );

      const uploadDetail = await select(
        `SELECT PostLink,Title,(SELECT count(*) FROM abbankDB.PostShare where PostShare.postID = ${upload}) as commentCount,(SELECT  COUNT(*) FROM abbankDB.PostShare WHERE PostShare.postID = ${upload}) AS shareCount, (SELECT  COUNT(*) FROM abbankDB.PostLike WHERE PostLike.postID = ${upload}) AS likeCount FROM abbankDB.Post;`
      );

      postDetailsArray.push([uploadDetail, uploaderDetail]);
    });

    await Promise.all(extractDetailsPromise);

    return postDetailsArray;
  }

  async #getTagIDs(tags) {
    var result = await select(
      `SELECT idTag FROM abbankDB.Tag WHERE TagName in (${tags});`
    );
    //Convert the json into an array of ids
    const idsArray = result.map((element) => element.idTag);
    return idsArray;
  }
}

module.exports = PostManager;
