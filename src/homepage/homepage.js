import React, { useState, useEffect } from "react";
import "./homepage.scss";
import Header from "../parts/header"
import { Link } from "react-router-dom";
import { Container, Button, Row, Col } from 'react-bootstrap';

function Homepage(props) {


   async function getAllProfiles() {
      return fetch('http://localhost:8000/getAllProfiles', {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json'
         }
      })
         .then(data => {
            return data.json();
         }).then(dataJson => {
            console.log(dataJson);
            setProfiles(dataJson);
         })
   }

   const initialState = [{ id: 0, name: "Loading Profiles..." }];
   const [profiles, setProfiles] = useState(initialState);

   useEffect(() => {
      getAllProfiles();
   }, [])

   useEffect(() => {
      console.log(props.chatrooms);

   },[props.chatrooms]);

   return (
      <>
         <Container>

            <div className="text-center">
               <h1>Explore These Producers</h1>
            </div>

            <ProfileList list={profiles}></ProfileList>

         </Container>

      </>
   )
}

const ProfileList = ({ list }) => {

   if (list.length > 0) {
      return (
         <Row>
            {list.map(item =>
            (<div key={item.id} className=" p-2  col-md-4" name="articleItem" id="articleItem">
               <Container className="h-100 article-border">
                  <Link to={"/details?id=" + item.id} className="article-row">
                     <div className="py-5 ">
                        <div className="article-text text-center w-100">
                           {item.name}
                        </div>

                     </div>
                  </Link>

               </Container>

            </div >))}

         </Row>
      )
   } else {
      return (
         <Row>

            <div className=" p-5 col-md-4">

            </div >

         </Row>
      )

   }
}


export default Homepage;