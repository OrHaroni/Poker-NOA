const { GoogleGenerativeAI } = require("@google/generative-ai");

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI("AIzaSyAkPDYtW5Dya0H9cWqdbFYZwwg14ZWqEqY");

// The Gemini 1.5 models are versatile and work with both text-only and multimodal prompts
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

async function ai_play(hand, cardsOnTable, myMoney, moneyOnTable, moneyToCall) {
    const prompt = `Your hands are: ${hand.map(card => 
        `${card.suit.toString()} ${card.value.toString()}`).join(", ")}
        Cards on table:
        ${cardsOnTable.map(card => `${card.suit.toString()} ${card.value.toString()}`).join(", ")}
        Your money: ${myMoney}\nMoney on table: ${moneyOnTable}
        Money to call: ${moneyToCall}
        What do you think we need to play? 
        Answer with actions
        (check (only if moneyToCall is 0),
        call if you have ok cards,
        fold if you have bad cards,
        raise if you have good cards like flash or pair,
        or check (only if moneyToCall is 0))
        please only answer with one of the actions
        above is a way of
        "action money" if fold money is zero
        its importent to answer like - action money if its check say check 0
        if raise so raise money
        if call so call money
        if fold so fold 0
        if check so check 0
        please take risk and raise if you have good cards
        `;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        return text;
}

module.exports = {
    ai_play
}