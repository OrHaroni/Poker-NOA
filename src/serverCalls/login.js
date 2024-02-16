export const userList = [];

export function userExistsWithPassword(username, password) {
    return userList.some(obj => obj.username === username && obj.password === password);
}
