/**
 * This file is for constants and function that the game handler needs
 */
const tableSchema = require('../models/tables.js')

const GenericFullDeck = [
        { id: 1, suit: 'Clubs', value: '10' },
        { id: 2, suit: 'Diamonds', value: '10' },
        { id: 3, suit: 'Hearts', value: '10' },
        { id: 4, suit: 'Spades', value: '10' },
        { id: 5, suit: 'Clubs', value: '2' },
        { id: 6, suit: 'Diamonds', value: '2' },
        { id: 7, suit: 'Hearts', value: '2' },
        { id: 8, suit: 'Spades', value: '2' },
        { id: 9, suit: 'Clubs', value: '3' },
        { id: 10, suit: 'Diamonds', value: '3' },
        { id: 11, suit: 'Hearts', value: '3' },
        { id: 12, suit: 'Spades', value: '3' },
        { id: 13, suit: 'Clubs', value: '4' },
        { id: 14, suit: 'Diamonds', value: '4' },
        { id: 15, suit: 'Hearts', value: '4' },
        { id: 16, suit: 'Spades', value: '4' },
        { id: 17, suit: 'Clubs', value: '5' },
        { id: 18, suit: 'Diamonds', value: '5' },
        { id: 19, suit: 'Hearts', value: '5' },
        { id: 20, suit: 'Spades', value: '5' },
        { id: 21, suit: 'Clubs', value: '6' },
        { id: 22, suit: 'Diamonds', value: '6' },
        { id: 23, suit: 'Hearts', value: '6' },
        { id: 24, suit: 'Spades', value: '6' },
        { id: 25, suit: 'Clubs', value: '7' },
        { id: 26, suit: 'Diamonds', value: '7' },
        { id: 27, suit: 'Hearts', value: '7' },
        { id: 28, suit: 'Spades', value: '7' },
        { id: 29, suit: 'Clubs', value: '8' },
        { id: 30, suit: 'Diamonds', value: '8' },
        { id: 31, suit: 'Hearts', value: '8' },
        { id: 32, suit: 'Spades', value: '8' },
        { id: 33, suit: 'Clubs', value: '9' },
        { id: 34, suit: 'Diamonds', value: '9' },
        { id: 35, suit: 'Hearts', value: '9' },
        { id: 36, suit: 'Spades', value: '9' },
        { id: 37, suit: 'Clubs', value: 'Ace' },
        { id: 38, suit: 'Diamonds', value: 'Ace' },
        { id: 39, suit: 'Hearts', value: 'Ace' },
        { id: 40, suit: 'Spades', value: 'Ace' },
        { id: 41, suit: 'Clubs', value: 'King' },
        { id: 42, suit: 'Diamonds', value: 'King' },
        { id: 43, suit: 'Hearts', value: 'King' },
        { id: 44, suit: 'Spades', value: 'King' },
        { id: 45, suit: 'Clubs', value: 'Queen' },
        { id: 46, suit: 'Diamonds', value: 'Queen' },
        { id: 47, suit: 'Hearts', value: 'Queen' },
        { id: 48, suit: 'Spades', value: 'Queen' },
        { id: 49, suit: 'Clubs', value: 'Jack' },
        { id: 50, suit: 'Diamonds', value: 'Jack' },
        { id: 51, suit: 'Hearts', value: 'Jack' },
        { id: 52, suit: 'Spades', value: 'Jack' }
    ];

async function updateCardsInTable(table) {


    try {
        const updatedTable = await tableSchema.findOneAndUpdate(
            { name: table.name }, // Filter to find the document by its name
            { $set: { cardOnTable: [] } }, // Update the cardOnTable field
            { new: true } // Return the updated document
        );
        return updatedTable;
    } catch (error) {
        console.error('Error updating table:', error);
        throw error; // Rethrow the error to handle it elsewhere if needed
    }
}

/** Draw Functions **/

/* Function that draws a card */ 
async function DrawCard(deck) {
    const randomIndex = Math.floor(Math.random() * deck.length);
    const cardToReturn = deck[randomIndex];
    // Filter out the selected card from the deck
    const updatedDeck = deck.filter(item => item.id !== cardToReturn.id);
    // Update the deck with the filtered array
    deck.length = 0; // Clear the existing deck
    Array.prototype.push.apply(deck, updatedDeck); // Re-add filtered cards to the deck

    return cardToReturn;
}

/* Function that draws 3 cards for flop (and 1 burns) */
async function DrawFlop(table, deck) {
    //One draw for nothing (burn)
    await DrawCard(deck);

    //Three draws for the actual flop
    const firstCard = await DrawCard(deck);
    /* Need to update the db! */
    table.cardOnTable.push(firstCard);
    await updateCardsInTable(table);

    const secondCard = await DrawCard(deck);
    /* Need to update the db! */
    table.cardOnTable.push(secondCard);
    await updateCardsInTable(table);

    const thirdCard = await DrawCard(deck);
    /* Need to update the db! */
    table.cardOnTable.push(thirdCard);
    await updateCardsInTable(table);

    return [firstCard, secondCard, thirdCard];
}


/** Manage Functions **/

async function mngFlop(table, deck) {
    return DrawFlop(table, deck);
}

async function mngTurn(table, deck) {
    //One draw for nothing (burn)
    await DrawCard(deck);

    const retCard = await DrawCard(deck);
    /* Need to update the db! */
    table.cardOnTable.push(retCard);
    await updateCardsInTable(table);
    return retCard;
}

async function mngRiver(table, deck) {
    //One draw for nothing (burn)
    await DrawCard(deck);

    const retCard = await DrawCard(deck);
    /* Need to update the db! */
    table.cardOnTable.push(retCard);
    await updateCardsInTable(table);
    return retCard;
}
module.exports = {
    GenericFullDeck, mngFlop, mngTurn, mngRiver
    }