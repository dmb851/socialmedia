import React, { useState } from "react";
import "./login.scss";
import Header from "../parts/header";
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { useHistory } from "react-router-dom";


async function loginUser(credentials) {
   return fetch('http://localhost:8000/login', {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
         'Accept': 'application/json'
      },
      body: JSON.stringify(credentials)
   })
      .then(data => data.json())
}

function Login({ setToken }) {

   const [username, setUsername] = useState();
   const [password, setPassword] = useState();
   const history = useHistory();

   const handleSubmit = async e => {
      e.preventDefault();
      const token = await loginUser({
         username,
         password
      });
      console.log("here");
      console.log(token);
      setToken(token);
      if(token !="" && token != `incorrect username or password`){
         history.push("/");
      }

   }

   return (
      <>
         <div className="login-form container mt-5">
            <div className="login-wrapper">
               <form onSubmit={handleSubmit}>
                  <label>
                     <p>Username</p>
                     <input type="text" onChange={e => setUsername(e.target.value)} />
                  </label>
                  <label>
                     <p>Password</p>
                     <input type="password" onChange={e => setPassword(e.target.value)} />
                  </label>
                  <div>
                     <button type="submit">Submit</button>
                  </div>
               </form>
                  <div className="m-5">  <Link to="/register"  href="/register" className="child registerLink">Need to Sign Up?</Link></div>
            </div>
         </div>
      </>

   )
}

Login.propTypes = {
   setToken: PropTypes.func.isRequired
}


export default Login;