import Chat from "../chat/chat";
import Process from "../process/process";
import ChatRooms from "../chatrooms/chatrooms";
import React from "react";
import io from "socket.io-client";
import "./chatmain.scss";
import { useState, useEffect, useRef } from "react";
import { to_Decrypt, to_Encrypt } from "../aes.js";
import { useDispatch } from "react-redux";
import { process } from "../store/action/index";
import { useHistory, useLocation } from 'react-router-dom'

// const socket = io.connect('/');

function ChatMain(props) {
   const initialState = [{ id: 0, name: "Loading Profiles..." }];
   const [userchatrooms, setUserChatrooms] = useState(initialState);
   const [messages, setMessages] = useState([]);
   const history = useHistory() ;
   const location = useLocation();

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
   const dispatch = useDispatch();

   const dispatchProcess = (encrypt, msg, cipher) => {
      dispatch(process(encrypt, msg, cipher.ans));
   };

   useEffect(() => {
      console.log("SOCKET CHANGED");
      props.socket.on("message", (data) => {
         console.log("hi");
         //const ans = String(data.text.ans);
         //const ans = to_Decrypt(data.text, data.room);
         //const ans = "hi thereee";
         const ans = to_Decrypt(data.text.ans, data.username);
         dispatchProcess(false, ans, data.text);
         console.log("ans" + ans);

         let temp = messages;
         temp.push({
            userId: data.userId,
            username: data.room,
            text: ans,
         });

         setMessages([...temp]);

      });

   }, [props.socket]);


   function joinAllRooms(username) {
      getUserChatrooms(props)
   }


   const url = window.location.search;
   const urlParams = new URLSearchParams(url);
   //const roomnum = urlParams.get('roomnum');
   const [roomnum, setRoomnum] = useState(props.match.params.roomname);

   useEffect(() => {
      setRoomnum(props.match.params.roomname);
      console.log("ROOMNUM: " + props.match.params.roomname);
   }, [location])

   return (
      <>
         <div className="chatmain">
            <div className="left">
               {/* chat room list */}
               <ChatRooms id={props.token[0].id} ></ChatRooms>

            </div>
            <div className="middle">
               <Chat
                  // username={props.match.params.username}
                  // roomname={props.match.params.roomname}
                  socket={props.socket}
                  roomname={roomnum}
                  id={props.token[0].id}
                  messages = {messages}
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