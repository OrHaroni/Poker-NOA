const tableSchema = require('../models/tables.js')
const userSchema = require('../models/users.js')

// Function to retrieve all users
async function getAllTables() {
    try {
      const tables = await tableSchema.find({});
      return tables;
    } catch (error) {
      console.error('Error retrieving tables:', error);
      throw error;
    }
  }
  // get players on table based on the table name
  async function getPlayersOnTable(tableName) {
    try {
      const table = await tableSchema.findOne({ "name": tableName });
      return table.playersOnTable;
    } catch (error) {
      console.error('Error retrieving players on table:', error);
      throw error;
    }
  }


const isTableNameTaken = async (name) => {
    try {
        const table = await tableSchema.findOne({ "name": name });
        return (table !== null); // If user is found, email is taken
      } catch (error) {
        console.error('Error checking name availability:', error);
        throw error;
      }
}

const validateTable = async (tableName, password, username) => {
    try {
      // finding the table by the name and password, and adding the username to the spectators list 
      let table = await tableSchema.findOne({ "tableName": tableName, "password": password });
      if(table) {
        table.spectators.push(username);
        await table.save();
      }
      return table;
      } catch (error) {
        console.error('Error validation table:', error);
        throw error;
      }
}

const joinUserIntoTable = async (tableName, username, moneyToEnterWith) => {
  try {
    const table = await tableSchema.findOne({"name": tableName});//No need for password because already validated.

    if(table.playersOnTable.length === 5) {
      return 2; //table is full;
    }
    const user = await userSchema.findOne({"username": username });

    if(user) {
      if(user.moneyAmount < moneyToEnterWith) {
        return 1; //no enough money.
      }
      else {
        //Decrease the money for this user
        user.moneyAmount -= moneyToEnterWith;
        await user.save();

        //create minimal parameters user
        const minimalUser = {"nickname": user.nickname, "moneyAmount": user.moneyAmount};
        // remove the user from the spectators 
        table.spectators = table.spectators.filter(spectator => spectator !== username);
        table.playersOnTable.push(minimalUser);
        await table.save();
        return 0;//0 for no money problem.
      }
    }
  } catch(error){
        console.error('Error joining into table:', error);
        throw error;
  }

}

const addTable = async (table, userCreated) => {
    const name = table.name;

    try{

    if(await isTableNameTaken(name)) {
        return 2; //table name is taken 
    }

    //Now we know its valid
    table.players_num = 0;
    table.moneyAmountOnTable = 0;
    table.bigBlind = 10;
    table.smallBlind = 5;
    table.cardOnTable = [];
    table.playersOnTable = [];
    table.createdBy = userCreated;

    const newTable = new tableSchema(table);
    await newTable.save();
    } catch(error) {
        console.error('Error adding table in servies:', error);
        throw error;
    }
    return 0; //everything good
}

const leaveTable = async (tableName, nickname) => {
    try {
      
        // Update the table by pulling the player with the given nickname from the array
        await tableSchema.updateOne(
          { name: tableName },
          { $pull: { playersOnTable: { nickname: nickname } } }
        );

        return 0 ;
      } catch (error) {
        console.error('Error leaving table:', error);
        throw error;
      }
}





module.exports = {
    getAllTables, validateTable, addTable, leaveTable, joinUserIntoTable ,getPlayersOnTable
  }