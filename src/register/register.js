import React, { useState } from "react";
import "./register.scss";
import Header from "../parts/header";
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { useHistory } from "react-router-dom";

async function addNewUser(credentials) {
   return fetch('http://localhost:8000/newUser', {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
   })
      .then(data => data.json());
}

function Register() {
   const history = useHistory();

   const [username, setUsername] = useState();
   const [password, setPassword] = useState();
   const [email, setEmail] = useState();

   const handleSubmit = async e => {
      e.preventDefault();
      const addSuccess = await addNewUser({
         username,
         password,
         email
      });
      console.log(addSuccess);
      history.push("/login");

      //window.location.reload();

   }
   // TODO: Add google sign in option
   return (
      <>

         <div className="login-form container mt-5">
            <div className="login-wrapper">
               <form onSubmit={handleSubmit}>
                  <div>REGISTER</div>
                  <label>
                     <p>Enter Email</p>
                     <input type="email" onChange={e => setEmail(e.target.value)} />
                  </label>
                  <label>
                     <p>Create Username</p>
                     <input type="text" onChange={e => setUsername(e.target.value)} />
                  </label>
                  <label>
                     <p>Create Password</p>
                     <input type="password" onChange={e => setPassword(e.target.value)} />
                  </label>
                  <div>
                     <button type="submit">Submit</button>
                  </div>
               </form>
               <div className="m-5">  <Link to="/login" className="child registerLink">Already have an account?</Link></div>
            </div>
         </div>
      </>

   )
}



export default Register;