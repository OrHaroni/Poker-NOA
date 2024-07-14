const serverIP = process.env.REACT_APP_SERVER_IP;
const serverPort = process.env.REACT_APP_SERVER_PORT;

export async function getAllUsers() {
    const data = {};
    const res = await fetch(`http://${serverIP}:${serverPort}/users/getAll`, {
      'method' : 'post',
      "headers" : {
        'Content-Type': 'application/json',
      },
      'body': JSON.stringify(data)
    });
    let AllUsers = await res.json();
    let status = res.status;
    return [AllUsers, status];
}