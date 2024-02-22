/* The DB untill we add the mongoose DB */
const tableList = [
    {
      "id": 1,
      "name": "Table 1",
      "players_num": 4,
      "max_players_num": 8,
      "password": "",
      "moneyAmountOnTable": 1000,
      "bigBlind": 10,
      "smallBlind": 5,
      "cardOnTable": []
    },
    {
      "id": 2,
      "name": "Naor Stronger Table",
      "players_num": 2,
      "max_players_num": 6,
      "password": "123",
      "moneyAmountOnTable": 500,
      "bigBlind": 20,
      "smallBlind": 10,
      "cardOnTable": ["Ace of Spades", "King of Hearts", "Queen of Diamonds"]
    },
    {
      "id": 3,
      "name": "generic name",
      "players_num": 6,
      "max_players_num": 10,
      "password": "",
      "moneyAmountOnTable": 2500,
      "bigBlind": 50,
      "smallBlind": 25,
      "cardOnTable": ["Jack of Clubs"]
    }
  ];  

  module.exports = { tableList };