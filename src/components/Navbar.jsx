
import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
const navLinksHu = [
  { to: "/designer", label: "A tervezőről" },
  { to: "/about", label: "A márkáról" },
  { to: "/catalog", label: "Katalógus" },
  { to: "/contact", label: "Kapcsolat" },
];
const navLinksEn = [
  { to: "/en/designer", label: "Designer" },
  { to: "/en/about", label: "About" },
  { to: "/en/catalog", label: "Catalog" },
  { to: "/en/contact", label: "Contact" },
];



const CabeceoNavbar = () => {
  const location = useLocation();
  const isEnglish = location.pathname.startsWith("/en");
  const navLinks = isEnglish ? navLinksEn : navLinksHu;
  const [expanded, setExpanded] = useState(false);
  const handleNavClick = () => setExpanded(false);
  return (
    <Navbar bg="black" variant="dark" expand="lg" fixed="top" className="border-bottom border-warning shadow-sm py-0" expanded={expanded} onToggle={setExpanded}>
      <Container fluid className="px-2 px-sm-3 px-md-4">
        <Navbar.Brand as={NavLink} to={isEnglish ? "/en" : "/"} className="mx-auto order-2 d-flex align-items-center gap-2" style={{ zIndex: 2 }}
          onClick={e => {
            const homePath = isEnglish ? "/en" : "/";
            if (window.location.pathname === homePath) {
              e.preventDefault();
              window.location.href = homePath;
            }
            handleNavClick();
          }}
        >
          <img src="/assets/cabeceo-logo.png" alt="Cabeceo logo" style={{ width: 40, height: 'auto', filter: 'drop-shadow(0 0 6px #000)' }} />
          <span className="d-none d-md-inline text-light fw-bold" style={{ letterSpacing: '0.04em', fontSize: '1.25rem' }}>Cabeceo</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="cabeceo-navbar-nav" className="order-1 border-0" style={{ boxShadow: 'none' }} />
        <Navbar.Collapse id="cabeceo-navbar-nav" className="order-3">
          <Nav className="mx-auto gap-1 gap-sm-2 align-items-center">
            {navLinks.map(link => (
              <Nav.Link
                as={NavLink}
                to={link.to}
                key={link.to}
                className="btn btn-outline-warning px-2 px-sm-3 py-1 fw-semibold text-uppercase border-1"
                style={{ minWidth: 90, fontSize: '0.95rem' }}
                onClick={handleNavClick}
              >
                {link.label}
              </Nav.Link>
            ))}
            <Nav.Link
              as={NavLink}
              to={isEnglish ? "/" : "/en"}
              className="btn btn-link text-light text-decoration-none text-lowercase fw-normal ms-2 ms-sm-3 ms-md-4 px-2"
              style={{ fontSize: '0.95rem', letterSpacing: '0.05em', zIndex: 2 }}
              onClick={handleNavClick}
            >
              {isEnglish ? "hu" : "en"}
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CabeceoNavbar;
