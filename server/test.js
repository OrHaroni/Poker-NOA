const { Player } = require("./gameMng/PokerPlayers.js");
const { ActiveTable } = require("./gameMng/PokerTable.js");


console.log("This is a file to test data structures in this server");

/*Make table and players */
const table = new ActiveTable(0, "test table", 4, 15, 5);
const player1 = new Player(1, "Player 1", 100);
const player2 = new Player(2, "Player 2", 150);
const player3 = new Player(3, "Player 3", 50);
const player4 = new Player(4, "Player 4", 560);

/*add the players to the table */
table.addPlayer(player1);
table.addPlayer(player2);
table.addPlayer(player3);
table.addPlayer(player4);

/* draw cards */
table.drawCardsToAllPlayers();

/* Draw the cards to the table */
table.drawFlop();
table.drawTurn();
table.drawRiver();

/*Do some prints */
console.log("This is the cards on table: ");
console.log(table.cardsOnTable);

console.log("Player 1 hand: ");
console.log(player1.hand);

console.log("Player 2 hand: ");
console.log(player2.hand);

console.log("Player 3 hand: ");
console.log(player3.hand);

console.log("Player 4 hand: ");
console.log(player4.hand);

console.log("Now clear the hands and print again");
table.clearHandToAllPlayers();
console.log("Player 1 hand: ");
console.log(player1.hand);
console.log("Player 2 hand: ");
console.log(player2.hand);
console.log("Player 3 hand: ");
console.log(player3.hand);
console.log("Player 4 hand: ");
console.log(player4.hand);

console.log("Now reset the cards on the table and print it: ");
table.resetCardsTable();
console.log("This is the cards on table: ");
console.log(table.cardsOnTable);

console.log("This is deck before reset");
console.log(table.deck);
table.resetDeck();
console.log("This is deck after reset");
console.log(table.deck);