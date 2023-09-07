const { select } = require("./DB");
const { update } = require("./DB");

class GroupMessage {
  async getMessage(userID, groupID, messageID) {
    const message = await select(`SELECT 
    GroupMessages.*,
    Users.DisplayName,
    Users.ProfileIconLink
FROM
    GroupMessages
        INNER JOIN
    Users ON Users.UserID = GroupMessages.UserID
        LEFT JOIN
    ClearGroupMessage ON ClearGroupMessage.GroupID = ${groupID}
        AND ClearGroupMessage.UserID = ${userID}
WHERE
    GroupMessages.GroupID = ${groupID}
        AND MessageID > ${messageID}
        AND (ClearGroupMessage.Time IS NULL
        OR ClearGroupMessage.Time < GroupMessages.Time);`);
    return message;
  }
  deleteMessage(messageID) {
    update(`DELETE FROM GroupMessages WHERE MessageID = ${messageID};
    `);
  }
  sendMessage(senderID, groupID, message) {
    update(
      `INSERT INTO abbankDB.GroupMessages (UserID, GroupID, Time, Message) VALUES (${senderID}, ${groupID}, now(), "${message}");`
    );
  }
}

module.exports = GroupMessage;
