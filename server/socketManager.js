const socketIO = require("socket.io");
const Table = require('./models/tables.js');
const connectedUsers =require('./models/connectedUsers.js'); 
const allUsers = require('./models/users.js');
const {playersList, tablesList} = require("./localDB");
const { Player } = require("./gameMng/PokerPlayers.js");
const { set } = require("mongoose");

let io;



const waitForPlayerAction = (socket,currentPlayer, moneyToCall) => {
  return new Promise((resolve) => {
    if (currentPlayer.socket) {
      io.to(currentPlayer.socket).emit('yourTurn', moneyToCall);

      const onPlayerAction = (action) => {
        console.log(`Received action from ${currentPlayer.nickname}: ${action}`);
        resolve(action);
        socket.off('playerAction', onPlayerAction);
      };

      socket.on('playerAction', onPlayerAction);
    } else {
      resolve(null); // Handle the case where the player has no socket
    }
  });
};








// function that run 1 round of the game of players actions. (like before the flop, after the flop, after the turn, after the river)

async function runPlayersActions(socket,tableName) {
  let moneyToCall = 0;
  const table = tablesList.find(table => table.name === tableName);
  if(table == null) {
    return false;
  }

  table.startRound();
  //console.log("table is" , table);
  for (const currentPlayer of table.playersWithCards) {
    //if its the demo player, we want to skip him.

    if(currentPlayer.nickname === "demo") {
      continue;
    }
  
    console.log("current player is: ", currentPlayer.nickname);
    const playerAction = await waitForPlayerAction(socket,currentPlayer, moneyToCall);
    // Handle the player's action here
    console.log(`Player ${currentPlayer.nickname} took action: ${playerAction}`);
  }
}

// function waitForPlayerAction(socket, playerNickname, timeout) {
//   return new Promise((resolve, reject) => {
//     const onPlayerAction = (action, table, name, amount) => {
//       console.log(`Received action from ${name} during ${playerNickname}'s turn.`);
//       if (name === playerNickname) {
//         socket.off('playerAction', onPlayerAction);
//         resolve({ action, table, name, amount });
//       } else {
//         console.log(`Ignoring action from ${name} as it is not their turn.`);
//       }
//     };

//     socket.on('playerAction', onPlayerAction);

//     const timer = setTimeout(() => {
//       socket.off('playerAction', onPlayerAction);
//       reject(new Error('Timeout'));
//     }, timeout);

//     socket.on('playerAction', () => {
//       clearTimeout(timer);
//     });
//   });
// }


//Modify the playerAction function to handle actions properly
playerAction = async (action, table, name, amount) => {
  table = await Table.findOne({ name: table });

  // Implement action handling logic here based on the action
  // Example: if (action === 'raise') { ... }

  // Notify all players and spectators about the state of the game and render!
  for (const player of table.playersOnTable) {
    const user = await allUsers.findOne({ nickname: player.nickname });
    const connectedUser = await connectedUsers.findOne({ username: user.username });

    if (connectedUser) {
      io.to(connectedUser.socketId).emit('render');
    }
  }
};
  


async function controlRound(socket,tableName) {
  // get the table
  // get the players on the table
  // Shuffle the deck
  // Deal cards to the players 
  // Set up initial game state
  

  // Start the before the flop round
  runPlayersActions(socket,tableName);
  // start the flop round annd so...........................

  //run algo to decide who is the winner and give him the money.

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
    const newPlayer = new Player(nickname, moneyToEnterWith, tempConnectedUser.socketId);
    const local_table = tablesList.find(table => table.name === tableName);
    local_table.addPlayer(newPlayer);
    local_table.drawCardsToAllPlayers();
    //console.log(local_table);
    const cards = newPlayer.hand;
    io.to(newPlayer.socket).emit('getCards', cards);
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
    // wait 5 seconds for the players to see their cards
    setTimeout(controlRound, 5000, socket,tableName);
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
