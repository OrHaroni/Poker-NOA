const socketIO = require("socket.io");
const Table = require('./models/tables.js');
const connectedUsers =require('./models/connectedUsers.js'); 
const allUsers = require('./models/users.js');
const {tablesList} = require("./localDB");
const { Player } = require("./gameMng/PokerPlayers.js");
const { set } = require("mongoose");
const { tab } = require("@testing-library/user-event/dist/tab.js");

let io;

// function that run 1 round of the game of players actions. (like before the flop, after the flop, after the turn, after the river)

async function runPlayersActions(tableName) {
  const table = tablesList.find(table => table.name === tableName);
  if (table == null) {
    return false;
  }
  for (const currentPlayer of table.playersWithCards) {
    console.log("current player is: ", currentPlayer.nickname);
    if (currentPlayer.socket) {
      //Notify the current player that it's their turn
      console.log('money to call is: ', table.moneyToCall); 
      io.to(currentPlayer.socket).emit('yourTurn', table.moneyToCall);
      try {
        // Await the player's action or timeout
        const playerAction = await new Promise((resolve, reject) => {
          const turnTimeout = setTimeout(() => {
            console.log('Player did not respond in time.- fold the player.');
            fold(tableName, currentPlayer.nickname); // Fold the player (or take other action as needed)
            reject(new Error('timeout')); // Reject on timeout
          }, 20000); // 20 seconds
          
          currentPlayer.fullSocket.on('playerAction', (action,RaiseAmount) => {
            clearTimeout(turnTimeout); // Clear the timeout if response is received
            resolve({ action, RaiseAmount }); // Resolve with player action and raise amount as an object
          });
        });
        let action = playerAction.action;
        let raiseAmount = playerAction.RaiseAmount;
        //Add logic to handle the player's action here
        switch (action) {
          case 'raise':
            raise(tableName, currentPlayer.nickname, raiseAmount); // Raise the player
            break;
          case 'fold':
            fold(tableName, currentPlayer.nickname); // Fold the player 
            break;
          case 'call':
            call(tableName, currentPlayer.nickname); // Call the player
            break;
          case 'check':
            check(tableName, currentPlayer.nickname); // Check the player
            break;
          default:
            // Handle invalid action
            console.error('Invalid player action:', playerAction);
            break;
        }

        

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

renderAll = async (table) => {
  let size_of_arr = table.players.length * 2;
  let players_and_money = [];

  for (const player of table.players) {
    players_and_money.push(player.nickname, player.moneyOnTable);
  }

  for (const player of table.players) {
         io.to(player.socket).emit('render', table.cardsOnTable,players_and_money, size_of_arr);
  }
  // now want to send the spectators the render event.
  for (const spectator of table.spectators) {
    io.to(spectator.socket).emit('render', table.cardsOnTable, players_and_money,size_of_arr);
    }
}

async function controlRound(tableName) {
  console.log("Control Round!");
  // get the table
  const table = tablesList.find(table => table.name === tableName);
  // change all the players to players with cards to be able to play. 
  table.startRound();
  // Draw and send cards to all players
  sendCardsToAllPlayers(table);
  // start a round of players actions
  await runPlayersActions(tableName);
  // draw flop
  table.drawFlop();
  renderAll(table);
  await runPlayersActions(tableName);
  table.drawTurn();
  renderAll(table);
  await runPlayersActions(tableName);
  table.drawRiver();
  renderAll(table);
  // run algo to decide who is the winner and give him the money.
  
  console.log("End of round!");
  // clear the table
  table.clearHandToAllPlayers();
  table.resetCardsTable();
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

joinScreenTable = async (socket,tableName, username, nickname) => {
  console.log("Join Screen Table!");
  /* Get the connected user from the DB for its socket */
  const tempConnectedUser = await connectedUsers.findOne({ username: username });
  const newPlayer = new Player(nickname, socket, tempConnectedUser.socketId);
  /* Add the Player into the local DB for this table */
  const local_table = tablesList.find(table => table.name === tableName);
  local_table.spectators.push(newPlayer);

  /* Creating an array to send via socket */
  let players = [];
  for (const player of local_table.players) {
    players.push(player.nickname);
  }
  io.to(tempConnectedUser.socketId).emit('getLocalTable', players);
};

joinTable = async (tableName, username, nickname, moneyToEnterWith) => {
    console.log("Join Table!");
    /* Find the table in the DB */
    const table = await Table.findOne({ name: tableName });


    /* Add one to the number of players on the table */
    table.numOfPlayers += 1;
    await table.save();

    /* Add the Player into the local DB for this table */
    const local_table = tablesList.find(table => table.name === tableName);
    /* find from spactators list the player that want to join the table */
    const playerToJoin = local_table.spectators.find(player => player.nickname === nickname);

    /* add him the money he entered with */
    playerToJoin.moneyOnTable = moneyToEnterWith;
    /* remove him from the spectators list */
    local_table.spectators = local_table.spectators.filter(player => player.nickname !== nickname);
    /* add him to the players on table list */
    local_table.players.push(playerToJoin);


    // if its the first player on the table, we dont want to send him the render event because he is the one that joined the table.
    if(local_table.players.length > 1 || local_table.spectators.length > 0) {
    // Iterate over each player on the table , if its not the user that joined the table, send him the render event.
      renderAll(local_table);
  }

  // check if there is two players now on the table and the game isnt running yet, if so, we want to start the game.
  // need to check if the game isnt running yet..
  if(local_table.players.length === 2) { // && game isnt running
    //call control round function
    controlRound(tableName);
  }
};

leaveTable = async (tableName, username) => {
    const table = await Table.findOne({ name: tableName });
    const local_table = tablesList.find(table => table.name === tableName);
    /* if the player in the local_table players minus one the number of players on the table */
    if(local_table.players.find(player => player.nickname === username)) {
      table.numOfPlayers -= 1;
      await table.save();
    }
    /* Get the player out of all lists in local DB*/
    local_table.players = local_table.players.filter(player => player.nickname !== username);
    local_table.playersWithCards = local_table.playersWithCards.filter(player => player.nickname !== username);
    local_table.spectators = local_table.spectators.filter(player => player.nickname !== username);
    // Iterate over each player on the table , if its not the user that leave the table, send him the render event.
    renderAll(local_table);
};

standUp = async (tableName, username) => {
    // after stand up the username is a spectator so we need to change the database, add him to the spectators and remove him from the players on table.
    const table = await Table.findOne({ name: tableName });
    // remove the user from the players on table
    table.numOfPlayers -= 1;
    await table.save();

    /* Get the player out of the table list of players and make him spectator*/
    const local_table = tablesList.find(table => table.name === tableName);
    const playerToRemove = local_table.players.find(player => player.nickname === username);
    local_table.players = local_table.players.filter(player => player.nickname !== username);
    local_table.playersWithCards = local_table.playersWithCards.filter(player => player.nickname !== username);
    local_table.spectators.push(playerToRemove);

    // Iterate over each player on the table , if its not the user that leave the table, send him the render event.
    renderAll(local_table);
};


         /*                       *
          *                       *
          *                       *
          * Game Functionalities  *
          *                       *
          *                       * 
          *                       */
raise = async (tableName, nickname,amout) => {
    console.log("Do raise!");
    // get the table
    const table = tablesList.find(table => table.name === tableName);
    if(table == null) {
      return false;
    }
    // get the player
    const player = table.playersWithCards.find(player => player.nickname === nickname);
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
      return;
    }
    //There is not enaugh chips to raise
    return; 
};

fold = async (tableName, nickname) => {
    console.log("Do fold!");
    const table = tablesList.find(table => table.name === tableName);
    if(table == null) {
      return false;
    }
    const player = table.playersWithCards.find(player => player.nickname === nickname);
    // remove the player from the players with cards
    table.playersWithCards = table.playersWithCards.filter(player => player.nickname !== nickname);
    player.clearHand();
};

check = async (tableName, username) => {
    console.log("Do check!");
    // const table = tablesList.find(table => table.name === tableName);
    // if(table == null) {
    //   return false;
    // }
};

call = async (tableName, nickname) => {
    console.log("Do call!");
    // get the table
    const table = tablesList.find(table => table.name === tableName);
    if(table == null) {
      return;
    }
    // get the player
    const player = table.playersWithCards.find(player => player.nickname === nickname);
    // get the player's chips
    if(player.removeChips(table.moneyToCall)) {
      return;
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
  joinScreenTable,
  joinTable,
  leaveTable,
  standUp,
  exit,
  close
};
