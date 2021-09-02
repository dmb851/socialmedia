import "./chatrooms.scss";
import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { Container, Button, Row, Col } from 'react-bootstrap';
import { Link } from "react-router-dom";

function ChatRooms({id, setRoomnum}) {
   const [text, setText] = useState("");
   const [messages, setMessages] = useState([]);
   //const tokenID = props.id;
   const initialState = [{ id: 0,chatroomid:0, name: "Loading Profiles..." }];

   const [userchatrooms, setUserChatrooms] = useState(initialState);
   const dispatch = useDispatch();

   const dispatchProcess = (encrypt, msg, cipher) => {
      dispatch(process(encrypt, msg, cipher));
   };

   function getUserChatrooms(id) {
      console.log("id is " + id);
      const sendId = { id: id };

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
            console.log( "dataJson: "+JSON.stringify(dataJson));
            setUserChatrooms(dataJson);
         })
   }

   useEffect(() => {
      getUserChatrooms(id);

   }, []);

   function updateRoomNum(roomnum){
      setRoomnum(roomnum);
      console.log("new room" + roomnum);
   }

   return (
      <div className="chatrooms">
         <Row>ChatRooms</Row>
         <Row>
            {userchatrooms.map(item =>
            (<div  className=" p-2  col-md-4" name="articleItem" id="articleItem">
               <Container className="h-100 article-border">
                  <Link to={`/chat/${item.chatroomid}`} className="article-row">
                     <div className="py-5 ">
                        <div className="article-text text-center w-100">
                           {item.chatroomid}
                        </div>

                     </div>
                  </Link>

               </Container>

            </div >))}

         </Row>
      </div>
   )
}

export default ChatRooms;
