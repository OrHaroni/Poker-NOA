export async function addTable(name, maxPlayersNum, password) {
    const data = {"name" : name,"max_players_num": maxPlayersNum , "password" : password};

    const res = await fetch('http://localhost:8080/tables/addTable', {
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