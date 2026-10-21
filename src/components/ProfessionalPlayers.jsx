import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { MainSidebar } from "./Sidebar";
import {
  getSelectedPlayers,
  getDoctorSelectedPlayers,
  getUser,
  updateConnection,
} from "../APIS";
import { authHandler } from "../store/reducers";
import { toast } from "react-toastify";
export const ProfessionalPlayers = ({ role }) => {
  const { user } = useSelector((s) => s.user);
  const dispatch = useDispatch();
  const [data, setData] = useState([]),
    [error, setError] = useState(""),
    [loading, setLoading] = useState(true),
    [pending, setPending] = useState(null),
    [revision, setRevision] = useState(0),
    [search, setSearch] = useState("");
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    (role === "trainer" ? getSelectedPlayers : getDoctorSelectedPlayers)(
      user.docId,
    )
      .then((result) => {
        if (active)
          setData(
            role === "trainer"
              ? result.data
              : result.data.map((player) => ({
                  user: player,
                  isConfirmed: true,
                  viewHealthData: true,
                })),
          );
      })
      .catch((e) => {
        if (active) setError(e.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [user.docId, role, revision]);
  const change = async (id, action) => {
    setPending(id);
    try {
      await updateConnection(
        id,
        user.docId,
        role === "trainer" ? "Trainer" : "Doctor",
        action,
      );
      const current = await getUser(user.docId);
      sessionStorage.setItem("spms-user", JSON.stringify(current));
      dispatch(authHandler({ isAuthenticated: true, user: current }));
      setRevision((n) => n + 1);
      toast.success("Connection updated.");
    } catch (e) {
      toast.error(e.message);
    } finally {
      setPending(null);
    }
  };
  const filtered = data.filter((row) =>
    (row.user.name || "").toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <MainSidebar>
      <div className="page-heading">
        <div>
          <span className="eyebrow">YOUR PLAYER NETWORK</span>
          <h1>My players</h1>
          <p>
            {role === "trainer"
              ? "Review connection requests and support your players."
              : "Review the players who have shared access with you."}
          </p>
        </div>
        <input
          aria-label="Search players"
          placeholder="Search players…"
          className="form-control search-control"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      {loading ? (
        <p role="status">Loading your players…</p>
      ) : error ? (
        <div className="alert alert-danger">
          {error}{" "}
          <button
            className="btn outline-button"
            onClick={() => setRevision((n) => n + 1)}
          >
            Retry
          </button>
        </div>
      ) : filtered.length ? (
        <div className="professional-grid">
          {filtered.map((row) => (
            <article className="professional-card" key={row.user.docId}>
              <div className="profile-photo">
                {row.user.image ? (
                  <img src={row.user.image} alt="" />
                ) : (
                  <span>{row.user.name?.[0]}</span>
                )}
              </div>
              <span className="eyebrow">
                {row.isConfirmed ? "CONNECTED PLAYER" : "NEW REQUEST"}
              </span>
              <h3>{row.user.name}</h3>
              <p>{row.user.level || "Player"}</p>
              <div className="player-details">
                <span>
                  Age <strong>{row.user.age || "—"}</strong>
                </span>
                <span>
                  Height <strong>{row.user.height || "—"}</strong>
                </span>
                <span>
                  Weight <strong>{row.user.weight || "—"}</strong>
                </span>
              </div>
              <div className="connection-actions">
                {!row.isConfirmed && (
                  <button
                    disabled={!!pending}
                    className="btn primary-button"
                    onClick={() => change(row.user.docId, "confirm")}
                  >
                    Accept request
                  </button>
                )}
                {row.isConfirmed && row.viewHealthData ? (
                  <Link
                    className="btn outline-button"
                    to={`/${role}/players/health-data`}
                    state={row.user.docId}
                  >
                    View health & feedback
                  </Link>
                ) : (
                  <small>Health access is not shared yet.</small>
                )}
                {role === "trainer" && (
                  <button
                    className="btn btn-outline-danger"
                    disabled={!!pending}
                    onClick={() => {
                      if (window.confirm("Remove this player connection?"))
                        change(row.user.docId, "remove");
                    }}
                  >
                    Remove
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="panel empty-state">
          <h3>No players to show</h3>
          <p>Player connections and incoming requests will appear here.</p>
        </div>
      )}
    </MainSidebar>
  );
};
