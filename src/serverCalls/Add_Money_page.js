const serverIP = process.env.REACT_APP_SERVER_IP;
const serverPort = process.env.REACT_APP_SERVER_PORT;

export async function addMoney(username, amount) {
    const data = { "username": username, "moneyAmount": amount };

    const res = await fetch(`http://${serverIP}:${serverPort}/users/addMoney`, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });

    let updatedUser = await res.json();
    let status = res.status;
    return [updatedUser, status];
}