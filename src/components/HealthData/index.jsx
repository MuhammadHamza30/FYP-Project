import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getUser } from "../../APIS";
import { FiHeart, FiActivity, FiThermometer } from "react-icons/fi";
export const HealthData = ({ playerId }) => {
  const { user } = useSelector((s) => s.user);
  const [records, setRecords] = useState([]);
  const [date, setDate] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    getUser(playerId || user?.docId)
      .then((profile) => {
        if (!profile) throw new Error("Player not found");
        if (active)
          setRecords(
            Array.isArray(profile.healthRecords) ? profile.healthRecords : [],
          );
      })
      .catch(() => {
        if (active) setError("Unable to load health records.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [playerId, user?.docId]);
  const sorted = [...records].sort((a, b) =>
    String(b.date).localeCompare(String(a.date)),
  );
  const filtered = date
    ? sorted.filter((row) => String(row.date).slice(0, 10) === date)
    : sorted;
  const latest = filtered[0];
  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow">PLAYER WELLBEING</span>
          <h1>Health overview</h1>
          <p>Recorded measurements and feedback from your support team.</p>
        </div>
      </div>
      <div className="stat-grid">
        {[
          ["Heart rate", latest?.heartBeat, "bpm", FiHeart],
          ["Steps", latest?.steps, "steps", FiActivity],
          ["Temperature", latest?.temperature, "°F", FiThermometer],
        ].map(([label, value, unit, Icon]) => (
          <article className="stat-card" key={label}>
            <div>
              <p>{label}</p>
              <strong>{loading ? "…" : (value ?? "—")}</strong>
              <small>{value != null ? unit : "No recorded measurement"}</small>
            </div>
            <span className="feature-icon">
              <Icon />
            </span>
          </article>
        ))}
      </div>
      <section className="panel">
        <div className="panel-heading flex-wrap gap-3">
          <h3>Measurement history</h3>
          <div className="d-flex gap-2 align-items-center">
            <label htmlFor="health-date">Filter by date</label>
            <input
              id="health-date"
              type="date"
              className="form-control"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            {date && (
              <button
                className="btn outline-button"
                onClick={() => setDate("")}
              >
                Clear
              </button>
            )}
          </div>
        </div>
        {error ? (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        ) : loading ? (
          <p role="status">Loading records…</p>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Heart rate (bpm)</th>
                  <th>Steps</th>
                  <th>Temperature (°F)</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((row, index) => (
                  <tr key={`${row.date}-${index}`}>
                    <td>{row.date}</td>
                    <td>{row.heartBeat ?? "—"}</td>
                    <td>{row.steps ?? "—"}</td>
                    <td>{row.temperature ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!filtered.length && (
              <div className="empty-state">
                <FiActivity />
                <h4>
                  {date
                    ? "No records for this date"
                    : "No measurements recorded yet"}
                </h4>
                <p>
                  Health records will appear when a data source is connected. No
                  sensor integration is included in this project.
                </p>
              </div>
            )}
          </div>
        )}
      </section>
    </>
  );
};
