import Chat from "../chat/chat";
import Process from "../process/process";
import ChatRooms from "../chatrooms/chatrooms";
import React from "react";
import io from "socket.io-client";
import "./chatmain.scss";
import { useState, useEffect, useRef } from "react";

const socket = io.connect('/');

function ChatMain(props) {
   const initialState = [{ id: 0, name: "Loading Profiles..." }];
   const [userchatrooms, setUserChatrooms] = useState(initialState);

   function getUserChatrooms(props) {
      console.log("id is " + props.id);
      const sendId = { id: props.id };

      return fetch('http://localhost:8000/getUserChatrooms', {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json'
         },
         body: JSON.stringify(sendId)
      })
         .then(data => {
            return data.json();
         }).then(dataJson => {
            console.log(dataJson);
            setUserChatrooms(dataJson);
         })
   }

   function joinAllRooms(username) {
      getUserChatrooms(props)
   }


   const url = window.location.search;
   const urlParams = new URLSearchParams(url);
   //const roomnum = urlParams.get('roomnum');
   const [roomnum, setRoomnum] = useState(props.match.params.roomname);
   return (
      <>
         <div className="chatmain">
            <div className="left">
               {/* chat room list */}
               <ChatRooms id={props.token} setRoomnum={setRoomnum} ></ChatRooms>

            </div>
            <div className="middle">
               <Chat
                  // username={props.match.params.username}
                  // roomname={props.match.params.roomname}
                  socket={socket}
                  roomname={roomnum}
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