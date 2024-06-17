const PokerTable = require("./PokerTable");
const User = require("../models/users.js");
const {ai_play} = require("../ai.js");

class Player {
  constructor(nickname,socket ,socketId) {
    this.nickname = nickname;
    this.moneyOnTable = 0;
    this.hand = []; // The player's hand of cards
    this.socket = socketId; // So we can comunicate with this user
    this.fullSocket = socket;
    this.isAi = false;
  }

  // Method to add chips to the player's stack
  addChips(amount) {
    this.moneyOnTable = Number(this.moneyOnTable) + Number(amount);
  }
  //this player is AI
  setAi(){
    this.isAi = true;
  }
  async Ai_action(table) {
    if (this.isAi) {
      return await ai_play(this.hand, table.cardsOnTable, this.moneyOnTable, table.moneyOnTable, table.moneyToCall);
    }
  }

  // Method to remove chips from the player's stack
  removeChips(amount) {
    if (Number(this.moneyOnTable) >= Number(amount)) {
      this.moneyOnTable =Number(this.moneyOnTable) - Number(amount);
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