
import { Navbar, NavDropdown, NavItem, NavLink, Nav, Container } from "react-bootstrap";
import {
   Link
} from "react-router-dom";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import PropTypes from 'prop-types';
import React, { useState } from "react";


function HeaderLogin(props) {

   const logout = async e => {
      e.preventDefault();
      console.log(props.token);
      var username = props.token[0].username;
      var blank = "";
      console.log(username);
      const data = { user: username };
      props.setToken(blank);
      return fetch('http://localhost:8000/logout', {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
         },
         body: JSON.stringify(data)
      });
         
   }

   return (
      <>
         <Navbar bg="light" expand="lg">
            <Container>
               <Navbar.Brand><Link to="/" href="/" className=" navbar-brand"> ProducerExplorer  </Link></Navbar.Brand>
               <Navbar.Toggle aria-controls="basic-navbar-nav" />
               <Navbar.Collapse id="basic-navbar-nav">
                  <Nav className="ms-auto">
                     {/* <Link to="/logout" href="/logout" className="child">Logout</Link> */}
                     <NavLink to="/chat" href="/chat" className="child mx-5 nav-link"> Chat </NavLink>
                     <NavLink to="/profile" href="/profile" className="child mx-5 nav-link"> Profile </NavLink>

                     <a onClick={logout} className="child mx-5 nav-link">Logout</a>
                  </Nav>
                  
               </Navbar.Collapse>
            </Container>
         </Navbar>

      </>

   );
}

HeaderLogin.propTypes = {
   token: PropTypes.array.isRequired,
   setToken: PropTypes.func.isRequired
}

export default HeaderLogin;