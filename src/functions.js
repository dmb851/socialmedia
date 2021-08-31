


const joinAllRooms = function (socket, rooms, username) {
   //for every room we join a room with that name

   for(let i= 0 ; i<rooms.length; i++){
      let roomname = rooms[i].chatroomid;
      console.log("chatrooms  " + roomname);
      socket.emit("joinRoom", {username, roomname});

   }

}

export default joinAllRooms;