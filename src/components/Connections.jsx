import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MainSidebar } from "./Sidebar";
import { getDirectory, getUser, updateConnection } from "../APIS";
import { authHandler } from "../store/reducers";
import { toast } from "react-toastify";
export const Connections = ({ role }) => {
  const { user } = useSelector((s) => s.user);
  const dispatch = useDispatch();
  const [data, setData] = useState([]),
    [profile, setProfile] = useState(null),
    [loading, setLoading] = useState(true),
    [error, setError] = useState(""),
    [pending, setPending] = useState(null),
    [revision, setRevision] = useState(0),
    [search, setSearch] = useState("");
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    Promise.all([getDirectory(), getUser(user.docId)])
      .then(([directory, current]) => {
        if (!current) throw new Error("Your profile is unavailable.");
        if (active) {
          setData(directory.filter((row) => row.occupation === role));
          setProfile(current);
        }
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
  const action = async (id, action) => {
    if (pending) return;
    setPending(id);
    try {
      await updateConnection(user.docId, id, role, action);
      const current = await getUser(user.docId);
      setProfile(current);
      sessionStorage.setItem("spms-user", JSON.stringify(current));
      dispatch(authHandler({ isAuthenticated: true, user: current }));
      toast.success("Connection updated.");
    } catch (e) {
      toast.error(e.message);
    } finally {
      setPending(null);
    }
  };
  const connected = (id) =>
    role === "Doctor"
      ? profile?.doctors?.includes(id)
      : profile?.trainers?.some((row) => row.userId === id);
  const feedback =
    profile?.[role === "Doctor" ? "doctorFeedbacks" : "trainerFeedbacks"] || [];
  const visible = data.filter((row) =>
    (row.name || "").toLowerCase().includes(search.toLowerCase()),
  );
  const renderCard = (person) => {
    const relation = profile?.trainers?.find(
      (row) => row.userId === person.docId,
    );
    const selected = connected(person.docId);
    return (
      <article className="professional-card" key={person.docId}>
        <div className="profile-photo">
          {person.image ? (
            <img src={person.image} alt="" />
          ) : (
            <span>{person.name?.[0]}</span>
          )}
        </div>
        <span className="eyebrow">{role}</span>
        <h3>{person.name}</h3>
        <p>
          {person.specialization || person.level || "SPMS community member"}
        </p>
        {person.experience && <p>Experience: {person.experience}</p>}
        {person.clinicAddress && <p>{person.clinicAddress}</p>}
        {selected && (
          <span className="connection-status">
            {role === "Doctor"
              ? "Health access shared"
              : relation?.isConfirmed
                ? "Request accepted"
                : "Awaiting trainer confirmation"}
          </span>
        )}
        <div className="connection-actions">
          {!selected ? (
            <button
              className="btn primary-button"
              disabled={!!pending}
              onClick={() => action(person.docId, "add")}
            >
              {pending === person.docId
                ? "Saving…"
                : role === "Doctor"
                  ? "Connect & share health access"
                  : "Request trainer"}
            </button>
          ) : (
            <>
              {role === "Trainer" && (
                <button
                  className="btn outline-button"
                  disabled={!!pending || relation?.viewHealthData}
                  onClick={() => action(person.docId, "grant")}
                >
                  {relation?.viewHealthData
                    ? "Health access shared"
                    : "Share health access"}
                </button>
              )}
              <button
                className="btn btn-outline-danger"
                disabled={!!pending}
                onClick={() => {
                  if (
                    window.confirm(`Remove ${person.name} and revoke access?`)
                  )
                    action(person.docId, "remove");
                }}
              >
                Remove
              </button>
            </>
          )}
        </div>
      </article>
    );
  };
  return (
    <MainSidebar>
      <div className="page-heading">
        <div>
          <span className="eyebrow">YOUR SUPPORT TEAM</span>
          <h1>My {role.toLowerCase()}s</h1>
          <p>
            {role === "Doctor"
              ? "Connect with doctors and manage shared health access."
              : "Find a trainer, manage requests, and control health access."}
          </p>
        </div>
        <input
          className="form-control search-control"
          placeholder="Search by name…"
          aria-label="Search profiles"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      {loading ? (
        <p role="status">Loading your connections…</p>
      ) : error ? (
        <div className="alert alert-danger" role="alert">
          {error}{" "}
          <button
            className="btn outline-button"
            onClick={() => setRevision((n) => n + 1)}
          >
            Retry
          </button>
        </div>
      ) : (
        <>
          <h3 className="section-title">Your connections</h3>
          <div className="professional-grid">
            {visible.filter((row) => connected(row.docId)).map(renderCard)}
          </div>
          {!visible.some((row) => connected(row.docId)) && (
            <div className="panel empty-state">
              <h4>No connections to show</h4>
              <p>Connect with a {role.toLowerCase()} below to get started.</p>
            </div>
          )}
          <h3 className="section-title">Discover {role.toLowerCase()}s</h3>
          <div className="professional-grid">
            {visible.filter((row) => !connected(row.docId)).map(renderCard)}
          </div>
          {!visible.some((row) => !connected(row.docId)) && (
            <p className="text-muted">No additional profiles to show.</p>
          )}
          <section className="panel mt-4">
            <h3>Feedback from your {role.toLowerCase()}s</h3>
            {feedback.length ? (
              feedback.map((text, i) => (
                <div className="notice" key={i}>
                  <p>{text}</p>
                </div>
              ))
            ) : (
              <p className="text-muted mb-0">No feedback shared yet.</p>
            )}
          </section>
        </>
      )}
    </MainSidebar>
  );
};
