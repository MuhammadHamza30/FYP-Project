import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { MainSidebar } from "./Sidebar";
import { HealthData } from "./HealthData";
import { getUser, addFeedbackIntoDB, addTrainerFeedbackIntoDB } from "../APIS";
import { toast } from "react-toastify";
export const ProfessionalHealth = ({ role }) => {
  const { state } = useLocation();
  const { user } = useSelector((s) => s.user);
  const [allowed, setAllowed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [text, setText] = useState("");
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    let active = true;
    setChecking(true);
    if (!state) {
      setChecking(false);
      return;
    }
    getUser(state)
      .then((player) => {
        const access =
          role === "doctor"
            ? player?.doctors?.includes(user.docId)
            : player?.trainers?.some(
                (item) =>
                  item.userId === user.docId &&
                  item.isConfirmed &&
                  item.viewHealthData,
              );
        if (active) setAllowed(!!access);
      })
      .catch(() => {
        if (active) setAllowed(false);
      })
      .finally(() => {
        if (active) setChecking(false);
      });
    return () => {
      active = false;
    };
  }, [state, user.docId, role]);
  return (
    <MainSidebar>
      {checking ? (
        <p role="status">Checking player access…</p>
      ) : !allowed ? (
        <section className="panel empty-state">
          <h2>Select an authorized player</h2>
          <p>
            This player has not shared health access with you, or no player was
            selected.
          </p>
          <Link to={`/${role}/players`} className="btn primary-button">
            Back to players
          </Link>
        </section>
      ) : (
        <>
          <HealthData playerId={state} />
          <section className="panel mt-4">
            <h3>Share feedback</h3>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (saving || !text.trim()) return;
                setSaving(true);
                try {
                  await (
                    role === "doctor"
                      ? addFeedbackIntoDB
                      : addTrainerFeedbackIntoDB
                  )(text.trim(), state);
                  setText("");
                  toast.success("Feedback shared.");
                } catch (error) {
                  toast.error(error.message);
                } finally {
                  setSaving(false);
                }
              }}
            >
              <label className="form-label" htmlFor="feedback">
                Your feedback for the player
              </label>
              <textarea
                className="form-control mb-3"
                id="feedback"
                rows={4}
                value={text}
                onChange={(e) => setText(e.target.value)}
                required
                maxLength={3000}
              />
              <button
                className="btn primary-button"
                disabled={saving || !text.trim()}
              >
                {saving ? "Saving…" : "Share feedback"}
              </button>
            </form>
          </section>
        </>
      )}
    </MainSidebar>
  );
};
