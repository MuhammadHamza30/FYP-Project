import { useEffect, useState } from "react";
import { MainSidebar } from "./Sidebar";
import { deleteUser, getUsers } from "../APIS";
import { toast } from "react-toastify";
export const AdminUsers = ({ role }) => {
  const [data, setData] = useState([]),
    [loading, setLoading] = useState(true),
    [error, setError] = useState(""),
    [pending, setPending] = useState(null),
    [search, setSearch] = useState("");
  useEffect(() => {
    let active = true;
    getUsers()
      .then((rows) => {
        if (active) setData(rows.filter((row) => row.occupation === role));
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
  }, [role]);
  const filtered = data.filter((row) =>
    `${row.name} ${row.email}`.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <MainSidebar>
      <div className="page-heading">
        <div>
          <span className="eyebrow">COMMUNITY DIRECTORY</span>
          <h1>{role}s</h1>
          <p>Review and manage registered {role.toLowerCase()} profiles.</p>
        </div>
        <input
          className="form-control search-control"
          placeholder="Search name or email…"
          aria-label="Search users"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <section className="panel">
        {error ? (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        ) : loading ? (
          <p role="status">Loading profiles…</p>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>City</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((person) => (
                  <tr key={person.docId}>
                    <td>
                      <strong>{person.name}</strong>
                    </td>
                    <td>{person.email}</td>
                    <td>{person.city || "—"}</td>
                    <td>
                      <button
                        disabled={!!pending}
                        className="btn btn-sm btn-outline-danger"
                        onClick={async () => {
                          if (
                            !window.confirm(
                              `Remove ${person.name}’s profile and connections? Firebase sign-in account deletion is a separate administrator action.`,
                            )
                          )
                            return;
                          setPending(person.docId);
                          try {
                            await deleteUser(person.docId);
                            setData((rows) =>
                              rows.filter((row) => row.docId !== person.docId),
                            );
                            toast.success("Profile removed.");
                          } catch (e) {
                            toast.error(e.message);
                          } finally {
                            setPending(null);
                          }
                        }}
                      >
                        {pending === person.docId
                          ? "Removing…"
                          : "Remove profile"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!filtered.length && (
              <div className="empty-state">
                <h4>No profiles to show</h4>
                <p>Try another search or wait for new registrations.</p>
              </div>
            )}
          </div>
        )}
      </section>
    </MainSidebar>
  );
};
