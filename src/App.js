import logo from './logo.svg';
import './App.scss';
import ChatMain from "./chatmain/chatmain";
import Home from "./home/home";
import Homepage from "./homepage/homepage";
import joinAllRooms from "./functions";
import HeaderLogin from "./parts/headerlogin";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import React from "react";
import io from "socket.io-client";
import Login from "./login/login";
import Register from "./register/register";
import Profile from "./profile/profile";
import Details from "./details/details";
import Header from "./parts/header";
import { useState, useEffect } from 'react';
import history from "./history";
import useToken from './useToken';

const socket = io.connect('/');

function App() {
   const { token, setToken } = useToken();
   const [userchatrooms, setUserChatrooms] = useState("dog");

   async function getUserChatrooms(id) {
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
            //props.setUserChatrooms("apple");
            return data.json();
         }).then(dataJson => {
            console.log("DATA JSON: ");
            console.log(dataJson);
            setUserChatrooms(dataJson);
         })
   }

   useEffect(() => {
      if(token){
         getUserChatrooms(token[0].id);
      }
   }, [token])
   
   useEffect(() => {
      if(userchatrooms!="dog" && userchatrooms !="" && token){
         joinAllRooms(socket, userchatrooms, token[0].id);

      }
   }, [userchatrooms])


   // if we are not logged in we show the login page
   // todo we should instead show the homepage without the profile features
   if (!token) {
      return (
         <Router >
            <Header></Header>

            <Switch>
               <Route path="/" exact>
                  <Homepage socket={socket} />
               </Route>
               <Route exact path="/login" >
                  <Login setToken={setToken} setUserChatrooms={setUserChatrooms} ></Login>
               </Route>
               <Route exact path="/register" >
                  <Register />
               </Route>
               <Route path="/details">
                  <Details></Details>
               </Route>
            </Switch>
         </Router>)
   }
   //if logged in we then show the homepage with all of the profile features
   return (
      <Router history={history}>
         <HeaderLogin token={token} setToken={setToken} ></HeaderLogin>

         <Switch>
            <Route exact path="/" >
               <Homepage socket={socket} chatrooms={userchatrooms} />
            </Route>
            {/* <Route path = "/chat/:roomname/:username" component={Appmain}/> */}
            <Route exact path="/register">
               <Register component={Register}></Register>
            </Route>
            <Route exact path="/profile">
               <Profile component={Profile} id={token}></Profile>
            </Route>
            <Route path="/details">
               <Details token={token}></Details>
            </Route>
            <Route path="/chat/:roomname" component={(props) => <ChatMain{...props} token={token} key={socket} socket={socket}></ChatMain>}>
            </Route>
            {/* <Route path="/chat/:roomname" exact>
               <ChatMain socket={socket} token={token}></ChatMain>
            </Route> */}
            <Route exact path="/logout">
               {/* <Register component={Register}></Register> */}
            </Route>
         </Switch>
      </Router>
   );
}

export default App;
