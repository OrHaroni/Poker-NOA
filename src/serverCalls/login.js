const serverIP = process.env.REACT_APP_SERVER_IP;
const serverPort = process.env.REACT_APP_SERVER_PORT;

export async function userExistsWithPassword(username, password) {
    const data = {"username" : username, "password" : password};
    const res = await fetch(`http://${serverIP}:${serverPort}/users/validateUser`, {
      'method' : 'post',
      "headers" : {
        'Content-Type': 'application/json',
      },
      'body': JSON.stringify(data)
    });
    let user = await res.json();
    let status = res.status;
    return [user, status];
}

export async function GetAllUser(){
    const res = await fetch(`http://${serverIP}:${serverPort}/users/getall`, {
        'method' : 'get',
        "headers" : {
          'Content-Type': 'application/json',
        },
      });
      let users = await res.json();
      //returning the status number and ID!!
      return users;
}
