// import { Link } from "react-router-dom";
// import logo from "../assets/defaultt.png"

// export default function NavbarPublic() {
//   return (
//     <nav className="w-full bg-white px-10 py-4 shadow-sm flex items-center justify-between" style={{display:'flex'}}>
//       {/* Logo */}
//       <img
//         src={logo}
//         alt="logo"
//         className="h-10 w-10"
//         style={{width:'100px', borderRadius:'10px'}}
//       />

//       {/* Restaurant Name */}
//       <h1 className="text-3xl font-vibes text-gray-900">
//         Thindaam
//       </h1>

//       {/* Links */}
//       <div className="flex gap-8 text-gray-600">
//         <Link to="/about" className="hover:text-black">
//           About Us
//         </Link>

//         <Link to="/login" className="hover:text-black">
//           Login
//         </Link>

//         <Link
//           to="/register"
//           className="bg-black text-white px-5 py-2 rounded-full"
//         >
//           Register
//         </Link>
//       </div>
//     </nav>
//   );
// }


import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import logo from "../assets/defaultt.png"


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
            style={{borderRadius:'10px'}}
          />
          <span className="fw-bold fs-4">Thindaam</span>
        </Navbar.Brand>

        {/* Mobile toggle */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          
          {/* Push nav items to the right */}
          <Nav className="ms-auto align-items-center gap-3">

            <Nav.Link href="/about">About Us</Nav.Link>

            <Nav.Link href="/login">Login</Nav.Link>

            <Nav.Link
              href="/register"
              // className="btn btn-dark text-white px-3"
            >
              Sign Up
            </Nav.Link>

          </Nav>
        </Navbar.Collapse>

      </Container>
    </Navbar>
  );
}

export default BasicExample;
