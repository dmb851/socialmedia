import React, { useState, useEffect } from "react";
import "./details.scss";
import Header from "../parts/header";
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { Container, Button, Row, Col } from 'react-bootstrap';


function Details(props) {
   //GET ID PARAMETER FROM URL 
   const url = window.location.search;
   const urlParams = new URLSearchParams(url);
   const idInitial = urlParams.get('id');
   const [profileId, setId] = useState(idInitial);
   console.log("id initial" + idInitial);
   const sendId = { id: profileId };

   const token = props.token;

   async function getProfileInfo(id) {
      console.log("id is " + id);
      return fetch('http://localhost:8000/getProfileInfo', {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json'
         },
         body: JSON.stringify(sendId)
      })
         .then(data => {
            return data.json();
         }).then(dataJson => {
            setName(dataJson.name);
            setEmail(dataJson.email);
         })
   }

   useEffect(() => {
      getProfileInfo()

   }, [])

   const [name, setName] = useState();
   const [email, setEmail] = useState();

   // when chat button is clicked we need to check to see if there is a chatroom already between the two users
   //if there is we go to the chat page with that chatroom open
   //if not we create a new chatroom between the two users in the database
   //we go to chat page and open that chat
   const history = useHistory();

   async function CheckChatroomExists(user1, user2) {
      const sendData = { user1id: { user1 }, user2id: { user2 } };


      return fetch('http://localhost:8000/checkchatroomexists', {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json'
         },
         body: JSON.stringify(sendData)
      })
         .then(data => {
            return data.json();
         }).then(dataJson => {
            //if chatroom is found we go to chatroom with the chatroom open
            if (dataJson.length > 0) {
               var room = dataJson[0].chatroomid
               console.log("ROOM" + room);
               history.push(`/chat/${room}`);

            } else {
               //if no chatroom is found we create the chatroom and go to the new chatroom 
               CreateChatRoom(user1, user2);
               history.push("/profile");
            }
         })
   }
   async function CreateChatRoom(user1, user2) {
      const sendData = { user1id: { user1 }, user2id: { user2 } };

      return fetch('http://localhost:8000/createchatroom', {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json'
         },
         body: JSON.stringify(sendData)
      })
         .then(data => {
            return data.json();
         }).then(dataJson => {
            console.log(dataJson);
            //if chatroom is found we go to chatroom with the chatroom open
            // if (dataJson.length > 0) {
            //    var room = dataJson[0].chatroomid
            //    console.log("ROOM" + room);
            //    history.push(`/chat/${room}`);

            // } else {
            //    //if no chatroom is found we create the chatroom and go to the new chatroom 
               
            //    history.push("/profile");
            // }
         })
   }


   return (
      <>
         <Container className="">
            <div className="profileInfo text-center">
               <div className="info ">
                  <div>  ID: {profileId} </div>
                  <div> Name: {name}</div>
                  <div> Email: {email}</div>
               </div>

            </div>
            {/* {token && <Link to="/chat" href="/chat" className="child mx-5 nav-link">
               <button className="btn btn-primary">CHAT</button>
            </Link>
            } */}
            <button className="btn btn-primary" onClick={() => { CheckChatroomExists(token, profileId) }}>CHAT</button>

         </Container>


      </>

   );
}


export default Details;