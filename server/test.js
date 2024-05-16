const { Player } = require("./gameMng/PokerPlayers.js");
const { ActiveTable } = require("./gameMng/PokerTable.js");
const {raise,fold,call,check} = require("./socketManager.js");

console.log("This is a file to test data structures in this server");

/*Make table and players */
const table = new ActiveTable(0, "test table", 4, 15, 5);
tablesList.push(table);
const player1 = new Player(1, "Player 1", 100);
const player2 = new Player(2, "Player 2", 150);
const player3 = new Player(3, "Player 3", 50);
const player4 = new Player(4, "Player 4", 560);

/*add the players to the table */
table.addPlayer(player1);
table.addPlayer(player2);
table.addPlayer(player3);
table.addPlayer(player4);
table.playersWithCards.push(player1);
table.playersWithCards.push(player2);
table.playersWithCards.push(player3);
table.playersWithCards.push(player4);
/* draw cards */
table.drawCardsToAllPlayers();

/* Draw the cards to the table */
table.drawFlop();
table.drawTurn();
table.drawRiver();

/*Do some prints */

//test call, raise, fold and check
console.log("Test call, raise, fold and check");
console.log("Player 1 chips: " + player1.moneyOnTable);
console.log("Player 2 chips: " + player2.moneyOnTable);
console.log("Player 3 chips: " + player3.moneyOnTable);
console.log("Player 4 chips: " + player4.moneyOnTable);
//test call
console.log("Player 1 call");
table.moneyToCall = 10;
call("test table", "Player 1");
console.log("Player 1 chips: " + player1.moneyOnTable);
 //test raise
console.log("Player 2 raise");
raise("test table", "Player 2", 20);
console.log("Player 2 chips: " + player2.moneyOnTable);
console.log("now the min call is: " + table.moneyToCall);