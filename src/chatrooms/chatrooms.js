import "./chatrooms.scss";
import React, {useState, useEffect, useRef} from "react";
import { useDispatch } from "react-redux";
import { Container, Button, Row, Col } from 'react-bootstrap';

function ChatRooms(props){
   const[text, setText] = useState("");
   const [messages, setMessages] = useState([]);
   //const tokenID = props.id;

   const dispatch = useDispatch();

   const dispatchProcess = (encrypt, msg, cipher) =>{
      dispatch(process(encrypt, msg, cipher));
   };

   function getUserChatrooms(props){
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
         })
   }

   useEffect(()=>{
      getUserChatrooms(props);
      
   
   },[]);


   return(
      <div className="chatrooms">
         <Row>ChatRooms</Row>
         
      </div>
   )
}

export default ChatRooms;
