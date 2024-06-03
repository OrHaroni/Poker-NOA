const gameUtiles = require("./gameUtiles.js");

/* Creating a copy of a generic full deck */
const genericDeck = gameUtiles.GenericFullDeck;

class ActiveTable {
    constructor(name, big, small) {
    this.name = name;
    this.players = []; // Array to store players seated at the table
    this.playersWithCards = []; // Array to store players with cards
    this.spectators = []; // Array to store spectators of the game
    this.deck = [...genericDeck]; // Array to store the deck of cards
    this.cardsOnTable = []; // Array to store cards on the table
    this.moneyOnTable = 0;
    this.moneyToCall = 0;
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
    // Method to remove a player from the table
    removePlayerWithCards(playerName) {
      const index = this.removePlayerWithCards.findIndex(player => player.name === playerName);
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
      this.playersWithCards.forEach(player => {
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
    startRound() {
      this.playersWithCards = [...this.players];
    }
    // Method to pick the winner of the round
pickWinner() {
    const hands = this.playersWithCards.map(player => {
        const handRank = this.evaluateHand(player.hand, this.cardsOnTable);
        return { player, handRank };
    });
    // Sort hands by rank and high cards
    hands.sort((a, b) => {
        if (a.handRank.rank !== b.handRank.rank) {
            return b.handRank.rank - a.handRank.rank; // Higher rank first
        }
        for (let i = 0; i < a.handRank.highCards.length; i++) {
            if (a.handRank.highCards[i] !== b.handRank.highCards[i]) {
                return b.handRank.highCards[i] - a.handRank.highCards[i]; // Higher high card first
            }
        }
        return 0; // It's a tie
    });
  
    // The first player in the sorted list is the winner
    return hands[0].player;
  }
    // Methods to compare hands
    compareHands(handRank1, handRank2) {
        if (handRank1.rank > handRank2.rank) return true;
        if (handRank1.rank < handRank2.rank) return false;
  
        // If ranks are the same, compare the high cards
        for (let i = 0; i < handRank1.highCards.length; i++) {
            if (handRank1.highCards[i] > handRank2.highCards[i]) return true;
            if (handRank1.highCards[i] < handRank2.highCards[i]) return false;
        }
  
        // If all high cards are the same, it's a tie
        return false;
    }
  
    // Method to evaluate the hand and return its rank and high cards
    evaluateHand(hand, cardsOnTable) {
      const allCards = [...hand, ...cardsOnTable];
  
      const values = allCards.map(card => this.cardValue(card.value)).sort((a, b) => b - a);
      const suits = allCards.map(card => card.suit);
  
      const isFlush = suits.some((suit, _, arr) => arr.filter(s => s === suit).length >= 5);
      const isStraight = this.checkStraight(values);
      const counts = values.reduce((acc, value) => { acc[value] = (acc[value] || 0) + 1; return acc; }, {});
      const pairs = Object.values(counts).filter(count => count === 2).length;
      const triples = Object.values(counts).filter(count => count === 3).length;
      const quads = Object.values(counts).filter(count => count === 4).length;
  
      if (isFlush && isStraight && values[0] === 14) return { rank: 10, highCards: values }; // Royal Flush
      if (isFlush && isStraight) return { rank: 9, highCards: values }; // Straight Flush
      if (quads) return { rank: 8, highCards: values }; // Four of a Kind
      if (triples && pairs) return { rank: 7, highCards: values }; // Full House
      if (isFlush) return { rank: 6, highCards: values }; // Flush
      if (isStraight) return { rank: 5, highCards: values }; // Straight
      if (triples) return { rank: 4, highCards: values }; // Three of a Kind
      if (pairs === 2) return { rank: 3, highCards: values }; // Two Pair
      if (pairs === 1) return { rank: 2, highCards: values }; // One Pair
      return { rank: 1, highCards: values }; // High Card
  }
  
  checkStraight(values) {
      let sortedValues = [...new Set(values)].sort((a, b) => b - a);
  
      for (let i = 0; i < sortedValues.length - 4; i++) {
          if (sortedValues[i] - sortedValues[i + 4] === 4) {
              return true;
          }
      }
  
      // Check for the special case of A-2-3-4-5 straight
      if (sortedValues.includes(14) && sortedValues.slice(-4).join('') === '5432') {
          return true;
      }
  
      return false;
  }
  
    // Helper method to convert card value to numerical equivalent
    cardValue(value) {
        if (value === 'Ace') return 14;
        if (value === 'King') return 13;
        if (value === 'Queen') return 12;
        if (value === 'Jack') return 11;
        return parseInt(value, 10);
    }

    endRound() {
        /* Clear hands to all the players */
        this.clearHandToAllPlayers();

        /* Clear the community cards */
        this.resetCardsTable();

        /* Resetting the deck */
        this.resetDeck();
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