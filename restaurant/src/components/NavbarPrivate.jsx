import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import logo from "../assets/defaultt.png";
import Logout from "./Logout";

function BasicExample() {
  return (
    <Navbar expand="lg" className="bg-body-tertiary shadow-sm">
      <Container>

        {/* Left side: Logo + Restaurant Name */}
        <Navbar.Brand href="/" className="d-flex align-items-center gap-2">
          <img
            src={logo}
            alt="Thindaam Logo"
            width="55"
            height="35"
            className="d-inline-block align-top"
            style={{ borderRadius: "10px" }}
          />
          <span className="fw-bold fs-4">Thindaam</span>
        </Navbar.Brand>

        {/* Mobile toggle */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">

          {/* Center / Right nav items */}
          <Nav className="ms-auto text-center gap-3">

            <Nav.Link href="/menu">Menu</Nav.Link>
            <Nav.Link href="/contact">Contact Us</Nav.Link>

            {/* User Profile Dropdown */}
            <NavDropdown
              title="User Profile"
              id="user-nav-dropdown"
              align="end"
              className="mt-2 mt-lg-0"
            >
              <NavDropdown.Item href="/profile">
                My Profile
              </NavDropdown.Item>

              <NavDropdown.Divider />

              <NavDropdown.Item as="div" className="text-center">
                <Logout />
              </NavDropdown.Item>
            </NavDropdown>

          </Nav>

        </Navbar.Collapse>

      </Container>
    </Navbar>
  );
}

export default BasicExample;

