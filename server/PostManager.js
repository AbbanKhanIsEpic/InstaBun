const { select } = require("./DB");
const { update } = require("./DB");
const FollowManager = require("./FollowManager");

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
    const query = `INSERT INTO abbankDB.Post (UserID, PostLink,Title) VALUES ("${userID}", "${postLink}", "${title}");`;
    update(query);
    //Since this is the latest post, we can get its ID
    const postID = await this.#getCurrentPostID(userID);
    await this.#attachTagsToPost(tags, postID);
  }

  //This is a private method because only need to run this when a post is being uploaded
  async #doesTagExist(tag) {
    var result = await select(
      `SELECT count(*) FROM abbankDB.Tag where TagName = ${tag};`
    );
    return result[0]["count(*)"] == 1;
  }

  //This is a private method because only need to run this when a post is being uploaded
  #createTag(tag) {
    const query = `INSERT INTO abbankDB.Tag (TagName) VALUES (${tag});`;
    update(query);
  }

  async #getPostIDs(tagID) {
    var result = await select(
      `SELECT distinct postID FROM abbankDB.PostTags where tagID in (${tagID});`
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
    //It is a promise because this needs to run first
    //Because we might have a post attached to the tag the user search for
    const tagPromises = tags.map(async (tag) => {
      //Look through each of the tags
      console.log(tags);
      console.log(tag);
      const doesTagExist = await this.#doesTagExist(tag);
      console.log(doesTagExist);
      //Check if that tag exits
      if (!doesTagExist) {
        tags.pop(tag);
      }
    });

    await Promise.all(tagPromises);

    if (tags.length != 0) {
      const tagIDsArray = await this.#getTagIDs(tags);

      const postIDsJson = await this.#getPostIDs(tagIDsArray);

      const postIDsArray = postIDsJson.map((element) => element.postID);

      const postDetailsArray = await this.#getPostDetails(userID, postIDsArray);

      return postDetailsArray;
    }
    return false;
  }

  async #filterPost(userID, postIDsArray) {
    var filteringPost = await select(
      `SELECT 
      Post.idPost,
      Users.UserID,
      Users.Visibility,
      (SELECT 
              COUNT(*)
          FROM
              abbankDB.Follows
          WHERE
              (FollowerID = ${userID}
                  AND FollowingID = Users.UserID)
                  OR (FollowerID = Users.UserID
                  AND FollowingID = ${userID})) AS Status
  FROM
      abbankDB.Post
          INNER JOIN
      Users ON Users.UserID = Post.UserID
  WHERE
      Post.idPost IN (${postIDsArray})
  HAVING Status >= Users.Visibility
  ORDER BY Post.idPost DESC;`
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
        `SELECT Username,ProfileIconLink FROM abbankDB.Users WHERE UserID = ${uploader};`
      );

      const uploadDetail = await select(
        `SELECT 
        PostLink,
        Title,
        (SELECT 
                COUNT(*)
            FROM
                PostLike
            WHERE
                PostLike.postID = ${upload}
                    AND PostLike.userID = ${userID}) AS didUserLike,
        (SELECT 
                COUNT(*)
            FROM
                PostLike
                    INNER JOIN
                Post ON PostLike.postID = Post.idPost
            WHERE
                Post.idPost = ${upload}) AS likeCount,
        (SELECT 
                COUNT(*)
            FROM
                PostShare
                    INNER JOIN
                Post ON PostShare.postID = Post.idPost
            WHERE
                Post.idPost = ${upload}) AS shareCount,
        (SELECT 
                COUNT(*)
            FROM
                PostComment
                    INNER JOIN
                Post ON PostComment.postID = Post.idPost
            WHERE
                Post.idPost = ${upload}) AS commentCount
    FROM
        Post
    WHERE
        Post.idPost = ${upload}`
      );

      const details = {
        postID: upload,
        uploadDetail: uploadDetail,
        uploaderDetail: uploaderDetail,
      };

      postDetailsArray.push(details);
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

  like(postID, userID) {
    const query = `Insert into PostLike(postID,userID) Values("${postID}","${userID}");`;
    update(query);
  }

  unlike(postID, userID) {
    const query = `Delete from PostLike where postID = "${postID}" AND userID = "${userID}"`;
    update(query);
  }

  async getFollowingPost(userID) {
    const follow = new FollowManager();
    const result = await follow.getFollowings(userID);
    const followingArray = result.map((followingID) => {
      return `"${followingID["FollowingID"]}"`;
    });

    const followingsPostID = await select(
      `SELECT idPost FROM abbankDB.Post WHERE UserID in (${followingArray});`
    );
    const followingsPostIDArray = followingsPostID.map((postID) => {
      return `"${postID["idPost"]}"`;
    });
    const filteredPost = await this.#getPostDetails(
      userID,
      followingsPostIDArray
    );
    return filteredPost;
  }

  comment(postID, userID,comment) {
    const query = `INSERT INTO abbankDB.PostComment (PostID, Commenter, Comment) VALUES ("${postID}", "${userID}", "${comment}");`;
    update(query);
  }
 
}

module.exports = PostManager;
