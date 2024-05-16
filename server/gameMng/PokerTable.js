const gameUtiles = require("./gameUtiles.js");

/* Creating a copy of a generic full deck */
const genericDeck = gameUtiles.GenericFullDeck;

class ActiveTable {
    constructor(id, name, maxPlayers, big, small) {
    this.id = id;
    this.name = name;
    this.maxPlayers = maxPlayers;
    this.players = []; // Array to store players seated at the table
    this.players = []; // Array to store spectators of the game
    this.deck = [...genericDeck]; // Array to store the deck of cards
    this.cardsOnTable = []; // Array to store cards on the table
    this.moneyOnTable = 0;
    this.bigBlind = big;
    this.smallBlind = small;
    }
  
    // Method to add a player to the table
    addPlayer(player) {
      if (this.players.length < this.maxPlayers) {
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
  
    // Method to deal cards to all players at the table
    dealCards(deck) {
      // Assuming deck is an array of card objects
      this.players.forEach(player => {
        player.receiveCard(deck.pop());
        player.receiveCard(deck.pop());
      });
    }
  
    // Method to deal community cards
    dealCommunityCards(deck, numCards) {
      for (let i = 0; i < numCards; i++) {
        this.communityCards.push(deck.pop());
      }
    }
  
    // Method to clear community cards
    clearCommunityCards() {
      this.communityCards = [];
    }
  }

module.exports = {
    ActiveTable
}