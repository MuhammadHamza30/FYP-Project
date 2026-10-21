import { Link } from "react-router-dom";
import { Container } from "react-bootstrap";
import { GiTennisRacket } from "react-icons/gi";
export const Footer = () => (
  <footer className="public-footer">
    <Container>
      <div className="footer-main">
        <div>
          <Link className="brand" to="/">
            <span className="brand-mark">
              <GiTennisRacket />
            </span>
            SPMS
          </Link>
          <p>
            A connected space for players,
            <br />
            trainers, and better support.
          </p>
        </div>
        <div>
          <small>EXPLORE</small>
          <Link to="/trainers">Find a trainer</Link>
          <Link to="/doctors">Meet the doctors</Link>
        </div>
        <div>
          <small>YOUR ACCOUNT</small>
          <Link to="/register">Join SPMS</Link>
          <Link to="/login">Sign in</Link>
          <Link to="/admin">Administrator access</Link>
        </div>
      </div>
      <div className="footer-bottom">
        © {new Date().getFullYear()} SPMS. All rights reserved.
        <span>Made for squash.</span>
      </div>
    </Container>
  </footer>
);
