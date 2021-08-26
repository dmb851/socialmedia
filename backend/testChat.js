const users = [];

function joinUser(userId, username, roomNum) {
   const newUser = { userId, username, roomNum };

   users.push(newUser);
   console.log("user out", users);

   return newUser;

}
console.log("user out", users);


function getCurrentUser(userId) {
   return users.find((user) => user.userId === userId);
}

function userDisconnects(userId) {
   const indexToDelete = users.findIndex((user) => user.userId === userId);

   if (indexToDelete != -1) {
      return users.splice(indexToDelete, 1)[0];
   }
}

module.exports = {
   joinUser,
   getCurrentUser,
   userDisconnects,
};