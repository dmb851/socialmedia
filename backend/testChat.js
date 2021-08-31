const users = [];

function joinUser(userId, username, roomNum) {
   const newUser = { userId, username, roomNum };
   //check if newUser is already in users
   if(!users.includes(newUser)){
      users.push(newUser);
   }
   console.log("user out", users);

   return newUser;

}
console.log("user out", users);


function getCurrentUser(userId) {
   return users.find((user) => user.userId === userId);
}

function userDisconnects(userId) {
   let indexToDelete = users.findIndex((user) => user.userId === userId);
   let userDeleted = "";
   if (indexToDelete != -1) {
      userDeleted = users.splice(indexToDelete, 1)[0];
      indexToDelete = users.findIndex((user) => user.userId === userId);
      while(indexToDelete != -1){
          users.splice(indexToDelete, 1)[0];
          indexToDelete = users.findIndex((user) => user.userId === userId);
      }
   }
   console.log("users: ", users);
   return userDeleted;

}
// function userDisconnects(userId) {
//    const indexToDelete = users.findIndex((user) => user.userId === userId);
//    console.log("users", users);
//    if (indexToDelete != -1) {
//       return users.splice(indexToDelete, 1)[0];
//    }
// }

module.exports = {
   joinUser,
   getCurrentUser,
   userDisconnects,
};