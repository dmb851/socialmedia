import Chat from "../chat/chat";
import Process from "../process/process";
import ChatRooms from "../chatrooms/chatrooms";
import React from "react";
import io from "socket.io-client";
import "./chatmain.scss";

const socket = io.connect('/');


function ChatMain(props) {
   const url = window.location.search;
   const urlParams = new URLSearchParams(url);
   //const roomnum = urlParams.get('roomnum');
   const roomnum = props.roomnum;

   return (
      <>
         <div className="chatmain">
            <div className="left">
               {/* chat room list */}
               <ChatRooms id={props.token} ></ChatRooms>

            </div>
            <div className="middle">
            <Chat
                  // username={props.match.params.username}
                  // roomname={props.match.params.roomname}
                  socket={socket}
                  roomname= {props.match.params.roomname}
                  id={props.token}
               />
            </div>
            <div className="right">
               <Process />
            </div>
         </div>
         </>

   )
}

export default ChatMain;