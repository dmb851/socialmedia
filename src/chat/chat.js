import "./chat.scss";
import { to_Decrypt, to_Encrypt } from "../aes.js";
import { process } from "../store/action/index";
import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";

function Chat(props) {
   const [text, setText] = useState("");
   const [messages, setMessages] = useState([]);
   const [username, setUsername] = useState([]);

   const url = window.location.search;
   const urlParams = new URLSearchParams(url);
   const idInitial = urlParams.get('id');

   const dispatch = useDispatch();

   const dispatchProcess = (encrypt, msg, cipher) => {
      dispatch(process(encrypt, msg, cipher));
   };

   async function joinRoom(username, roomnum) {
      console.log("roomnum is " + roomnum);

      if (roomnum !== "") {
         const sendInfo = { roomname: { roomnum }};
         props.socket.emit("joinRoom",  {username, roomnum});
      }
   }


   async function getUsernameFromId(id) {
      console.log("id is " + id);
      const sendId = { id: id };

      return fetch('http://localhost:8000/getUsernameFromId', {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json'
         },
         body: JSON.stringify(sendId)
      })
         .then(data => {
            return data.json();
         }).then(dataJson => {
            setUsername(dataJson.username)
         })
   }

   useEffect(() => {
      getUsernameFromId(props.id);

   }, [])

   useEffect(() => {
      props.socket.on("message", (data) => {
         console.log("hi");
         //const ans = to_Decrypt(data.text, data.username);
         const ans = to_Decrypt(data.text, data.username);
         dispatchProcess(false, ans, data.text);
         console.log("ans" + ans);

         let temp = messages;
         temp.push({
            userId: data.userId,
            username: data.username,
            text: ans,
         });

         setMessages([...temp]);

      });

   }, [props.socket]);

   //also send the room of the user
   const sendData = () => {
      if (text !== "") {
         const ans = to_Encrypt(text);
         const sendInfo = { messageEncrypted: { ans }, id: props.id, room: props.roomname };
         console.log(ans);
         props.socket.emit("chat", sendInfo);
         setText("");
      }
   };


   const messagesEndRef = useRef(null);

   const scrollToBottom = () => {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
   };

   useEffect(scrollToBottom, [messages]);
   console.log(messages, "mess");

   return (
      <div className="chat">
         <div className="user-name">
            <h2>
               {props.username} <span style={{ fontSize: ".07rem" }}>
                  in {props.roomname}
               </span>
            </h2>
         </div>
         <div className="chat-message">
            {messages.map((i) => {
               if (i.username === props.username) {
                  return (
                     <div className="message">
                        <p>{i.text}</p>
                        <span>{i.username}</span>
                     </div>
                  );
               } else {
                  return (
                     <div className="message mess-right">
                        <p>{i.text}</p>
                        <span>{i.username}</span>
                     </div>
                  )
               }
            })}
            <div ref={messagesEndRef} />
         </div>
         <div className="send">
            <input
               placeholder="message..."
               value={text}
               onChange={(e) => setText(e.target.value)}
               onKeyPress={(e) => {
                  if (e.key === "Enter") {
                     sendData();
                  }
               }}
            ></input>
            <button onClick={sendData}>Send</button>
         </div>
      </div>
   )
}

export default Chat;
