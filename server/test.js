const { Player } = require("./gameMng/PokerPlayers.js");
const { ActiveTable } = require("./gameMng/PokerTable.js");
const { tablesList } = require("./localDB.js");

console.log("Test: Check Winner Functionality");

/* Make table and players */
const table = new ActiveTable(0, "test table", 4, 15, 5);
tablesList.push(table);
const player1 = new Player(1, "Player 1", 100);
const player2 = new Player(2, "Player 2", 150);
const player3 = new Player(3, "Player 3", 200);

/* Add the players to the table */
table.addPlayer(player1);
table.addPlayer(player2);
table.addPlayer(player3);
table.playersWithCards.push(player1);
table.playersWithCards.push(player2);
table.playersWithCards.push(player3);

/* Set predefined hands for players */
// Player 1: 6 of hearts, Ace of hearts
player1.hand = [
    { suit: "clubs", value: "8" },
    { suit: "clubs", value: "10" }
];

// Player 2: 6 of hearts, 7 of diamonds
player2.hand = [
    { suit: "clubs", value: "8" },
    { suit: "clubs", value: "8" }
];

// Player 3: 8 of clubs, 9 of clubs
player3.hand = [

    { suit: "clubs", value: "Ace" },
    { suit: "clubs", value: "3" }
];

/* Draw community cards to the table */
table.cardsOnTable = [
    { suit: "hearts", value: "10" },
    { suit: "hearts", value: "King" },
    { suit: "hearts", value: "Queen" },
    { suit: "diamonds", value: "8" },
    { suit: "clubs", value: "Jack" }
];

/* Print the hands and the community cards */
console.log("Player 1 hand: ", player1.hand);
console.log("Player 2 hand: ", player2.hand);
console.log("Player 3 hand: ", player3.hand);
console.log("Community cards: ", table.cardsOnTable);

/* Determine the winner */
console.log("Winner is: ", table.pickWinner());

console.log(" Clearing all hands: ");
table.endRound();

console.log("Player 1 hand: ", player1.hand);
console.log("Player 2 hand: ", player2.hand);
console.log("Player 3 hand: ", player3.hand);

console.log("Clearing Community cards: ");
console.log("Community cards: ", table.cardsOnTable);



