const Player = require("./gameMng/PokerPlayers.js");
const ActiveTable = require("./gameMng/PokerTable.js");


/* Local DB that stores all the players and all the active tables. */
const playersList = [];
const tablesList = [];


// Export the lists
module.exports = {
    playersList,
    tablesList
  };