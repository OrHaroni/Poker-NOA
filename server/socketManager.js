const socketIO = require("socket.io");
const Table = require('./models/tables.js');
const connectedUsers =require('./models/connectedUsers.js'); 
const allUsers = require('./models/users.js');

let ioInstance;

function initialize(server) {
  ioInstance = socketIO(server);
  // Setup socket.io event handlers, if needed
}

function getIO() {
  if (!ioInstance) {
    throw new Error("Socket.io has not been initialized.");
  }
  return ioInstance;
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


         /*                       *
          *                       *
          *                       *
          * Table Functionalities *
          *                       *
          *                       * 
          *                       */

joinTable = async (tableName, username) => {
    const table = await Table.findOne({ name: tableName });
    // if its the first player on the table, we dont want to send him the render event because he is the one that joined the table.
    if(table.playersOnTable.length > 1) {
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
};


         /*                       *
          *                       *
          *                       *
          * Game Functionalities  *
          *                       *
          *                       * 
          *                       */
TableRaise = async () => {
    console.log("Do Raise!");
  };

module.exports = {
  initialize,
  getIO,
  TableRaise,
  userConnected,
  joinTable,
  leaveTable
};
