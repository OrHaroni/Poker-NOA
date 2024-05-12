const gameUtiles = require("./gameUtiles.js");
const tableSchema = require('../models/tables.js')


/* Creating a copy of a generic full deck */
const deck = gameUtiles.GenericFullDeck;

//Table for testing
const table = tableSchema.findOne({"tableName": "test"});

async function StartGame(table) {
    const deck = gameUtiles.GenericFullDeck;

    if(!table.cardOnTable) {
        table.cardOnTable = [];
    }


    /* Doing the Flop */
    const [c1Promise, c2Promise, c3Promise] = await gameUtiles.mngFlop(table, deck);
    const c1 = await c1Promise;
    const c2 = await c2Promise;
    const c3 = await c3Promise;

    const turnCard = await gameUtiles.mngTurn(table, deck);

    const riverCard = await gameUtiles.mngRiver(table, deck);


    console.log("Deck after all:");
    console.log("this is the deck:", deck);
    console.log("Deck's length after flop:", deck.length);

    console.log(table.cardOnTable);
    //Do Flop
    //Do Turn (Fourth card) 
    //Do River (Fifth card)
    //Both Turn and River calls to the same function
}

StartGame(table);