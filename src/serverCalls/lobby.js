export async function GetAllTables(){
    const res = await fetch('http://localhost:8080/tables', {
        'method' : 'get',
        "headers" : {
          'Content-Type': 'application/json',
        },
      });

      return await res.json();
}

export async function enterTable(tableName, password, username) {
    const data = {"name" : tableName, "password" : password, "username" : username};
    const res = await fetch('http://localhost:8080/tables/validateTable', {
      'method' : 'post',
      "headers" : {
        'Content-Type': 'application/json',
      },
      'body': JSON.stringify(data)
    });
    let table = await res.json();
    let status = res.status;
    return [table, status];
}

export async function joinUserIntoTable(tableName, username, moneyToEnterWith) {
  const data = {"tableName" : tableName, "username" : username, "moneyToEnterWith": moneyToEnterWith};

  const res = await fetch('http://localhost:8080/tables/joinUserIntoTable', {
    'method' : 'post',
    "headers" : {
      'Content-Type': 'application/json',
    },
    'body': JSON.stringify(data)
  });

  let table = await res.json();
  let status = res.status;

  return status;
}
