import { useEffect, useState } from "react";
import { NavLink, Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { authHandler } from "../../store/reducers";
import { auth } from "../../APIS/config";
import { roleOf } from "../../utils/session";
import {
  FiGrid,
  FiHeart,
  FiUsers,
  FiSettings,
  FiLogOut,
  FiMenu,
  FiX,
  FiCalendar,
  FiZap,
  FiFileText,
  FiArrowUpRight,
} from "react-icons/fi";
import { GiTennisRacket } from "react-icons/gi";
const menus = {
  player: [
    ["Overview", "dashboard", FiGrid],
    ["Health data", "health-data", FiHeart],
    ["My trainers", "trainers", FiUsers],
    ["My doctors", "doctors", FiHeart],
    ["AI assistant", "ai-helper", FiZap],
    ["Settings", "settings", FiSettings],
  ],
  trainer: [
    ["Overview", "dashboard", FiGrid],
    ["My players", "players", FiUsers],
    ["Settings", "settings", FiSettings],
  ],
  doctor: [
    ["Overview", "dashboard", FiGrid],
    ["My players", "players", FiUsers],
    ["Settings", "settings", FiSettings],
  ],
  admin: [
    ["Updates", "updates", FiFileText],
    ["Tournaments", "tournments", FiCalendar],
    ["Players", "players", FiUsers],
    ["Trainers", "trainers", FiUsers],
    ["Doctors", "doctors", FiHeart],
  ],
};
export const MainSidebar = ({ children }) => {
  const { user } = useSelector((s) => s.user);
  const location = useLocation();
  const role = location.pathname.startsWith("/admin/")
    ? "admin"
    : roleOf(user) || "player";
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);
  useEffect(() => {
    const close = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);
  const title =
    menus[role].find(([, path]) =>
      location.pathname.includes("/" + path),
    )?.[0] || "Player health";
  const logout = async () => {
    await auth.signOut().catch(() => {});
    sessionStorage.removeItem("spms-user");
    sessionStorage.removeItem("spms-admin");
    dispatch(authHandler({ isAuthenticated: false, user: null }));
    navigate(role === "admin" ? "/admin" : "/login", { replace: true });
  };
  return (
    <div className="app-shell">
      {open && (
        <button
          className="sidebar-backdrop"
          aria-label="Close navigation"
          onClick={() => setOpen(false)}
        />
      )}
      <aside className={`app-sidebar ${open ? "is-open" : ""}`}>
        <Link to="/" className="brand">
          <span className="brand-mark">
            <GiTennisRacket />
          </span>
          SPMS
        </Link>
        <button
          className="mobile-close icon-button"
          onClick={() => setOpen(false)}
          aria-label="Close menu"
        >
          <FiX />
        </button>
        <div className="workspace-label">{role} workspace</div>
        <nav aria-label="Workspace navigation">
          {menus[role].map(([label, path, Icon]) => (
            <NavLink
              key={path}
              to={`/${role}/${path}`}
              end={path === "players"}
            >
              <Icon />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-note">
          <GiTennisRacket />
          <strong>Your next level starts here.</strong>
          <p>Stay connected. Keep improving.</p>
          <Link to="/">
            Explore SPMS <FiArrowUpRight />
          </Link>
        </div>
        <div className="sidebar-account">
          <div className="avatar">
            {user?.image && role !== "admin" ? (
              <img src={user.image} alt="" />
            ) : role === "admin" ? (
              "A"
            ) : (
              user?.name?.[0] || "S"
            )}
          </div>
          <div>
            <strong>{role === "admin" ? "Administrator" : user?.name}</strong>
            <small>{role} account</small>
          </div>
          <button
            aria-label="Sign out"
            title="Sign out"
            className="icon-button"
            onClick={logout}
          >
            <FiLogOut />
          </button>
        </div>
      </aside>
      <div className="workspace">
        <header className="workspace-topbar">
          <div className="d-flex align-items-center gap-3">
            <button
              aria-label="Open menu"
              aria-expanded={open}
              className="mobile-menu icon-button"
              onClick={() => setOpen(true)}
            >
              <FiMenu />
            </button>
            <span className="breadcrumb-label">
              Workspace <span>/</span> <strong>{title}</strong>
            </span>
          </div>
          <span className="today-label">
            {new Date().toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </header>
        <main id="main-content" className="workspace-content">
          {children}
        </main>
        <footer className="workspace-footer">
          SPMS · Squash Player Management System<span>Built for the game.</span>
        </footer>
      </div>
    </div>
  );
};
