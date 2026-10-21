import { useEffect, useState } from "react";
import { MainSidebar } from "./Sidebar";
import {
  getUpdates,
  getTournments,
  addUpdate,
  addTournment,
  deleteUpdate,
  deleteTournment,
} from "../APIS";
import { FileInput } from "./FilePicker";
import { toast } from "react-toastify";
export const AdminPublications = ({ tournaments = false }) => {
  const [data, setData] = useState([]),
    [text, setText] = useState(""),
    [file, setFile] = useState(null),
    [preview, setPreview] = useState(""),
    [busy, setBusy] = useState(false),
    [loading, setLoading] = useState(true),
    [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    (tournaments ? getTournments : getUpdates)()
      .then((rows) => {
        if (active) setData(rows);
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
  }, [tournaments]);
  useEffect(() => {
    if (!file) {
      setPreview("");
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);
  return (
    <MainSidebar>
      <div className="page-heading">
        <div>
          <span className="eyebrow">CLUB MANAGEMENT</span>
          <h1>{tournaments ? "Tournaments" : "Club updates"}</h1>
          <p>Keep your community informed.</p>
        </div>
      </div>
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      <section className="panel mb-4">
        <h3>Publish an announcement</h3>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (busy || !text.trim()) return;
            if (tournaments && !file)
              return toast.error("Select a tournament image.");
            setBusy(true);
            try {
              const record = await (tournaments ? addTournment : addUpdate)({
                text: text.trim(),
                ...(tournaments ? { image: file } : {}),
              });
              setData((rows) => [record, ...rows]);
              setText("");
              setFile(null);
              toast.success("Announcement published.");
            } catch (error) {
              toast.error(error.message);
            } finally {
              setBusy(false);
            }
          }}
        >
          <label className="form-label" htmlFor="announcement">
            Announcement details
          </label>
          <textarea
            id="announcement"
            required
            maxLength={5000}
            className="form-control mb-3"
            rows={3}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          {tournaments && (
            <>
              <FileInput
                key={data.length}
                name="tournament-image"
                label="Tournament image"
                loading={busy}
                changeHandler={(name, value) => setFile(value)}
              />
              {preview && (
                <img
                  className="announcement-preview"
                  src={preview}
                  alt="Selected tournament artwork"
                />
              )}
            </>
          )}
          <button
            className="btn primary-button"
            disabled={busy || !text.trim()}
            type="submit"
          >
            {busy ? "Publishing…" : "Publish announcement"}
          </button>
        </form>
      </section>
      <section className="panel">
        <h3 className="mb-4">Published announcements</h3>
        {loading ? (
          <p role="status">Loading announcements…</p>
        ) : !data.length ? (
          <div className="empty-state">
            <h4>No announcements yet</h4>
            <p>Publish your first update using the form above.</p>
          </div>
        ) : (
          data.map((row) => (
            <article className="admin-notice" key={row.docId}>
              {row.image && <img src={row.image} alt="Tournament artwork" />}
              <p>{row.text}</p>
              <button
                className="btn btn-outline-danger"
                disabled={busy}
                onClick={async () => {
                  if (!window.confirm("Remove this announcement?")) return;
                  setBusy(true);
                  try {
                    await (tournaments ? deleteTournment : deleteUpdate)(
                      row.docId,
                    );
                    setData((rows) =>
                      rows.filter((item) => item.docId !== row.docId),
                    );
                    toast.success("Announcement removed.");
                  } catch (e) {
                    toast.error(e.message);
                  } finally {
                    setBusy(false);
                  }
                }}
              >
                Remove
              </button>
            </article>
          ))
        )}
      </section>
    </MainSidebar>
  );
};
