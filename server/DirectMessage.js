const { select, update } = require("./DB");

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
      return error;
    }
  }
  async deleteMessage(messageID) {
    try {
      const query = `DELETE FROM DirectMessages WHERE MessageID = ?;
      `;
      await update(query, [messageID]);
      return "Delete message operation successful";
    } catch (error) {
      return error;
    }
  }
  async hasAbilityToSend(senderID, receiverID) {
    try {
      const user = new UserManager();
      let hasSenderBlock = await user.isUserBlocked(receiverID, senderID);
      if (!hasSenderBlock) {
        let hasReceiverBlock = await user.isUserBlocked(senderID, receiverID);
        if (!hasReceiverBlock) {
          let receiverDMLimit = await user.getDMLimit(receiverID);
          const query = `SELECT COUNT(*) FROM abbankDB.Follows WHERE FollowerID = ? AND FollowingID = ? OR FollowerID = ? AND FollowingID = ?;`;
          const [status] = (
            await select(query, [senderID, receiverID, receiverID, senderID])
          )["COUNT(*)"];
          if (status >= receiverDMLimit) {
            return true;
          }
        }
      }
      return false;
    } catch (error) {
      return error;
    }
  }

  async getDirectList(userID) {
    try {
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
          directList.push({
            userID: recipientID,
            profileIconLink: profileIcon.ProfileIconLink,
            displayName: displayName.DisplayName,
            username: username.Username,
          });
        } catch (error) {
          throw error;
        }
      });

      await Promise.all(directListPromises);

      return directList;
    } catch (error) {
      return error;
    }
  }

  async getMessage(senderID, recieverID, messageID) {
    try {
      const query = `
    SELECT DirectMessages.*, Users.Username FROM DirectMessages 
    INNER JOIN
        Users ON Users.UserID = DirectMessages.SenderID
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
    } catch (error) {
      return error;
    }
  }

  async clearMessage(senderID, recieverID) {
    try {
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
    } catch (error) {
      return error;
    }
  }

  async #hasClearedMessageBefore(senderID, recieverID) {
    try {
      const query = `SELECT count(*) FROM abbankDB.ClearDirectMessage WHERE SenderID = ? AND RecieverID = ?;`;
      const [result] = await select(query, [senderID, recieverID]);
      return result["count(*)"] == 1;
    } catch (error) {
      return error;
    }
  }
}

module.exports = DirectMessage;
