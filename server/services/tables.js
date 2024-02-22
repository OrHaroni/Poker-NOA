const {tableList} = require('../models/tables.js');

const getAllTables = async () => {
    return tableList;
}

const validateTable = async (id, password) => {
    const table = tableList.find(table => table.id === id);
    if (table && table.password === password) {
        return table; // Return the user if found and password matches
    } else {
        return null; // Return null if user not found or password doesn't match
    }
}

module.exports = {
    getAllTables, validateTable
  }