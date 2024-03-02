// export async function post , that remove the player from the table and revmove the player from players array in the table, 
export async function leaveTable(tableName, nickname) {
    const data = { "name" : tableName ,"nickname" : nickname};
    const res = await fetch('http://localhost:8080/tables/leaveTable', {
      'method' : 'post',
      "headers" : {
        'Content-Type': 'application/json',
      },
      'body': JSON.stringify(data)
    });
    // the server return only the status
    return await res.status;
}

