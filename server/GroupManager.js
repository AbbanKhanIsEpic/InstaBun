const { select } = require("./DB");
const { update } = require("./DB");

class GroupManager {
  async getGroupList(userID) {
    const query = `
    SELECT Collective.OwnerID, Collective.GroupID,Collective.GroupName, Collective.GroupIconLink FROM GroupMembers
    INNER JOIN 
    Collective ON Collective.GroupID = GroupMembers.GroupID
    WHERE
        GroupMembers.UserID = ?;`;
    const result = await select(query, [userID]);
    return result;
  }

  updateGroupIcon(groupID, groupIcon) {
    try {
      const query = `UPDATE Collective SET GroupIconLink = ? WHERE GroupID = ?;`;
      update(query, [groupIcon, groupID]);
      return "Update the group's icon operation successful";
    } catch (error) {
      throw error;
    }
  }

  updateGroupName(groupID, groupName) {
    try {
      const query = `UPDATE Collective SET GroupName = ? WHERE GroupID = ?;`;
      update(query, [groupName, groupID]);
      return "Update the group's name operation successful";
    } catch (error) {
      throw error;
    }
  }

  async createGroup(createrUserID, groupName, groupIcon, groupMembers) {
    try {
      const query = `INSERT INTO Collective (OwnerID,GroupName, GroupIconLink) VALUES (?,?, ?);`;
      await update(query, [createrUserID, groupName, groupIcon]);
      const groupID = await this.#getLatestGroupID(createrUserID);
      await this.#addMembers(groupID, groupMembers);
    } catch (error) {
      throw error;
    }
  }

  async #addMembers(groupID, groupMembers) {
    for (const groupMember of groupMembers) {
      await addMember(groupID, groupMember);
    }
  }

  async addMember(groupID, groupMember) {
    try {
      const query = `INSERT INTO GroupMembers (GroupID, UserID) VALUES (?, ?);`;
      await update(query, [groupID, groupMember]);
      return "Add member operation successful";
    } catch (error) {
      throw error;
    }
  }

  async removeMemeber(groupID, groupMember) {
    try {
      const query = `DELETE FROM GroupMembers WHERE (GroupID = ?) and (UserID = ?);`;
      await update(query, [groupID, groupMember]);
      return "Remove member operation successful";
    } catch (error) {
      throw error;
    }
  }

  async #getLatestGroupID(createrUserID) {
    try {
      const query = `SELECT GroupID FROM abbankDB.Collective WHERE OwnerID = ? Order by GroupID DESC LIMIT 1;`;
      const result = (await select(query, [createrUserID]))[0]["GroupID"];
      return result;
    } catch (error) {
      throw error;
    }
  }

  async getGroupMembers(groupID) {
    try {
      const query = `SELECT Users.UserID, Users.Username, Users.DisplayName, Users.ProfileIconLink FROM abbankDB.GroupMembers
    INNER JOIN
     Users ON Users.UserID = GroupMembers.UserID
    INNER JOIN
     Collective ON Collective.GroupID = GroupMembers.GroupID
    WHERE
     GroupMembers.GroupID = ?;`;
      const groupMembers = await select(query, [groupID]);
      return groupMembers;
    } catch (error) {
      throw error;
    }
  }

  async transferOwnership(groupID, newOwnerID) {
    try {
      const query = `UPDATE Collective SET OwnerID = ? WHERE (GroupID = ?);`;
      await update(query, [newOwnerID, groupID]);
      return "Transfer ownership operation successful";
    } catch (error) {
      throw error;
    }
  }
}

module.exports = GroupManager;
