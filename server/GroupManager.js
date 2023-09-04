const { select } = require("./DB");
const { update } = require("./DB");

class GroupManager {
    async getGroupList(userID){
        const result = await select(`SELECT 
        Collective.GroupName, Collective.GroupIconLink
    FROM
        GroupMembers
            INNER JOIN
        Collective ON Collective.GroupID = GroupMembers.GroupID
    WHERE
        GroupMembers.UserID = ${userID};`)
        return result;
    }

    updateGroupIcon(groupID,groupIcon){
        const query = `UPDATE Collective SET GroupIconLink = "${groupIcon}" WHERE GroupID = ${groupID};`;
        update(query);
    }

    updateGroupName(groupID,groupName){
        const query = `UPDATE Collective SET GroupName = "${groupName}" WHERE GroupID = ${groupID};`;
        update(query);
    }

    createGroup(createrUserID,groupName,groupIcon,groupMembers){
        const createGroup = `INSERT INTO Collective (OwnerID,GroupName, GroupIconLink) VALUES (${createrUserID},${groupName}, ${groupIcon});`
    }

    addMember(){

    }

    removeMemeber(){

    }


}

module.exports = GroupManager;