const { select } = require("./DB");
const { update } = require("./DB");

class GroupManager {
  async getGroupList(userID) {
    const result = await select(`SELECT 
        Collective.GroupID,Collective.GroupName, Collective.GroupIconLink
    FROM
        GroupMembers
            INNER JOIN
        Collective ON Collective.GroupID = GroupMembers.GroupID
    WHERE
        GroupMembers.UserID = ${userID};`);
    return result;
  }

  updateGroupIcon(groupID, groupIcon) {
    const query = `UPDATE Collective SET GroupIconLink = "${groupIcon}" WHERE GroupID = ${groupID};`;
    update(query);
  }

  updateGroupName(groupID, groupName) {
    const query = `UPDATE Collective SET GroupName = "${groupName}" WHERE GroupID = ${groupID};`;
    update(query);
  }

  async createGroup(createrUserID, groupName, groupIcon, groupMembers) {
    const createGroup = `INSERT INTO Collective (OwnerID,GroupName, GroupIconLink) VALUES (${createrUserID},${groupName}, ${groupIcon});`;
    update(createGroup);

    const groupID = await this.#getLatestGroupID(createrUserID)[0]["GroupID"];

    addMember(groupID, groupMembers);
  }

  addMembers(groupID, groupMembers) {
    groupMembers.map((groupMember) => {
      addMember(groupID,groupMember);
    });
  }

  addMember(groupID,groupMember){
    const query = `INSERT INTO GroupMembers (GroupID, UserID) VALUES (${groupID}, ${groupMember});`;
    update(query);
  }

  removeMemeber(groupID, groupMember) {
    const query = `DELETE FROM GroupMembers WHERE (GroupID = ${groupID}) and (UserID = ${groupMember});`;
    update(query);
  }

  async #getLatestGroupID() {
    const groupID = await select(
      `SELECT GroupID FROM abbankDB.Collective WHERE OwnerID = 1 Order by GroupID DESC LIMIT 1;`
    );

    return groupID;
  }

  async getGroupMembers(groupID) {
    const groupMembers = await select(`SELECT 
       Users.UserID, Users.Username, Users.DisplayName, Users.ProfileIconLink, Collective.OwnerID
    FROM
        abbankDB.GroupMembers
            INNER JOIN
        Users ON Users.UserID = GroupMembers.UserID
            INNER JOIN
        Collective ON Collective.GroupID = GroupMembers.GroupID
    WHERE
        GroupMembers.GroupID = ${groupID};`);

    return groupMembers;
  }

  transferOwnership(groupID, newOwnerID) {
    update(
      `UPDATE Collective SET OwnerID = ${newOwnerID} WHERE (GroupID = ${groupID});`
    );
  }
}

module.exports = GroupManager;
