import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getTournments, getUpdates } from "../APIS";
import { MainSidebar } from "./Sidebar";
import {
  FiUsers,
  FiCalendar,
  FiMessageSquare,
  FiArrowUpRight,
  FiActivity,
} from "react-icons/fi";
import { roleOf } from "../utils/session";
export const Dashboard = () => {
  const { user } = useSelector((s) => s.user);
  const role = roleOf(user);
  const [data, setData] = useState({ updates: [], tournaments: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    Promise.all([getUpdates(), getTournments()])
      .then(([updates, tournaments]) => {
        if (active) setData({ updates, tournaments });
      })
      .catch(() => {
        if (active)
          setError("We couldn’t load club updates. Please try again.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [retry]);
  const stats =
    role === "player"
      ? [
          ["My trainers", user?.trainers?.length || 0, FiUsers],
          ["My doctors", user?.doctors?.length || 0, FiActivity],
          [
            "Feedback received",
            (user?.doctorFeedbacks?.length || 0) +
              (user?.trainerFeedbacks?.length || 0),
            FiMessageSquare,
          ],
        ]
      : [
          ["Connected players", user?.players?.length || 0, FiUsers],
          [
            "Tournaments",
            loading || error ? "—" : data.tournaments.length,
            FiCalendar,
          ],
          [
            "Club updates",
            loading || error ? "—" : data.updates.length,
            FiMessageSquare,
          ],
        ];
  return (
    <MainSidebar>
      <div className="page-heading">
        <div>
          <span className="eyebrow">YOUR {role?.toUpperCase()} OVERVIEW</span>
          <h1>
            Welcome back, {user?.name?.split(" ")[0] || "there"}
            <span className="teal">.</span>
          </h1>
          <p>Here’s what’s happening in your squash community.</p>
        </div>
        <Link to={`/${role}/settings`} className="btn outline-button">
          View profile <FiArrowUpRight />
        </Link>
      </div>
      <section className="dashboard-banner">
        <div>
          <span className="eyebrow light">KEEP MOVING FORWARD</span>
          <h2>
            Your next chapter
            <br />
            starts on the court.
          </h2>
          <p>Stay close to your team and make every session count.</p>
          <Link to={`/${role}/${role === "player" ? "trainers" : "players"}`}>
            Manage your connections <FiArrowUpRight />
          </Link>
        </div>
        <GiCourt />
      </section>
      <div className="stat-grid">
        {stats.map(([label, value, Icon]) => (
          <article className="stat-card" key={label}>
            <div>
              <p>{label}</p>
              <strong>{value}</strong>
              <small>From your workspace</small>
            </div>
            <span className="feature-icon">
              <Icon />
            </span>
          </article>
        ))}
      </div>
      {error && (
        <div className="alert alert-warning" role="alert">
          {error}{" "}
          <button
            className="btn btn-sm outline-button"
            onClick={() => setRetry((n) => n + 1)}
          >
            Retry
          </button>
        </div>
      )}
      <div className="dashboard-grid">
        <section className="panel">
          <div className="panel-heading">
            <h3>Tournament updates</h3>
            <FiCalendar />
          </div>
          {loading ? (
            <p role="status">Loading announcements…</p>
          ) : data.tournaments.length ? (
            <div className="tournament-grid">
              {data.tournaments.map((item) => (
                <article className="tournament-card" key={item.docId}>
                  {item.image && (
                    <img src={item.image} alt="Tournament announcement" />
                  )}
                  <p>{item.text}</p>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <FiCalendar />
              <h4>No tournaments announced</h4>
              <p>New club tournament announcements will appear here.</p>
            </div>
          )}
        </section>
        <section className="panel">
          <div className="panel-heading">
            <h3>Club noticeboard</h3>
            <FiMessageSquare />
          </div>
          {loading ? (
            <p role="status">Loading notices…</p>
          ) : data.updates.length ? (
            data.updates.map((item) => (
              <article className="notice" key={item.docId}>
                <span className="status-dot" />
                <div>
                  <small>CLUB UPDATE</small>
                  <p>{item.text}</p>
                </div>
              </article>
            ))
          ) : (
            <div className="empty-state">
              <FiMessageSquare />
              <h4>You’re all caught up</h4>
              <p>Club notices and announcements will appear here.</p>
            </div>
          )}
        </section>
      </div>
    </MainSidebar>
  );
};
const GiCourt = () => (
  <svg
    className="court-art"
    viewBox="0 0 320 200"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M40 180 80 30h160l40 150H40Z M80 30l30 95h100l30-95 M40 180l70-55 M280 180l-70-55 M160 125v55 M65 85h190 M110 125v55 M210 125v55"
      stroke="currentColor"
      strokeWidth="2"
    />
    <circle cx="229" cy="80" r="8" fill="#60e8c2" />
  </svg>
);
