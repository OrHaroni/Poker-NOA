const gameUtiles = require("./gameUtiles.js");

/* Creating a copy of a generic full deck */
const genericDeck = gameUtiles.GenericFullDeck;

class ActiveTable {
    constructor(name, big, small) {
    this.name = name;
    this.players = []; // Array to store players seated at the table
    this.spectators = []; // Array to store spectators of the game
    this.deck = [...genericDeck]; // Array to store the deck of cards
    this.cardsOnTable = []; // Array to store cards on the table
    this.moneyOnTable = 0;
    this.bigBlind = big;
    this.smallBlind = small;
    }
  
    // Method to add a player to the table
    addPlayer(player) {
      if (this.players.length < 5) {
        this.players.push(player);
        return true; // Player added successfully
      } else {
        return false; // Table is full
      }
    }
  
    // Method to remove a player from the table
    removePlayer(playerName) {
      const index = this.players.findIndex(player => player.name === playerName);
      if (index !== -1) {
        this.players.splice(index, 1);
        return true; // Player removed successfully
      } else {
        return false; // Player not found at the table
      }
    }
  
    // Method to draw cards to all players at the table
    drawCardsToAllPlayers() {
      // Assuming deck is an array of card objects
      this.players.forEach(player => {
        player.receiveCard(DrawCard(this.deck));
        player.receiveCard(DrawCard(this.deck));
      });
    }

    /* Clears hand of all players (at end of round) */
    clearHandToAllPlayers() {
        this.players.forEach(player => {
            player.clearHand();
            player.clearHand();
            });
    }
  
    // Method to clear ths cards on the table in the end of a round
    resetCardsTable() {
      this.cardsOnTable = [];
    }

     /* Reset the Deck to the generic one again */
    resetDeck() {
        this.deck = [...genericDeck];
    }

    /* Draws the flop 3 cards */
    drawFlop() {
        this.cardsOnTable.push(DrawCard(this.deck));
        this.cardsOnTable.push(DrawCard(this.deck));
        this.cardsOnTable.push(DrawCard(this.deck));
    }

    /* Draws the turn 1 card */
    drawTurn() {
        this.cardsOnTable.push(DrawCard(this.deck));
    }

    /* Draws the river 1 card */
    drawRiver() {
        this.cardsOnTable.push(DrawCard(this.deck));
    }

  } /* END OF CLASS ActiveTable */




/* Static function that draws a card */ 
function DrawCard(deck) {
    const randomIndex = Math.floor(Math.random() * deck.length);
    const cardToReturn = deck[randomIndex];
    // Filter out the selected card from the deck
    const updatedDeck = deck.filter(item => item.id !== cardToReturn.id);
    // Update the deck with the filtered array
    deck.length = 0; // Clear the existing deck
    Array.prototype.push.apply(deck, updatedDeck); // Re-add filtered cards to the deck

    return cardToReturn;
}
module.exports = {
    ActiveTable
}