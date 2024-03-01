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
        const table = await tableSchema.findOne({ "tableName": tableName, "password": password });
        // add user to table
        if(table) {
          const user = await userSchema.findOne({ "username": username });
            table.playersOnTable.push(user);
            await table.save();
        }
        return table; // If user is found, authentication is successful
      } catch (error) {
        console.error('Error validation table:', error);
        throw error;
      }
}

const addTable = async (table, userCreated) => {
    const name = table.name;
    const max_players_num = table.max_players_num;

    try{

    if(await isTableNameTaken(name)) {
        return 2; //table name is taken 
    }
    else if (max_players_num > 4) {
        return 1; //max players number is too big
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

const leaveTable = async (tableName,username) => {
    try {
        const table = await tableSchema.findOne({ "name": tableName });
        const user = await userSchema.findOne({ "username": username });
        table.playersOnTable.remove(user);
        await table.save();
        return 0 ;
      } catch (error) {
        console.error('Error leaving table:', error);
        throw error;
      }
}





module.exports = {
    getAllTables, validateTable, addTable, leaveTable
  }