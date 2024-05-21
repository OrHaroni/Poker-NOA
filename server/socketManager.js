const socketIO = require("socket.io");
const Table = require('./models/tables.js');
const connectedUsers =require('./models/connectedUsers.js'); 
const allUsers = require('./models/users.js');
const {playersList, tablesList} = require("./localDB");
const { Player } = require("./gameMng/PokerPlayers.js");
const { set } = require("mongoose");

let io;

// function that run 1 round of the game of players actions. (like before the flop, after the flop, after the turn, after the river)

async function runPlayersActions(tableName) {
  let moneyToCall = 0;
  const table = tablesList.find(table => table.name === tableName);
  if (table == null) {
    return false;
  }
  for (const currentPlayer of table.playersWithCards) {
    console.log("current player is: ", currentPlayer.nickname);
    if (currentPlayer.socket) {
      //Notify the current player that it's their turn
      io.to(currentPlayer.socket).emit('yourTurn', moneyToCall);
      try {
        // Await the player's action or timeout
        const playerAction = await new Promise((resolve, reject) => {
          const turnTimeout = setTimeout(() => {
            console.log('Player did not respond in time.- fold the player.');
            fold(tableName, currentPlayer.nickname); // Fold the player (or take other action as needed
            reject(new Error('timeout')); // Reject on timeout
          }, 10000); // 10 seconds
          
          currentPlayer.fullSocket.on('playerAction', (data) => {
            clearTimeout(turnTimeout); // Clear the timeout if response is received
            resolve(data); // Resolve with player action
          });
        });

        // Process the player's action
        console.log('Player action received:', playerAction);
        // Add logic to handle the player's action here

      } catch (err) {
        if (err.message === 'timeout') {
          // Handle the timeout scenario (e.g., skip turn, default action, etc.)
          console.log('Handling player timeout...');
        } else {
          // Handle other potential errors
          console.error('An error occurred:', err);
        }
      }
      
  }
}
}

sendCardsToAllPlayers = async (table) => {
  // draw cards to all the players on the table
  // draw 2 cards to each player in the local DB.
  table.drawCardsToAllPlayers();
  for (const player of table.playersWithCards) {
    const cards = player.hand;
    io.to(player.socket).emit('getCards', cards);
  }
  
};

async function controlRound(tableName) {
  console.log("Control Round!");
  // get the table
  const table = tablesList.find(table => table.name === tableName);
  // change all the players to players with cards to be able to play. 
  table.startRound();
  // Draw and send cards to all players
  sendCardsToAllPlayers(table);
  // start a round of players actions
  runPlayersActions(tableName);
  // draw flop
  // start a round of players actions
  // draw turn
  // start a round of players actions
  // draw river
  // start a round of players actions
  // run algo to decide who is the winner and give him the money.
}


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

joinTable = async (socket,tableName, username, nickname, moneyToEnterWith) => {
    /* Find the table in the DB */
    const table = await Table.findOne({ name: tableName });

    /* Get the connected user from the DB for its socket */
    const tempConnectedUser = await connectedUsers.findOne({ username: username });

    /* Add the Player into the local DB for this table */
    const newPlayer = new Player(nickname, moneyToEnterWith,socket, tempConnectedUser.socketId);
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
        //if (connectedUser.username !== username) {
           io.to(connectedUser.socketId).emit('render', local_table.cardsOnTable);
       // }
    }
    // now want to send the spectators the render event.

    for (const spectator of table.spectators) {
      const usernameToRender = await connectedUsers.findOne({ username: spectator });
      io.to(usernameToRender.socketId).emit('render', local_table.cardsOnTable);
      }
  }
  // check if there is two players now on the table and the game isnt running yet, if so, we want to start the game.
  // need to check if the game isnt running yet..
  if(table.playersOnTable.length === 2) { // && game isnt running
    //call control round function
    controlRound(tableName);
  }
};

leaveTable = async (tableName, username) => {
    const table = await Table.findOne({ name: tableName });

    /* Get the player out of all lists in local DB*/
    const local_table = tablesList.find(table => table.name === tableName);
    local_table.players = local_table.players.filter(player => player.nickname !== username);
    local_table.playersWithCards = local_table.playersWithCards.filter(player => player.nickname !== username);
    local_table.spectators = local_table.spectators.filter(player => player.nickname !== username);
    // Iterate over each player on the table , if its not the user that leave the table, send him the render event.
    for (const player of table.playersOnTable) {
      // assume nickname is unique !!!
        const user = await allUsers.findOne({ nickname: player.nickname });
        const connectedUser = await connectedUsers.findOne({ username: user.username });
        // Check if the user exists and is not the user that leave the table
        if (connectedUser.username !== username) {
           io.to(connectedUser.socketId).emit('render', local_table.cardsOnTable);
        }
    }
    // now want to send the spectators the render event.
    for (const player of table.spectators) {
      // assume nickname is unique !!!
        const user = await allUsers.findOne({ nickname: player });
        const connectedUser = await connectedUsers.findOne({ username: user.username });
        // Check if the user exists and is not the user that leave the table
        if (connectedUser.username !== username) {
          const local_table = tablesList.find(table => table.name === tableName);
           io.to(connectedUser.socketId).emit('render', local_table.cardsOnTable);
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

    /* Get the player out of the table list of players and make him spectator*/
    const local_table = tablesList.find(table => table.name === tableName);
    const playerToRemove = local_table.players.find(player => player.nickname === username);
    local_table.players = local_table.players.filter(player => player.nickname !== username);
    local_table.playersWithCards = local_table.playersWithCards.filter(player => player.nickname !== username);
    local_table.spectators.push(playerToRemove);

    // Iterate over each player on the table , if its not the user that leave the table, send him the render event.
    for (const player of table.playersOnTable) {
      // assume nickname is unique !!!
        const user = await allUsers.findOne({ nickname: player.nickname });
        const connectedUser = await connectedUsers.findOne({ username: user.username });
        // Check if the user exists and is not the user that leave the table
        if (connectedUser.username !== username) {
          const local_table = tablesList.find(table => table.name === tableName);
           io.to(connectedUser.socketId).emit('render', local_table.cardsOnTable);
        }
    }
    // now want to send the spectators the render event.
    for (const player of table.spectators) {
      // assume nickname is unique !!!
        const user = await allUsers.findOne({ nickname: player });
        if(user == null) {
          continue;
        }
        const connectedUser = await connectedUsers.findOne({ username: user.username });
        // Check if the user exists and is not the user that leave the table
        if (connectedUser.username !== username) {
          const local_table = tablesList.find(table => table.name === tableName);
           io.to(connectedUser.socketId).emit('render', local_table.cardsOnTable);
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
    /// addddddddddddddddddddddddddddddddddddddar we need to fix the fold function here !!!!
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
