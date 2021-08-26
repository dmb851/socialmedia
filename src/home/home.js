import React, {useState} from "react";
import "./home.scss";
import{Link} from "react-router-dom";

function Homepage ({socket}){
   const[username, setusername] = useState("");
   const [roomname, setroomname] = useState ("");

   const sendData = () =>{
      if(username !== "" && roomname !==""){
         socket.emit("joinRoom", {username, roomname});
      }else{
         alert("you need to enter a username and roomname");
         window.location.reload();
      }
   };

   return(
      <div className="homepage">
         <h1>Welcome to chatting</h1>
         <input
            placeholder="Username"
            value ={username}
            onChange ={(e) => setusername(e.target.value)}>
         </input>
         <input
            placeholder="Room Name"
            value={roomname}
            onChange={(e)=> setroomname(e.target.value)}>
         </input>
         <Link to={`/chat/${roomname}/${username}`}>
            <button onClick={sendData}>Join</button>
         </Link>
      </div>
   )
}


export default Homepage;