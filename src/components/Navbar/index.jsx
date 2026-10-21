import { Navbar as BNav, Nav, Container } from "react-bootstrap";
import { Link, NavLink } from "react-router-dom";
import { GiTennisRacket } from "react-icons/gi";
export const Navbar = () => (
  <BNav expand="lg" className="public-nav" collapseOnSelect>
    <Container>
      <BNav.Brand as={Link} to="/" className="brand">
        <span className="brand-mark">
          <GiTennisRacket />
        </span>
        SPMS<span className="brand-caption">SQUASH & PERFORMANCE</span>
      </BNav.Brand>
      <BNav.Toggle aria-controls="public-navigation" />
      <BNav.Collapse id="public-navigation">
        <Nav className="ms-auto align-items-lg-center gap-lg-4">
          <Nav.Link as={NavLink} end to="/">
            Home
          </Nav.Link>
          <Nav.Link as={NavLink} to="/trainers">
            Trainers
          </Nav.Link>
          <Nav.Link as={NavLink} to="/doctors">
            Doctors
          </Nav.Link>
          <Nav.Link as={Link} to="/#about">
            About SPMS
          </Nav.Link>
          <Nav.Link as={Link} to="/login">
            Sign in
          </Nav.Link>
          <Link className="btn primary-button" to="/register">
            Get started ↗
          </Link>
        </Nav>
      </BNav.Collapse>
    </Container>
  </BNav>
);
