const { select } = require("./DB");
const { update } = require("./DB");

class GroupMessage {
  async getMessage(userID, groupID, messageID) {
    try {
      const query = `SELECT GroupMessages.*, Users.DisplayName, Users.ProfileIconLink FROM GroupMessages
      INNER JOIN
        Users ON Users.UserID = GroupMessages.UserID
      LEFT JOIN
        ClearGroupMessage ON ClearGroupMessage.GroupID = ? AND ClearGroupMessage.UserID = ?
      WHERE
        GroupMessages.GroupID = ?
          AND MessageID > ?
          AND (ClearGroupMessage.Time IS NULL
          OR ClearGroupMessage.Time < GroupMessages.Time);`;
      const result = await select(query, [groupID, userID, groupID, messageID]);
      return result;
    } catch (error) {
      return error;
    }
  }
  async deleteMessage(messageID) {
    try {
      const query = `DELETE FROM GroupMessages WHERE MessageID = ?;`;
      await update(query, [messageID]);
      return "Delete message operation successful";
    } catch (error) {
      return error;
    }
  }
  async sendMessage(userID, groupID, message) {
    try {
      const query = `INSERT INTO abbankDB.GroupMessages (UserID, GroupID, Time, Message) VALUES (?, ?, now(), ?);`;
      await update(query, [userID, groupID, message]);
      return "Send message operation successful";
    } catch (error) {
      return error;
    }
  }

  async clearMessage(userID, groupID) {
    try {
      const hasUserClearBefore = await this.#hasClearedMessageBefore(
        userID,
        groupID
      );
      if (hasUserClearBefore) {
        const updateQuery = `UPDATE ClearGroupMessage SET Time = now() WHERE (UserID = ?) and (GroupID = ?);`;
        await update(updateQuery, [userID, groupID]);
      } else {
        const createQuery = `INSERT INTO ClearGroupMessage (UserID, GroupID, Time) VALUES (?, ?, now());`;
        await update(createQuery, [userID, groupID]);
      }
    } catch (error) {
      return error;
    }
  }
  async #hasClearedMessageBefore(userID, groupID) {
    try {
      const query = `SELECT count(*) FROM ClearGroupMessage WHERE UserID = ? AND GroupID = ?;`;
      const [result] = await select(query, [userID, groupID]);
      return result["count(*)"] == 1;
    } catch (error) {
      return error;
    }
  }
}

module.exports = GroupMessage;
