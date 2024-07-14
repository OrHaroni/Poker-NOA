const serverIP = process.env.REACT_APP_SERVER_IP;
const serverPort = process.env.REACT_APP_SERVER_PORT;

export async function addTable(name, password, nickname) {
    const data = {"table": {"name" : name, "password" : password}, "nickname": nickname};
    const res = await fetch(`http://${serverIP}:${serverPort}/tables/addTable`, {
      'method' : 'post',
      "headers" : {
        'Content-Type': 'application/json',
      },
      'body': JSON.stringify(data)
    });

    let updatedUser = await res.json();
    let status = res.status;
    return status;
}