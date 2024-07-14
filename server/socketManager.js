const socketIO = require("socket.io");
const Table = require('./models/tables.js');
const connectedUsers = require('./models/connectedUsers.js');
const allUsers = require('./models/users.js');
const { tablesList } = require("./localDB");
const { Player } = require("./gameMng/PokerPlayers.js");

/* A variable that holds the instance of the socket Input Output */
let io;
/* A counter to count number of bots for suffix nickname */
let curr_bot_name = 0;

const BOT_DEFAULT_MONEY = 1000;
const NUM_PLAYERS_TO_START_GAME = 2;

// function that run 1 round of the game of players actions. (like before the flop, after the flop, after the turn, after the river)
async function runPlayersActions(tableName) {
  const table = tablesList.find(table => table.name === tableName);
  if (table == null) {
    return false;
  }
  // index for the current player
  let currentPlayerIndex = 0;
  // index for the last player to act init to the last player in the list.
  let lastPlayerToActIndex = table.playersWithCards.length - 1;
  let lastPlayerToActNickname = table.playersWithCards[lastPlayerToActIndex].nickname;
  for (let i = 0; i < table.playersWithCards.length; i++) {
    table.playersWithCards[i].RoundMoney = 0;
  }
  while (true) {
    // print the playerswithcards array with the nicknames of the players and the order of the players.
    const currentPlayer = table.playersWithCards[currentPlayerIndex];
    /* Saving the next player nickname to act , the array of playersWithCards may change because of fold! (and so the Indices ) */
    /*  Move to the next player in a round robin way. */
    let nextPlayerIndexToAct = (currentPlayerIndex + 1) % table.playersWithCards.length;
    let nextPlayerNickname = table.playersWithCards[nextPlayerIndexToAct].nickname;
    if (currentPlayer.isAi) {
      let a = await currentPlayer.Ai_action(table);
      let actionAndMoney = a.split(' ');
      let action = actionAndMoney[0];
      let money = actionAndMoney[1];
      if(action === 'raise') {
        let minPlayerMoney = Math.min(...table.playersWithCards.map(player => player.moneyOnTable));
        if(money > minPlayerMoney) {
          action = 'raise';
          money = minPlayerMoney;
        }
      }
      /* Making logical descisions for the bot */
      if (action === 'fold' && table.moneyToCall === 0) {
        action = 'check';
      }
      if (action === 'raise' && money < table.moneyToCall) {
        action = 'call';
        money = table.moneyToCall;
      }
      if (action === 'raise' && money === table.moneyToCall) {
        action = 'call';
      }
      if(action === 'raise' && money > currentPlayer.moneyOnTable) {
        action = 'call';
        money = currentPlayer.moneyToCall;
      }
      if(action === 'call' && money > currentPlayer.moneyOnTable) {
        action = 'fold';
      }
      if(action === 'call' && money < table.moneyToCall) {
        action = 'fold';
      }
      switch (action) {
        case 'raise':
          raise(tableName, currentPlayer.nickname, money); // Raise the player
          // Update the last player to act index because the player raised and we want to give the all the other players the option to act.
          // The last player to act is the player before the current player.
          lastPlayerToActIndex = (currentPlayerIndex - 1 + table.playersWithCards.length) % table.playersWithCards.length;
          /* Saving the last player to act nickname , the array of players with cards may change because of fold ! (and so the the indices) */
          lastPlayerToActNickname = table.playersWithCards[lastPlayerToActIndex].nickname;
          // print the next player to act :
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
      // if the player that just acted (currectPlayerIndex) is the last player to act, break the loop.
      if (currentPlayer.nickname === lastPlayerToActNickname) {
        break;
      }
      // Move to the next player in a round robin way.
      currentPlayerIndex = table.playersWithCards.findIndex(player => player.nickname === nextPlayerNickname);
    }
    else {
      if (currentPlayer.socket) {
        /* Clear all listeners from the player */
        currentPlayer.fullSocket.removeAllListeners('playerAction');
        //Notify the current player that it's their turn
        io.to(currentPlayer.socket).emit('yourTurn', table.moneyToCall - currentPlayer.RoundMoney);
        sendTurnToAllPlayers(table.playersWithCards,table.spectators, currentPlayer);
        renderAll(table);
        try {
          // Await the player's action or timeout
          const playerAction = await new Promise((resolve, reject) => {
            const turnTimeout = setTimeout(() => {
              fold(tableName, currentPlayer.nickname); // Fold the player (or take other action as needed)
              // check if the round is over because there is only one player with cards,and he is the winner, he dont need to do any action.
              return resolve(null); // Resolve promise if only one player is left
            }, 20000); // 20 seconds

            currentPlayer.fullSocket.on('playerAction', (action, RaiseAmount) => {
              clearTimeout(turnTimeout); // Clear the timeout if response is received
              resolve({ action, RaiseAmount }); // Resolve with player action and raise amount as an object
            });
          });
          // if the playerAction is null, it means that the player didnt do any action, so we want to continue to the next player.
          // but if we have only one player with cards, we dont want to continue to the next player because he is the winner.
          if (playerAction == null) {
            /*Call the standUp fucntion to remove him from the playersWithCards and add to to spectators*/
            standUp(tableName, currentPlayer.nickname);
            /* Use socket.io to send to the player he got removed from the table */
            io.to(currentPlayer.socket).emit('gotRemovedFromTable');
            if (table.playersWithCards.length === 1) return;
            continue;
          }
          let action = playerAction.action;
          let raiseAmount = playerAction.RaiseAmount;
          //Add logic to handle the player's action here
          switch (action) {
            case 'raise':
              raise(tableName, currentPlayer.nickname, raiseAmount); // Raise the player
              // Update the last player to act index because the player raised and we want to give the all the other players the option to act.
              // The last player to act is the player before the current player.
              lastPlayerToActIndex = (currentPlayerIndex - 1 + table.playersWithCards.length) % table.playersWithCards.length;
              lastPlayerToActNickname = table.playersWithCards[lastPlayerToActIndex].nickname;
              break;
            case 'fold':
              // before folding this currect player, save the next player to act nickname.
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
          // if the player that just acted (currectPlayerIndex) is the last player to act, break the loop.
          if (currentPlayer.nickname === lastPlayerToActNickname) {
            break;
          }
          currentPlayerIndex = table.playersWithCards.findIndex(player => player.nickname === nextPlayerNickname);
        } catch (err) {
          if (err.message === 'timeout') {
            // Handle the timeout scenario (e.g., skip turn, default action, etc.)
          } else {
            // Handle other potential errors
            console.error('An error occurred:', err);
          }
        }

      }
    }
  }
}

/* Sending to all players, who is playing now (For timer purposes) */
sendTurnToAllPlayers = async (players,spectators, current_player) => {
  /* Emit to all players, who's turn is it */
  for (const player of players) {
    if (player.isAi) continue;
    io.to(player.socket).emit('WhosTurn', current_player.nickname);
  }
  /* Emit to all spectators, who's turn is it */
  for(const spectator of spectators) {
    io.to(spectator.socket).emit('WhosTurn', current_player.nickname);
}
}

// draw cards to all the players on the local table
sendCardsToAllPlayers = async (table) => {
  // draw 2 cards to each player in the local DB.
  table.drawCardsToAllPlayers();
  for (const player of table.playersWithCards) {
    const cards = player.hand;
    io.to(player.socket).emit('getCards', cards);
    renderAll(table);
  }

};

/* Sending render to all player and spectators, sending data like nicknames, money, state of hand and more */
renderAll = async (table) => {
  let size_of_arr = table.players.length * 4;
  let players_and_money = [];

  for (const player of table.players) {
    const has_cards = player.hand.length > 0;
    players_and_money.push(player.nickname, player.moneyOnTable, has_cards, player.isAi);
  }

  for (const player of table.players) {
    if (player.isAi) continue;
    io.to(player.socket).emit('render', table.cardsOnTable, players_and_money, size_of_arr, table.moneyOnTable);
  }
  // now want to send the spectators the render event.
  for (const spectator of table.spectators) {
    io.to(spectator.socket).emit('render', table.cardsOnTable, players_and_money, size_of_arr, table.moneyOnTable);
  }
}

/* API that ends the round, clear hands, send winner and reset the table's state */
endRound = async (table) => {

  const winner = table.pickWinner();
  if (!winner) {
    return;
  }
  /* give the money to the winner */
  const winnerPlayer = table.playersWithCards.find(player => player.nickname === winner.nickname);
  winnerPlayer.addChips(Number(table.moneyOnTable));
  
  /* Send all the cards to all players and spectators to show them for 5 seconds */
  sendCardsInEndOfGame(table);
  
  /* Sending the winner to all players and spectators */
  sendWinner(table, winner);

  updateStatisticsEndGame(table, winner);

  /* Wait 3 seconds for showing cards */
  await new Promise(resolve => setTimeout(resolve, 3000));

  /* Send all players null (empty hand) */
  for (const player of table.players) {
    /* Send them to trash the hand */
    io.to(player.socket).emit('getCards', null);
  }

  /* Clearing all parameter in table locally */
  table.endRound();

  const tableDB= await Table.findOne({ name: table.name });
  /* After Clearing the players with 0 money in table.endRound check if rest of the players are bots if so - delete them. */
  if (table.players.every(player => player.isAi)) {
    // Remove all bot players
    table.players = [];
    table.playersWithCards = [];
    tableDB.numOfPlayers = 0;
    await tableDB.save();
  }  

  /* Render to make clear state in every player */
  renderAll(table);

  /* Wait 3 seconds to start the next round */
  await new Promise(resolve => setTimeout(resolve, 3000));
  table.tableIsRunning = false;

}

// function to check if the round is over because there is only one player with cards.
async function checkIfPlayersFolded(table) {
  // Check if only one player is left with cards, meaning he is the winner
  if (table.playersWithCards.length === 1 || table.playersWithCards.length === 0) {
    await endRound(table);
    return true;
  }
  return false;
}

/* Control's a whole game, starting round, sending cards, manages and runs flop, turn and river */
async function controlRound(tableName) {
  // get the table
  const table = tablesList.find(table => table.name === tableName);
  // change all the players to players with cards to be able to play. 
  table.tableIsRunning = true;
  table.startRound();

  // Draw and send cards to all players
  sendCardsToAllPlayers(table);

  updateStatisticsBeginGame(table);

  // start a round of players actions
  await runPlayersActions(tableName);
  renderAll(table);
  table.moneyToCall = 0;
  if (await checkIfPlayersFolded(table)) return;

  /* Flop */
  table.drawFlop();
  renderAll(table);
  await runPlayersActions(tableName);
  renderAll(table);
  table.moneyToCall = 0;
  if (await checkIfPlayersFolded(table)) return;


  /* Turn */
  table.drawTurn();
  renderAll(table);
  await runPlayersActions(tableName);
  renderAll(table);
  table.moneyToCall = 0;
  if (await checkIfPlayersFolded(table)) return;


  /* River */
  table.drawRiver();
  renderAll(table);
  await runPlayersActions(tableName);
  renderAll(table);

  table.moneyToCall = 0;
  if (await checkIfPlayersFolded(table)) return;


  /* End of round */
  await endRound(table);

}

/* Initialize the socket io instance */
function initialize(server) {
  io = socketIO(server);
  // Setup socket.io event handlers, if needed
}

/* a getter for the io instance for the server to use */
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
/* Adding new connected user */
userConnected = async (username, socket) => {
  const temp = new connectedUsers({ username: username, socketId: socket.id });
  await temp.save();
};

/* while exsiting, removing from connected users */
exit = async (username) => {
  // remove user from connected users 
  await connectedUsers.deleteOne({
    username
  });
};

/* Deleting  all connected users when closing the server */
close = async () => {
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

/* Joining after being a spectator, you will enter the next round */
joinScreenTable = async (socket, tableName, username, nickname) => {
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

/* Join a state where you are only spectator and cant play */
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
  if (local_table.players.length > 1 || local_table.spectators.length > 0) {
    // Iterate over each player on the table , if its not the user that joined the table, send him the render event.
    renderAll(local_table);
  }

  // check if there is two players now on the table and the game isnt running yet, if so, we want to start the game.
  // need to check if the game isnt running yet..
  while (local_table.players.length >= 2 && !local_table.tableIsRunning) { // && game isnt running
    await controlRound(tableName);
  }
};

/* Adding new bot to the game */
addBot = async (tableName) => {
  //   /* Find the table in the DB */
  const table = await Table.findOne({ name: tableName });

  const username = "Gemini" + curr_bot_name;
  curr_bot_name += 1;
  /* Add one to the number of players on the table */
  table.numOfPlayers += 1;
  await table.save();

  /* Add the bot into the local DB for this table */
  const local_table = tablesList.find(table => table.name === tableName);

  const playerToJoin = new Player(username, null, null);
  playerToJoin.moneyOnTable = BOT_DEFAULT_MONEY;
  playerToJoin.isAi = true;

  /* add him to the players on table list */
  local_table.players.push(playerToJoin);

  renderAll(local_table);
  // if its the first player on the table, we dont want to send him the render event because he is the one that joined the table.

  // check if there is two players now on the table and the game isnt running yet, if so, we want to start the game.
  // need to check if the game isnt running yet..
  while (local_table.players.length >= NUM_PLAYERS_TO_START_GAME && !local_table.tableIsRunning) { // && game isnt running
    await controlRound(tableName);
  }
};

/* When leaving a table, needs to update DB's and render all other players */
leaveTable = async (tableName, username) => {
  const table = await Table.findOne({ name: tableName });
  const local_table = tablesList.find(table => table.name === tableName);
  /* if the player in the local_table players minus one the number of players on the table */
  if (local_table.players.find(player => player.nickname === username)) {
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

/* Becoming a spectator from a player */
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
  const user = await allUsers.findOne({ nickname });
  user.moneyAmount = Number(user.moneyAmount) + Number(playerToRemove.moneyOnTable);
  await user.save();

  local_table.players = local_table.players.filter(player => player.nickname !== nickname);
  local_table.playersWithCards = local_table.playersWithCards.filter(player => player.nickname !== nickname);
  local_table.spectators.push(playerToRemove);

    /* If the last players are bots so delete them also */
    if (local_table.players.every(player => player.isAi)) {
      // Remove all bot players
      local_table.players = [];
      local_table.playersWithCards = [];
      table.numOfPlayers = 0;
      await table.save();
    }

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

/* Doing raise action */
raise = async (tableName, nickname, amout) => {
  // get the table
  const table = tablesList.find(table => table.name === tableName);
  if (table == null) {
    return false;
  }
  // get the player
  const player = table.playersWithCards.find(player => player.nickname === nickname);

  /* Removing players chips*/
  player.removeChips(amout);

  /* Updating the number of money on this round for this player */
  player.RoundMoney += Number(amout);

  /* updating table, both all money and the money to call */
  table.moneyToCall = player.RoundMoney
  table.moneyOnTable = Number(table.moneyOnTable) + Number(amout);
  return;
};

/* Doing fold action */
fold = async (tableName, nickname) => {
  const table = tablesList.find(table => table.name === tableName);
  if (table == null) {
    return false;
  }
  const player = table.playersWithCards.find(player => player.nickname === nickname);
  if (player == null) {
    return false;
  }
  // remove the player from the players with cards
  table.playersWithCards = table.playersWithCards.filter(player => player.nickname !== nickname);
  player.clearHand();
};

/* Doing check action */
check = async (tableName, username) => {
  /* Do nothing on check */
};

/* Doing call action */
call = async (tableName, nickname) => {
  // get the table
  const table = tablesList.find(table => table.name === tableName);
  if (table == null) {
    return;
  }
  // get the player
  const player = table.playersWithCards.find(player => player.nickname === nickname);
  
  // get the player's chips
  sub = Number(table.moneyToCall) - Number(player.RoundMoney);
  if (player.removeChips(sub)) {
    table.moneyOnTable += sub
    player.RoundMoney += sub;
    return;
  }
};

/* Send the winner to all players at the end of a round */
function sendWinner(table, winner) {
/* Send to all users the winner */
for(const player of table.players)
  {
    io.to(player.socket).emit('getWinner', winner.nickname);
  }

/* Send to all users the winner */
for(const spectator of table.spectators)
  {
    io.to(spectator.socket).emit('getWinner', winner.nickname);
  }
};

/* Send all the hands in the end of a round to show them */
function sendCardsInEndOfGame(table) {
  /* null for each players so that if he folded, wont send cards */
  let allPlayersCards= [];

  for(const player of table.players) {
    /* Checking if the player has cards in the end of the game */
    if(player.hand != []) {
      allPlayersCards.push(player.hand)
    }
    else {
      allPlayersCards.push([]);
    }
  }

  for(const player of table.players)
    {
      io.to(player.socket).emit('getAllPlayersCards', allPlayersCards);
    }

  for(const spectator of table.spectators)
    {
      io.to(spectator.socket).emit('getAllPlayersCards', allPlayersCards);
    }
}

/* Update all players statistics at the end of every game */
async function updateStatisticsEndGame(table, winner) {
    const player = table.playersWithCards.find(player => player.nickname == winner.nickname);
    if(!player.isAi) {
      const nickname = winner.nickname;
      const user = await allUsers.findOne({ nickname });
      /* Add 1 win */
      user.numberOfWins += 1;

      /* Add money to the all winnings */
      user.allTimeMoneyWon += table.moneyOnTable

      /* Check if its the highest win, and if do, change it */
      if (user.highestMoneyWon < table.moneyOnTable) {
        user.highestMoneyWon = table.moneyOnTable;
      }

      user.save();
    }
}

/* Update all players statistics at the beggining of every game */
async function updateStatisticsBeginGame(table) {
  for(const player of table.playersWithCards) {
    if(!player.isAi) {
      const nickname = player.nickname;
      const user = await allUsers.findOne({ nickname });
      /* Add 1 game that he played */
      user.gamesPlayed += 1;
      user.save();
    }
  }
}

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
  close,
  addBot
};
