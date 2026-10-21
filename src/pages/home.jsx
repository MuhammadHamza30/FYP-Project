import { Container } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Navbar, Footer } from "../components";
import {
  FiArrowUpRight,
  FiActivity,
  FiUsers,
  FiCalendar,
  FiCheck,
  FiHeart,
} from "react-icons/fi";
export const Home = () => {
  const { hash } = useLocation();
  useEffect(() => {
    if (hash === "#about")
      document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
  }, [hash]);
  return (
    <>
      <Navbar />
      <main>
        <section className="home-hero">
          <Container>
            <div className="hero-layout">
              <div className="hero-copy">
                <span className="eyebrow light">
                  <span /> THE GAME. THE PLAYER. THE PROGRESS.
                </span>
                <h1>
                  A stronger game.
                  <br />A more connected
                  <br />
                  <em>you.</em>
                </h1>
                <p>
                  Your squash journey, brought together. Connect with trainers
                  and doctors, follow club updates, and keep your player profile
                  in one place.
                </p>
                <div className="hero-actions">
                  <Link className="btn primary-button" to="/register">
                    Start your journey <FiArrowUpRight />
                  </Link>
                  <Link className="hero-text-link" to="/trainers">
                    Meet the trainers <span>→</span>
                  </Link>
                </div>
                <div className="hero-checks">
                  <span>
                    <FiCheck /> Player focused
                  </span>
                  <span>
                    <FiCheck /> Connected support
                  </span>
                </div>
              </div>
              <div className="hero-visual">
                <img
                  src="/p5.jpg"
                  alt="Squash player reaching for the ball on court"
                />
                <div className="image-shade" />
                <div className="visual-label">
                  <span className="status-dot" /> BUILT FOR SQUASH
                </div>
                <div className="hero-image-caption">
                  <small>ON AND OFF THE COURT</small>
                  <h2>
                    Every player.
                    <br />
                    Every next step.
                  </h2>
                </div>
                <div className="floating-card">
                  <span className="feature-icon">
                    <FiActivity />
                  </span>
                  <div>
                    <strong>Progress starts with connection</strong>
                    <small>Your team, in one place.</small>
                  </div>
                  <FiArrowUpRight />
                </div>
              </div>
            </div>
          </Container>
        </section>
        <div className="role-strip">
          <Container>
            <span>ONE PLATFORM. YOUR WHOLE SUPPORT TEAM.</span>
            <div>
              <FiUsers /> Players
            </div>
            <div>
              <FiActivity /> Trainers
            </div>
            <div>
              <FiHeart /> Doctors
            </div>
          </Container>
        </div>
        <section id="about" className="section-space">
          <Container>
            <div className="section-heading">
              <div>
                <span className="eyebrow">MORE THAN A PLAYER PROFILE</span>
                <h2>
                  Focus on your game.
                  <br />
                  Stay connected to your team.
                </h2>
              </div>
              <p>
                SPMS brings the people and information behind your squash
                journey into a simpler, shared experience.
              </p>
            </div>
            <div className="feature-grid">
              {[
                [
                  FiUsers,
                  "01",
                  "Find your support team",
                  "Discover trainers and doctors. Manage your connections from your player workspace.",
                  "/trainers",
                  "Explore trainers",
                ],
                [
                  FiCalendar,
                  "02",
                  "Stay in the loop",
                  "Follow tournament announcements and club updates from your dashboard.",
                  "/login",
                  "Open your workspace",
                ],
                [
                  FiActivity,
                  "03",
                  "Keep your journey together",
                  "Manage your player profile, review shared feedback, and access your AI assistant.",
                  "/register",
                  "Create your profile",
                ],
              ].map(([Icon, n, title, copy, url, label]) => (
                <article className="feature-card" key={n}>
                  <div className="d-flex justify-content-between">
                    <span className="feature-icon">
                      <Icon />
                    </span>
                    <small>{n}</small>
                  </div>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                  <Link to={url}>
                    {label} <FiArrowUpRight />
                  </Link>
                </article>
              ))}
            </div>
          </Container>
        </section>
        <section className="join-section">
          <Container>
            <div>
              <span className="eyebrow light">YOUR NEXT CHAPTER</span>
              <h2>
                Bring your squash journey
                <br />
                into focus.
              </h2>
              <p>A dedicated workspace for players, trainers, and doctors.</p>
            </div>
            <Link className="btn primary-button" to="/register">
              Join SPMS <FiArrowUpRight />
            </Link>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
};
