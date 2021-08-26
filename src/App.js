import logo from './logo.svg';
import './App.scss';
import ChatMain from "./chatmain/chatmain";
import Home from "./home/home";
import Homepage from "./homepage/homepage";
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
                  <Login setToken={setToken} ></Login>
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
               <Homepage socket={socket} />
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
            <Route path="/chat">
               <ChatMain socket={socket} token={token}></ChatMain>
            </Route>
            <Route exact path="/logout">
               {/* <Register component={Register}></Register> */}
            </Route>
         </Switch>
      </Router>
   );
}

export default App;
