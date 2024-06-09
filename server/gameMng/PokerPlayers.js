const PokerTable = require("./PokerTable");
const User = require("../models/users.js");

class Player {
  constructor(nickname,socket ,socketId) {
    this.nickname = nickname;
    this.moneyOnTable = 0;
    this.hand = []; // The player's hand of cards
    this.socket = socketId; // So we can comunicate with this user
    this.fullSocket = socket;
  }

  // Method to add chips to the player's stack
  addChips(amount) {
    this.moneyOnTable += amount;
  }

  // Method to remove chips from the player's stack
  removeChips(amount) {
    if (this.moneyOnTable >= amount) {
      this.moneyOnTable -= amount;
      return true; // Chips removed successfully
    } else {
      return false; // Insufficient chips
    }
  }

  // Method to receive cards into the player's hand
  receiveCard(card) {
    this.hand.push(card);
  }

  // Method to clear the player's hand
  clearHand() {
    this.hand = [];
  }

  // Method to display the player's hand
  showHand() {
    console.log(`${this.name}'s hand: ${this.hand.map(card => card.toString()).join(', ')}`);
  }
}

module.exports = {
  Player
}