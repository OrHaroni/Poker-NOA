const serverIP = process.env.REACT_APP_SERVER_IP;
const serverPort = process.env.REACT_APP_SERVER_PORT;

export async function getStat(username) {
    const res = await fetch(`http://${serverIP}:${serverPort}/users/getStat/` + username, {
      'method' : 'get',
      "headers" : {
        'Content-Type': 'application/json',
      },
    });
    let userStat = await res.json();
    let status = res.status;
    console.log("we got this: ", userStat);
    return [userStat, status];
}