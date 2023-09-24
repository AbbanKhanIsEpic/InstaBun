const { select } = require("./DB");
const { update } = require("./DB");
const FollowManager = require("./FollowManager");

class PostManager {
  //This is used for the naming convension for uploading files to firebase
  async total(userID) {
    try {
      const query = `SELECT count(*) FROM abbankDB.Post where UserID = ?;`;
      const [result] = await select(query, [userID]);
      return result["count(*)"];
    } catch (error) {
      return error;
    }
  }

  async upload(userID, postLink, title, tags) {
    try {
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
      const query = `INSERT INTO abbankDB.Post (UserID, PostLink,Title) VALUES (?,?,?);`;
      await update(query, [userID, postLink, title]);
      //Since this is the latest post, we can get its ID
      const postID = await this.#getCurrentPostID(userID);
      await this.#attachTagsToPost(tags, postID);
    } catch (error) {
      return error;
    }
  }

  //This is a private method because only need to run this when a post is being uploaded
  async #doesTagExist(tag) {
    try {
      const query = `SELECT count(*) FROM abbankDB.Tag where TagName = ?;`;
      const [result] = await select(query, [tag]);
      return result["count(*)"] == 1;
    } catch (error) {
      return error;
    }
  }

  //This is a private method because only need to run this when a post is being uploaded
  async #createTag(tag) {
    try {
      const query = `INSERT INTO abbankDB.Tag (TagName) VALUES (?);`;
      await update(query, [tag]);
      return "Create tag operation successful";
    } catch (error) {
      return error;
    }
  }

  async #getPostIDs(tagID) {
    try {
      const query = `SELECT distinct postID FROM abbankDB.PostTags where tagID in (?);`;
      const result = await select(query, [tagID]);
      const postIDsArray = result.map((row) => row.postID);
      return postIDsArray;
    } catch (error) {
      return error;
    }
  }

  async #getCurrentPostID(userID) {
    try {
      const query = `SELECT idPost FROM abbankDB.Post where UserID = ? Order by idPost DESC Limit 1;`;
      const [result] = await select(query, [userID]);
      return result.idPost;
    } catch (error) {
      return error;
    }
  }
  async #attachTagsToPost(tags, postID) {
    try {
      const tagIDsArray = await this.#getTagIDs(tags);
      const attachTagIDToPostPromise = tagIDsArray.map(async (tagID) => {
        //Now attaching individual tag to the post
        const query = `INSERT INTO abbankDB.PostTags (postID,tagID) VALUES (?,?);`;
        await update(query, [postID, tagID]);
      });
      await Promise.all(attachTagIDToPostPromise);
      return "Attach tags to post operation successful";
    } catch (error) {
      return error;
    }
  }

  //get the posts from the tags the user entered
  async getPostViaTags(userID, tags) {
    console.log(tags);
    try {
      //It is a promise because this needs to run first
      //Because we might have a post attached to the tag the user search for
      const tagPromises = tags.map(async (tag) => {
        //Look through each of the tags
        const doesTagExist = await this.#doesTagExist(tag);
        //Check if that tag exits
        //Can not search for a video that contains a tag that does not exits
        if (!doesTagExist) {
          tags.pop(tag);
        }
      });

      await Promise.all(tagPromises);

      if (tags.length === 0) {
        return new Error("Unable to retrieve post via the provided tags");
      }

      const tagIDsArray = await this.#getTagIDs(tags);

      const postIDsArray = await this.#getPostIDs(tagIDsArray);

      const filteredPost = await this.#filterPostForAll(postIDsArray);

      const postDetailsArray = await this.#getPostDetails(userID, filteredPost);

      return postDetailsArray;
    } catch (error) {
      return error;
    }
  }

  async getPostBasedLike(userID) {
    try {
      const query = `
      SELECT 
      PostTags.tagID as currentTag,
      COUNT(PostTags.tagID) AS TotalLike,
      (SELECT 
      (count(*)*100) 
      FROM 
        PostLike 
        INNER JOIN 
          PostTags ON PostTags.postID = PostLike.postID 
        WHERE 
          PostTags.tagID = currentTag AND PostLike.userID = ?
      ) as TotalUserLike
      FROM
      PostLike
        INNER JOIN
          PostTags ON PostTags.postID = PostLike.postID
        INNER JOIN
          Tag ON PostTags.tagID = Tag.idTag
        GROUP BY currentTag
        ORDER BY  TotalUserLike DESC, TotalLike DESC
        LIMIT 10;`;

      const tagIDsResultSet = await select(query, [userID]);

      const tagIDsArray = tagIDsResultSet.map((element) => element.currentTag);

      const postIDsArray = await this.#getPostIDs(tagIDsArray);

      const filteredPost = await this.#filterPostForAll(postIDsArray);

      const postDetailsArray = await this.#getPostDetails(userID, filteredPost);

      return postDetailsArray;
    } catch (error) {
      return error;
    }
  }

  async #filterPostForAll(postIDsArray) {
    try {
      const query = `
      SELECT
      Post.idPost, Users.UserID, Users.Visibility
        FROM 
        abbankDB.Post 
        INNER JOIN 
          Users ON Users.UserID = Post.UserID 
        WHERE
          Post.idPost IN (?)
          AND 
          Users.Visibility = 0 
        ORDER BY Post.idPost DESC;`;

      const result = await select(query, [postIDsArray]);

      const postIDAndUserIDArray = result.map((element) => {
        const postIDAndUserID = {
          postID: element.idPost,
          userID: element.UserID,
        };
        return postIDAndUserID;
      });

      return postIDAndUserIDArray;
    } catch (error) {
      return error;
    }
  }

  async #filterPost(userID, postIDsArray) {
    try {
      const query = `
    SELECT 
      Post.idPost,
      Users.UserID,
      Users.Visibility,
      (SELECT 
      COUNT(*)
        FROM
        abbankDB.Follows
        WHERE
          (FollowerID = ?
          AND FollowingID = Users.UserID)
          OR (FollowerID = Users.UserID
          AND FollowingID = ?))
      AS Status
        FROM
        abbankDB.Post
        INNER JOIN
          Users ON Users.UserID = Post.UserID
        WHERE
          Post.idPost IN (?)
        HAVING Status >= Users.Visibility
        ORDER BY Post.idPost DESC;`;
      const result = await select(query, [userID, userID, postIDsArray]);

      const postIDAndUserIDArray = result.map((element) => {
        const postIDAndUserID = {
          postID: element.idPost,
          userID: element.UserID,
        };
        return postIDAndUserID;
      });

      return postIDAndUserIDArray;
    } catch (error) {
      return error;
    }
  }

  async getSingularPost(userID, postID) {
    try {
      const filteredPost = await this.#filterPost(userID, postID);

      const postDetailsArray = await this.#getPostDetails(userID, filteredPost);

      return postDetailsArray;
    } catch (error) {
      return error;
    }
  }

  async #getPostDetails(userID, filteredPost) {
    try {
      const extractDetailsPromise = await Promise.all(
        filteredPost.map(async (element) => {
          const uploader = element.userID;
          const upload = element.postID;

          try {
            const uploaderDetailQuery = `SELECT Username, ProfileIconLink FROM abbankDB.Users WHERE UserID = ?;`;
            const [uploaderDetail] = await select(uploaderDetailQuery, [
              uploader,
            ]);

            const uploadDetailQuery = `SELECT 
            PostLink,
            Title,
            (SELECT COUNT(*) FROM PostLike WHERE PostLike.postID = ? AND PostLike.userID = ?) AS didUserLike,
            (SELECT COUNT(*) FROM PostLike INNER JOIN Post ON PostLike.postID = Post.idPost WHERE Post.idPost = ?) AS likeCount,
            (SELECT COUNT(*) FROM PostShare INNER JOIN Post ON PostShare.postID = Post.idPost WHERE Post.idPost = ?) AS shareCount,
            (SELECT COUNT(*) FROM PostComment INNER JOIN Post ON PostComment.postID = Post.idPost WHERE Post.idPost = ?) AS commentCount
            FROM Post
            WHERE Post.idPost = ?;`;
            const [uploadDetail] = await select(uploadDetailQuery, [
              upload,
              userID,
              upload,
              upload,
              upload,
              upload,
            ]);

            const details = {
              postID: upload,
              uploadDetail: uploadDetail,
              uploaderDetail: uploaderDetail,
            };

            return details;
          } catch (error) {
            return error;
          }
        })
      );

      const postDetailsArray = extractDetailsPromise.filter(
        (details) => details !== null
      );

      return postDetailsArray;
    } catch (error) {
      return error;
    }
  }

  async #getTagIDs(tags) {
    try {
      const query = `SELECT idTag FROM abbankDB.Tag WHERE TagName in (?);`;
      const result = await select(query, [tags]);
      const idsArray = result.map((element) => element.idTag);
      return idsArray;
    } catch (error) {
      return error;
    }
  }

  async like(postID, userID) {
    try {
      const query = `Insert into PostLike(postID,userID) Values(?,?);`;
      await update(query, [postID, userID]);
      return "Like post operation successful";
    } catch (error) {
      return error;
    }
  }

  async unlike(postID, userID) {
    try {
      const query = `Delete from PostLike where postID = ? AND userID = ?;`;
      await update(query, [postID, userID]);
      return "Unlike post operation successful";
    } catch (error) {
      return error;
    }
  }

  async getFollowingPost(userID) {
    try {
      const follow = new FollowManager();

      const followingArray = await follow.getFollowings(userID);

      const query = `SELECT idPost FROM abbankDB.Post WHERE UserID IN (?);`;

      const followingsPostID = await select(query, [followingArray]);

      const followingsPostIDArray = followingsPostID.map((postID) => {
        return postID.idPost;
      });

      const filteredPost = await this.#filterPost(
        userID,
        followingsPostIDArray
      );

      const postDetailsArray = await this.#getPostDetails(userID, filteredPost);

      return postDetailsArray;
    } catch (error) {
      return error;
    }
  }

  async getProfilePost(viewerID, profileUserID) {
    try {
      const postIDsResultSet = await select(
        `SELECT Post.idPost FROM abbankDB.Users INNER JOIN Post ON Post.UserID = Users.UserID WHERE Users.UserID = ?;`,
        [profileUserID]
      );

      const postIDsArray = postIDsResultSet.map((element) => element.idPost);

      if (postIDsArray.length === 0) {
        throw new Error("User does not have any post");
      }

      if (viewerID != profileUserID) {
        const filteredPost = await this.#filterPost(viewerID, postIDsArray);

        const postDetailsArray = await this.#getPostDetails(
          viewerID,
          filteredPost
        );

        return postDetailsArray;
      } else {
        const filteringPost = await select(
          `SELECT 
        Post.idPost,
        Users.UserID
          FROM
          abbankDB.Post
          INNER JOIN
            Users ON Users.UserID = Post.UserID
          WHERE
            Post.idPost IN (?)
          ORDER BY Post.idPost DESC;`,
          [postIDsArray]
        );

        const postIDAndUserIDArray = filteringPost.map((element) => {
          const postIDAndUserID = {
            postID: element.idPost,
            userID: element.UserID,
          };
          return postIDAndUserID;
        });
        const postDetailsArray = await this.#getPostDetails(
          viewerID,
          postIDAndUserIDArray
        );

        return postDetailsArray;
      }
    } catch (error) {
      return error;
    }
  }

  async comment(postID, userID, comment) {
    try {
      const query = `INSERT INTO abbankDB.PostComment (PostID, Commenter, Comment) VALUES (?, ?, ?);`;
      await update(query, [postID, userID, comment]);
      return "Comment operation successful";
    } catch (error) {
      return error;
    }
  }

  async getComments(postID) {
    try {
      const query = `
      SELECT 
      PostComment.Comment,
      Users.Username,
      Users.DisplayName,
      Users.ProfileIconLink
        FROM
        abbankDB.PostComment
        INNER JOIN
          Users ON Users.UserID = PostComment.Commenter
        Where 
          PostID = ?;`;
      const result = await select(query, [postID]);

      return result;
    } catch (error) {
      return error;
    }
  }

  async hasShared(userID, postID) {
    try {
      const query = `SELECT count(*) FROM abbankDB.PostShare where postID = ? AND userID = ?;`;
      const [result] = await select(query, [postID, userID]);
      return result["count(*)"] == 1;
    } catch (error) {
      return error;
    }
  }

  async share(userID, postID) {
    try {
      const query = `INSERT INTO PostShare(postID,userID) Values(?,?);`;
      await update(query, [postID, userID]);
      return "Record share action operation successful";
    } catch (error) {
      return error;
    }
  }
}

module.exports = PostManager;
