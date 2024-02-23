const {tableList} = require('../models/tables.js');

const getAllTables = async () => {
    return tableList;
}

const isTableNameTaken = async (name) => {
    if(tableList.find(table => table.name === name)) {
        return true;
    }
    return false;
}

const validateTable = async (id, password) => {
    const table = tableList.find(table => table.id === id);
    if (table && table.password === password) {
        return table; // Return the table if found and password matches
    } else {
        return null; // Return null if table not found or password doesn't match
    }
}

const addTable = async (table) => {
    const name = table.name;
    const max_players_num = table.max_players_num;

    if(await isTableNameTaken(name)) {
        return 2; //table name is taken 
    }
    else if (max_players_num > 4) {
        return 1; //max players number is too big
    }
    //Now we know its valid
    table.id = 7; //with mongoose will be automated
    table.players_num = 0;
    table.moneyAmountOnTable = 0;
    table.bigBlind = 10;
    table.smallBlind = 5;
    table.cardOnTable = [];
    tableList.push(table);
    return 0; //everything good
}

module.exports = {
    getAllTables, validateTable, addTable
  }