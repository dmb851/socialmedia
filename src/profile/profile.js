import React, { useState } from "react";
import "./profile.scss";
import Header from "../parts/header";
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { useHistory } from "react-router-dom";
import {useEffect} from "react";



function Profile(id) {
   const history = useHistory();
   console.log(id.id[0].id);
   const userid = id.id[0].id;

   var profileData = [];
   const sendId = { id: userid };

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
         }).then(dataJson=>{
            setName(dataJson.name);
            setEmail(dataJson.email);
         })
   }

   async function updateProfile(profileInfo) {
      return fetch('http://localhost:8000/updateProfile', {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json'
         },
         body: JSON.stringify(profileInfo)
      })
         .then(data =>{
            data.json();
            getProfileInfo(userid);
         });
   }

   const [password, setPassword] = useState();
   const [email, setEmail] = useState();
   const [name, setName] = useState();

   useEffect(() => {
      getProfileInfo(userid);
   }, [])

   const handleSubmit = async e => {
      e.preventDefault();
      const addSuccess = await updateProfile({
         userid,
         password,
         email,
         name
      });
      console.log(addSuccess);
      //window.location.reload();

   }
   // TODO: Add google sign in option
   return (
      <>

         <div className="login-form container mt-5">
            <div className="login-wrapper">
               <form onSubmit={handleSubmit}>
                  <div>Profile</div>
                  <label>
                     <p>Update Email</p>
                     <input type="email" defaultValue={email} onChange={e => setEmail(e.target.value)} />
                  </label>
                  <label>
                     <p>Name</p>
                     <input type="text" onChange={e => setName(e.target.value)} defaultValue={name}></input>
                  </label>
                  <label>
                     <p>Update Password</p>
                     <input type="password" onChange={e => setPassword(e.target.value)} />
                  </label>
                  <div>
                     <button type="submit">Update Profile</button>
                  </div>
               </form>
            </div>
         </div>
      </>

   )
}



export default Profile;