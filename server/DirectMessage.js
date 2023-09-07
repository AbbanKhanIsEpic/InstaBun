const { select } = require("./DB");
const { update } = require("./DB");

const UserManager = require("./UserManager");

class DirectMessage {
  sendMessage(senderID, receiverID, message) {
    update(
      `INSERT INTO abbankDB.DirectMessages (SenderID, RecieverID, Time, Message) VALUES (${senderID}, ${receiverID}, now(), "${message}");`
    );
  }
  deleteMessage(messageID) {
    update(`DELETE FROM DirectMessages WHERE MessageID = ${messageID};
    `);
  }
  async hasAbilityToSend(senderID, receiverID) {
    const user = new UserManager();
    let result = await user.isUserBlocked(receiverID, senderID);
    if (result[0]["count(*)"] == 0) {
      result = await user.isUserBlocked(senderID, receiverID);
      if (result[0]["count(*)"] == 0) {
        let receiverDMLimit = await user.getDMLimit(receiverID);
        console.log(receiverDMLimit);
        receiverDMLimit = receiverDMLimit[0]["DMLimit"];
        const status = (
          await select(`SELECT 
            COUNT(*)
        FROM
            abbankDB.Follows
        WHERE
            FollowerID = ${senderID} AND FollowingID = ${receiverID}
                OR FollowerID = ${receiverID} AND FollowingID = ${senderID};`)
        )[0]["COUNT(*)"];
        if (status >= receiverDMLimit) {
          return true;
        }
      }
    }
    return false;
  }

  async getDirectList(userID) {
    const user = new UserManager();
    const dm = await select(
      `SELECT distinct RecieverID
      FROM DirectMessages
      WHERE SenderID = ${userID}
      UNION
      SELECT distinct SenderID
      FROM DirectMessages
      WHERE RecieverID = ${userID}
      ;`
    );

    let directList = [];

    const directListPromises = dm.map(async (interaction) => {
      const userID = interaction["RecieverID"];
      const profileIcon = (await user.getUserProfileIconLink(userID))[0][
        "ProfileIconLink"
      ];
      const displayName = (await user.getDisplayName(userID))[0]["DisplayName"];
      const username = (await user.getUsername(userID))[0]["Username"];
      let listDetail = {
        userID: userID,
        ProfileIconLink: profileIcon,
        displayName: displayName,
        username: username,
      };
      directList.push(listDetail);
    });

    await Promise.all(directListPromises);

    console.log(directList);

    return directList;
  }

  async getMessage(senderID, recieverID, messageID) {
    const result = await select(
      `SELECT 
      DirectMessages.*
  FROM
      DirectMessages
          LEFT JOIN
      ClearDirectMessage ON ClearDirectMessage.SenderID = ${senderID}
          AND ClearDirectMessage.RecieverID = ${recieverID}
  WHERE
      (DirectMessages.SenderID = ${senderID}
          AND DirectMessages.RecieverID = ${recieverID}
          OR DirectMessages.SenderID = ${recieverID}
          AND DirectMessages.RecieverID = ${senderID})
          AND DirectMessages.MessageID > ${messageID}
          AND (ClearDirectMessage.Time IS NULL OR ClearDirectMessage.Time < DirectMessages.Time);;`
    );

    return result;
  }
  async clearMessage(senderID, recieverID) {
    const hasUserClearBefore = await select(
      `SELECT count(*) FROM abbankDB.ClearDirectMessage WHERE SenderID = ${senderID} AND RecieverID = ${recieverID};`
    );
    if (hasUserClearBefore[0]["count(*)"] == 0) {
      update(
        `INSERT INTO ClearDirectMessage (SenderID, RecieverID, Time) VALUES (${senderID}, ${recieverID}, now());`
      );
    } else {
      update(
        `UPDATE ClearDirectMessage SET Time = now() WHERE (SenderID = ${senderID}) and (RecieverID = ${recieverID});`
      );
    }
  }
}

module.exports = DirectMessage;
