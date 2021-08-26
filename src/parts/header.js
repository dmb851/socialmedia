
import { Navbar, NavDropdown, NavItem, NavLink, Nav, Container } from "react-bootstrap";
import {
   Link
 }from "react-router-dom";
 import {BrowserRouter as Router ,Switch, Route } from "react-router-dom";

function Header() {
   return (
      <>
      <Navbar bg="light" expand="lg">
            <Container>
               <Navbar.Brand><Link to="/"  href="/"  className=" navbar-brand"> ProducerExplorer  </Link></Navbar.Brand>
               <Navbar.Toggle aria-controls="basic-navbar-nav" />
               <Navbar.Collapse id="basic-navbar-nav">
                  <Nav className="ms-auto">
                    <Link to="/login" href="/login" className="child nav-link">Login</Link>
                  </Nav>
               </Navbar.Collapse>
            </Container>
         </Navbar>
        
      </>

   );
}


export default Header;