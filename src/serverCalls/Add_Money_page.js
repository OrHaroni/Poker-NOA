

export async function addMoney(username, ammount) {
    const data = {"username" : username, "ammount" : ammount};

    const res = await fetch('http://localhost:8080/addMoney', {
      'method' : 'post',
      "headers" : {
        'Content-Type': 'application/json',
      },
      'body': JSON.stringify(data)
    });

    let updatedUser = await res.json();
    console.log(updatedUser);
    let status = res.status;
    return [updatedUser, status];
}