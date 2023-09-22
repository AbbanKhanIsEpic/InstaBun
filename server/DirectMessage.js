const { select } = require("./DB");
const { update } = require("./DB");

const UserManager = require("./UserManager");

class DirectMessage {
  async sendMessage(senderID, receiverID, message) {
    try {
      const query = `
        INSERT INTO abbankDB.DirectMessages (SenderID, RecieverID, Time, Message)
        VALUES (?, ?, NOW(), ?);`;

      await update(query, [senderID, receiverID, message]);
      return "Send message operation successful";
    } catch (error) {
      throw error;
    }
  }
  async deleteMessage(messageID) {
    try {
      const query = `DELETE FROM DirectMessages WHERE MessageID = ?;
      `;
      await update(query, [messageID]);
      return "Delete message operation successful";
    } catch (error) {
      throw error;
    }
  }
  async hasAbilityToSend(senderID, receiverID) {
    const user = new UserManager();
    let hasSenderBlock = await user.isUserBlocked(receiverID, senderID);
    if (!hasSenderBlock) {
      let hasReceiverBlock = await user.isUserBlocked(senderID, receiverID);
      if (!hasReceiverBlock) {
        let receiverDMLimit = await user.getDMLimit(receiverID);
        const query = `SELECT COUNT(*) FROM abbankDB.Follows WHERE FollowerID = ? AND FollowingID = ? OR FollowerID = ? AND FollowingID = ?;`;
        const status = (
          await select(query, [senderID, receiverID, receiverID, senderID])
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

    const query = `
    SELECT distinct RecieverID FROM DirectMessages WHERE SenderID = ? 
    UNION 
    SELECT distinct SenderID FROM DirectMessages WHERE RecieverID = ?;`;
    const dmList = await select(query, [userID, userID]);

    const directList = [];

    const directListPromises = dmList.map(async (interaction) => {
      const recipientID = interaction["RecieverID"];
      try {
        const [profileIcon, displayName, username] = await Promise.all([
          user.getUserProfileIconLink(recipientID),
          user.getDisplayName(recipientID),
          user.getUsername(recipientID),
        ]);
        return {
          userID: recipientID,
          ProfileIconLink: profileIcon,
          displayName: displayName,
          username: username,
        };
      } catch (error) {
        throw error;
      }
    });

    await Promise.all(directListPromises);

    return directList.filter((entry) => entry !== null);
  }

  async getMessage(senderID, recieverID, messageID) {
    const query = `
    SELECT DirectMessages.* FROM DirectMessages 
    LEFT JOIN
      ClearDirectMessage ON ClearDirectMessage.SenderID = ? AND ClearDirectMessage.RecieverID = ?
    WHERE
    (DirectMessages.SenderID = ?
        AND DirectMessages.RecieverID = ?
        OR DirectMessages.SenderID = ?
        AND DirectMessages.RecieverID = ?)
        AND DirectMessages.MessageID > ?
        AND (ClearDirectMessage.Time IS NULL OR ClearDirectMessage.Time < DirectMessages.Time);`;

    const messages = await select(query, [
      senderID,
      recieverID,
      senderID,
      recieverID,
      recieverID,
      senderID,
      messageID,
    ]);

    return messages;
  }

  async clearMessage(senderID, recieverID) {
    const hasUserClearBefore = await this.#hasClearedMessageBefore(
      senderID,
      recieverID
    );
    if (hasUserClearBefore) {
      const updateQuery = `UPDATE ClearDirectMessage SET Time = now() WHERE (SenderID = ?) and (RecieverID = ?);`;
      update(updateQuery, [senderID, recieverID]);
    } else {
      const createQuery = `INSERT INTO ClearDirectMessage (SenderID, RecieverID, Time) VALUES (?,?,now());`;
      update(createQuery, [senderID, recieverID]);
    }
  }

  async #hasClearedMessageBefore(senderID, recieverID) {
    try {
      const query = `SELECT count(*) FROM abbankDB.ClearDirectMessage WHERE SenderID = ? AND RecieverID = ?;`;
      const result =
        (await select(query, [senderID, recieverID]))[0]["count(*)"] == 1;
      return result;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = DirectMessage;
