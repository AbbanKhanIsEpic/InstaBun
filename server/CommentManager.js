const { select, update } = require("./DB");

class CommentManager {
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

  async like(commentID, userID) {
    try {
      await unDisLike(commentID, userID);
      const query = `Insert into CommentLike(commentID,userID) Values(?,?)`;
      update(query, [commentID, userID]);
      return "Like comment operation successful";
    } catch (error) {
      return error;
    }
  }

  async dislike(commentID, userID) {
    try {
      await unLike(commentID, userID);
      const query = `Insert into CommentDislike(commentID,userID) Values(?,?)`;
      update(query, [commentID, userID]);
      return "Like comment operation successful";
    } catch (error) {
      return error;
    }
  }

  async unLike(commentID, userID) {
    try {
      const query = `DELETE FROM CommentLike WHERE commentID = ? AND userID = ?`;
      update(query, [commentID, userID]);
      return "Remove like operation successful";
    } catch (error) {
      return error;
    }
  }

  async unDisLike(commentID, userID) {
    try {
      const query = `DELETE FROM CommentDislike WHERE commentID = ? AND userID = ?`;
      update(query, [commentID, userID]);
      return "Remove dislike operation successful";
    } catch (error) {
      return error;
    }
  }
}

module.exports = CommentManager;
