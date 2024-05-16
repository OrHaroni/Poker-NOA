const socketIO = require("socket.io");
const Table = require('./models/tables.js');
const connectedUsers =require('./models/connectedUsers.js'); 
const allUsers = require('./models/users.js');
const {playersList, tablesList} = require("./localDB");
const { Player } = require("./gameMng/PokerPlayers.js");

let io;

function initialize(server) {
  io = socketIO(server);
  // Setup socket.io event handlers, if needed
}

function getIO() {
  if (!io) {
    throw new Error("Socket.io has not been initialized.");
  }
  return io;
}

         /*                       *
          *                       *
          *                       *
          * User Functionalities  *
          *                       *
          *                       * 
          *                       */
userConnected = async (username, socket) => {
    const temp = new connectedUsers({ username: username, socketId: socket.id }); 
    await temp.save(); 
};

exit = async (username) => {
    // remove user from connected users 
    await connectedUsers.deleteOne({ username
    });
};

close = async() => {
    // Disconnect users and clean up resources here 
    //delete all the connected users 
    await connectedUsers.deleteMany({}).exec(); 
};


         /*                       *
          *                       *
          *                       *
          * Table Functionalities *
          *                       *
          *                       * 
          *                       */

joinTable = async (tableName, username, nickname, moneyToEnterWith) => {
    /* Find the table in the DB */
    const table = await Table.findOne({ name: tableName });

    /* Add the Player into the local DB for this table */
    const newPlayer = new Player(nickname, moneyToEnterWith);
    console.log("Player to add:");
    console.log(newPlayer);
    const local_table = tablesList.find(table => table.name === tableName);
    local_table.addPlayer(newPlayer);
    // if its the first player on the table, we dont want to send him the render event because he is the one that joined the table.
    if(table.playersOnTable.length > 1 || table.spectators.length > 0) {
    // Iterate over each player on the table , if its not the user that joined the table, send him the render event.
    for (const player of table.playersOnTable) {
      // assume nickname is unique !!!
        const user = await allUsers.findOne({ nickname: player.nickname });
        const connectedUser = await connectedUsers.findOne({ username: user.username });
        // Check if the user exists and is not the user that joined the table
        if (connectedUser.username !== username) {
           io.to(connectedUser.socketId).emit('render');
        }
    }
    // now want to send the spectators the render event.

    for (const spectator of table.spectators) {
      const usernameToRender = await connectedUsers.findOne({ username: spectator });
      console.log("usernameToRender: ", usernameToRender, "socketId: ", usernameToRender.socketId);
      io.to(usernameToRender.socketId).emit('render');
      }
  }
};

leaveTable = async (tableName, username) => {
    const table = await Table.findOne({ name: tableName });
    // Iterate over each player on the table , if its not the user that leave the table, send him the render event.
    for (const player of table.playersOnTable) {
      // assume nickname is unique !!!
        const user = await allUsers.findOne({ nickname: player.nickname });
        const connectedUser = await connectedUsers.findOne({ username: user.username });
        // Check if the user exists and is not the user that leave the table
        if (connectedUser.username !== username) {
           io.to(connectedUser.socketId).emit('render');
        }
    }
    // now want to send the spectators the render event.
    for (const player of table.spectators) {
      // assume nickname is unique !!!
        const user = await allUsers.findOne({ nickname: player });
        const connectedUser = await connectedUsers.findOne({ username: user.username });
        // Check if the user exists and is not the user that leave the table
        if (connectedUser.username !== username) {
           io.to(connectedUser.socketId).emit('render');
        }
    }
};

standUp = async (tableName, username) => {
    // after stand up the username is a spectator so we need to change the database, add him to the spectators and remove him from the players on table.
    const table = await Table.findOne({ name: tableName });
    // remove the user from the players on table
    table.playersOnTable = table.playersOnTable.filter(player => player.nickname !== username);
    // add the user to the spectators
    table.spectators.push(username);
    await table.save();
    // Iterate over each player on the table , if its not the user that leave the table, send him the render event.
    for (const player of table.playersOnTable) {
      // assume nickname is unique !!!
        const user = await allUsers.findOne({ nickname: player.nickname });
        const connectedUser = await connectedUsers.findOne({ username: user.username });
        // Check if the user exists and is not the user that leave the table
        if (connectedUser.username !== username) {
           io.to(connectedUser.socketId).emit('render');
        }
    }
    // now want to send the spectators the render event.
    for (const player of table.spectators) {
      // assume nickname is unique !!!
        const user = await allUsers.findOne({ nickname: player });
        const connectedUser = await connectedUsers.findOne({ username: user.username });
        // Check if the user exists and is not the user that leave the table
        if (connectedUser.username !== username) {
           io.to(connectedUser.socketId).emit('render');
        }
    }
};


         /*                       *
          *                       *
          *                       *
          * Game Functionalities  *
          *                       *
          *                       * 
          *                       */
raise = async (tableName, username,amout) => {
    console.log("Do raise!");
    // get the table
    const table = tablesList.find(table => table.name === tableName);
    if(table == null) {
      return false;
    }
    // get the player
    const player = table.playersWithCards.find(player => player.nickname === username);
    // get the player's chips
    if(player.removeChips(amout)) {
      //There is enaugh chips to raise
        //check the min amount to call
        if(table.moneyToCall > amout) {
          //The player does not have enaugh chips to call
          return false;
        }
        //cheange the min amount to call
        table.moneyToCall = amout;
      return true;
    }
    //There is not enaugh chips to raise
    return false; 
};

fold = async (tableName, username) => {
    console.log("Do fold!");
    const table = tablesList.find(table => table.name === tableName);
    if(table == null) {
      return false;
    }
    const player = table.PlayerWithCards.find(player => player.nickname === username)
    // remove the player from the players with cards
    table.playersWithCards = table.playersWithCards.filter(player => player.nickname !== username);
    player.clearHand();
};

check = async (tableName, username) => {
    console.log("Do check!");
    const table = tablesList.find(table => table.name === tableName);
    if(table == null) {
      return false;
    }
};

call = async (tableName, username) => {
    console.log("Do call!");
    // get the table
    const table = tablesList.find(table => table.name === tableName);
    if(table == null) {
      return false;
    }
    // get the player
    const player = table.playersWithCards.find(player => player.nickname === username);
    // get the player's chips
    if(player.removeChips(table.moneyToCall)) {
      return true;
    }
};

module.exports = {
  initialize,
  getIO,
  raise,
  fold,
  call,
  check,
  userConnected,
  joinTable,
  leaveTable,
  standUp,
  exit,
  close
};
