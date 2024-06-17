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
    if (currentPlayer.socket) {
      //Notify the current player that it's their turn
      io.to(currentPlayer.socket).emit('yourTurn', table.moneyToCall);
      sendTurnToAllPlayers(table.playersWithCards, currentPlayer);
      try {
        // Await the player's action or timeout
        const playerAction = await new Promise((resolve, reject) => {
          const turnTimeout = setTimeout(() => {
            console.log('Player did not respond in time.- fold the player.');
            fold(tableName, currentPlayer.nickname); // Fold the player (or take other action as needed)
            console.log('players left',table.playersWithCards.length);
            // check if the round is over because there is only one player with cards,and he is the winner, he dont need to do any action.
            return resolve(null); // Resolve promise if only one player is left
          }, 20000); // 20 seconds
          
          currentPlayer.fullSocket.on('playerAction', (action,RaiseAmount) => {
            clearTimeout(turnTimeout); // Clear the timeout if response is received
            resolve({ action, RaiseAmount }); // Resolve with player action and raise amount as an object
          });
        });
        // if the playerAction is null, it means that the player didnt do any action, so we want to continue to the next player.
        // but if we have only one player with cards, we dont want to continue to the next player because he is the winner.
        if(playerAction == null) {
          if (table.playersWithCards.length === 1) return;
          continue;
        }
        let action = playerAction.action;
        let raiseAmount = playerAction.RaiseAmount;
        //Add logic to handle the player's action here
        switch (action) {
          case 'raise':
            raise(tableName, currentPlayer.nickname, raiseAmount); // Raise the player
            break;
          case 'fold':
            fold(tableName, currentPlayer.nickname); // Fold the player
            // check if the round is over because there is only one player with cards,and he is the winner, he dont need to do any action.
            if (table.playersWithCards.length === 1) return;
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

sendTurnToAllPlayers = async (players, current_player) => {
  /* Emit to all players, who's turn is it */
  for(const player of players) {
    io.to(player.socket).emit('WhosTurn', current_player.nickname);
  }
}

sendCardsToAllPlayers = async (table) => {
  // draw cards to all the players on the table
  // draw 2 cards to each player in the local DB.
  table.drawCardsToAllPlayers();
  for (const player of table.playersWithCards) {
    const cards = player.hand;
    io.to(player.socket).emit('getCards', cards);
    renderAll(table);
  }
  
};

renderAll = async (table) => {
  let size_of_arr = table.players.length * 3;
  let players_and_money = [];

  for (const player of table.players) {
    const has_cards = player.hand.length > 0;
    players_and_money.push(player.nickname, player.moneyOnTable, has_cards);
  }

  for (const player of table.players) {
         io.to(player.socket).emit('render', table.cardsOnTable,players_and_money, size_of_arr, table.moneyOnTable);
  }
  // now want to send the spectators the render event.
  for (const spectator of table.spectators) {
    io.to(spectator.socket).emit('render', table.cardsOnTable, players_and_money,size_of_arr, table.moneyOnTable);
    }
}

endRound = async (table) => {

  const winner = table.pickWinner();
  if(!winner) {
    console.log("no winner");
    return;
  }
  /* give the money to the winner */
  const winnerPlayer = table.playersWithCards.find(player => player.nickname === winner.nickname);
  winnerPlayer.addChips(Number(table.moneyOnTable));


  /* Send to all users the winner */
  for(const player of table.playersWithCards)
  {
    io.to(player.socket).emit('getWinner', winner.nickname);
  }

  /* Clearing all parameter in table locally */
  table.endRound();

  /* Send all players null (empty hand) */
  for(const player of table.playersWithCards)
  {
    /* Send them to trash the hand */
    io.to(player.socket).emit('getCards', null);
  }

  /* Render to make clear state in every player */
  renderAll(table);

  /* Wait 5 seconds to start the next round */
  await new Promise(resolve => setTimeout(resolve, 5000));
  
}
// function to check if the round is over because there is only one player with cards.
function checkIfPlayersFolded(table) {
   // Check if only one player is left with cards, meaning he is the winner
   if (table.playersWithCards.length === 1 || table.playersWithCards.length === 0) {
    endRound(table);
    return true;
}
return false;
}

async function controlRound(tableName) {
  // get the table
  const table = tablesList.find(table => table.name === tableName);
  // change all the players to players with cards to be able to play. 
  table.startRound();
  // Draw and send cards to all players
  sendCardsToAllPlayers(table);
  
  // start a round of players actions
  await runPlayersActions(tableName);
  table.moneyToCall = 0;
  if (checkIfPlayersFolded(table)) return;


  /* Flop */
  table.drawFlop();
  renderAll(table);
  await runPlayersActions(tableName);
  table.moneyToCall = 0;
  if (checkIfPlayersFolded(table)) return;


  /* Turn */
  table.drawTurn();
  renderAll(table);
  await runPlayersActions(tableName);
  table.moneyToCall = 0;
  if (checkIfPlayersFolded(table)) return;


  /* River */
  table.drawRiver();
  renderAll(table);  
  await runPlayersActions(tableName);
  table.moneyToCall = 0;
  if (checkIfPlayersFolded(table)) return;


  /* End of round */
  await endRound(table);
  
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
  while (local_table.players.length >= 2) { // && game isnt running
    //call control round function
     await controlRound(tableName);
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

standUp = async (tableName, nickname) => {
    // after stand up the username is a spectator so we need to change the database, add him to the spectators and remove him from the players on table.
    const table = await Table.findOne({ name: tableName });
    // remove the user from the players on table
    table.numOfPlayers -= 1;
    await table.save();

    /* Get the player out of the table list of players and make him spectator*/
    const local_table = tablesList.find(table => table.name === tableName);
    const playerToRemove = local_table.players.find(player => player.nickname === nickname);
    // add the moneyOnTable of the player to his money in mongo
    const user = await allUsers.findOne({ nickname});
    user.moneyAmount = Number(user.moneyAmount) + Number(playerToRemove.moneyOnTable);
    await user.save();

    local_table.players = local_table.players.filter(player => player.nickname !== nickname);
    local_table.playersWithCards = local_table.playersWithCards.filter(player => player.nickname !== nickname);
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
    // get the table
    const table = tablesList.find(table => table.name === tableName);
    if(table == null) {
      return false;
    }
    // get the player
    const player = table.playersWithCards.find(player => player.nickname === nickname);
    // get the player's chips
    player.removeChips(amout) ;
    table.moneyToCall = amout;
    table.moneyOnTable = Number(table.moneyOnTable) + Number(amout);
    return;
    //There is not enaugh chips to raise
};

fold = async (tableName, nickname) => {
    const table = tablesList.find(table => table.name === tableName);
    if(table == null) {
      return false;
    }
    const player = table.playersWithCards.find(player => player.nickname === nickname);
    if(player == null) {
      return false;
    }
    // remove the player from the players with cards
    table.playersWithCards = table.playersWithCards.filter(player => player.nickname !== nickname);
    player.clearHand();
};

check = async (tableName, username) => {
    // const table = tablesList.find(table => table.name === tableName);
    // if(table == null) {
    //   return false;
    // }
};

call = async (tableName, nickname) => {
    // get the table
    const table = tablesList.find(table => table.name === tableName);
    if(table == null) {
      return;
    }
    // get the player
    const player = table.playersWithCards.find(player => player.nickname === nickname);
    // get the player's chips
    if(player.removeChips(table.moneyToCall)) {
      table.moneyOnTable = Number(table.moneyToCall) + Number(table.moneyOnTable);
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
