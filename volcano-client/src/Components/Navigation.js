import React, { useContext } from "react";
import { Navbar, Nav, Container } from 'react-bootstrap';
import { AppContent } from "../App";

function Navigation(props) {

  const { isLoggedIn } = useContext(AppContent);

  // Removes the token and sets loggedin state to false if logout is performed
  const logout = () => {
    localStorage.removeItem("token");
    props.setIsLoggedIn(false);
  }



  // Returns nav bar
  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand href="/">World's Volcano</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/volcanolist/">Volcano List</Nav.Link>
            {isLoggedIn && <Nav.Link href="/" onClick={() => logout()}>Logout</Nav.Link>}
            {!isLoggedIn && <Nav.Link href="/login/">Login</Nav.Link>}
            <Nav.Link href="/register/">Register</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default Navigation