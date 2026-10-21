import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { getDirectory } from "../APIS";
import { FiSearch, FiArrowUpRight, FiUsers } from "react-icons/fi";
export const Directory = ({ role }) => {
  const [data, setData] = useState([]),
    [search, setSearch] = useState(""),
    [loading, setLoading] = useState(true),
    [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    getDirectory()
      .then((rows) => {
        if (active) setData(rows.filter((row) => row.occupation === role));
      })
      .catch(() => {
        if (active)
          setError("The directory is unavailable. Please try again later.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [role]);
  const filtered = data.filter((row) =>
    `${row.name} ${row.level || ""} ${row.specialization || ""}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );
  return (
    <>
      <Navbar />
      <main className="directory-wrap">
        <header className="directory-heading">
          <span className="eyebrow">YOUR SUPPORT TEAM</span>
          <h1>
            {role === "Trainer"
              ? "A better game starts with guidance."
              : "Support for life on the court."}
          </h1>
          <p>
            {role === "Trainer"
              ? "Discover the trainers in the SPMS community."
              : "Meet the doctors in the SPMS community."}
          </p>
        </header>
        <div className="directory-toolbar">
          <h3>
            {role}s{" "}
            <span className="count-badge">{loading ? "…" : data.length}</span>
          </h3>
          <div className="search-input">
            <FiSearch />
            <input
              aria-label={`Search ${role.toLowerCase()}s`}
              placeholder={`Search ${role.toLowerCase()}s…`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        {error ? (
          <div className="alert alert-warning" role="alert">
            {error}
          </div>
        ) : loading ? (
          <p role="status">Loading the directory…</p>
        ) : filtered.length ? (
          <div className="professional-grid">
            {filtered.map((person) => (
              <article className="professional-card" key={person.docId}>
                <div className="profile-photo">
                  {person.image ? (
                    <img src={person.image} alt={person.name} />
                  ) : (
                    <span>{person.name?.[0] || "?"}</span>
                  )}
                </div>
                <span className="eyebrow">{role}</span>
                <h3>{person.name}</h3>
                <p>
                  {person.specialization ||
                    person.level ||
                    "SPMS community member"}
                </p>
                {person.experience && (
                  <small>{person.experience} · Experience</small>
                )}
                <Link to="/login">
                  Connect from your workspace <FiArrowUpRight />
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <section className="panel empty-state">
            <FiUsers />
            <h3>
              {search ? "No matching profiles" : "No profiles available yet"}
            </h3>
            <p>
              {search
                ? "Try another name or specialization."
                : "Registered professionals will appear here."}
            </p>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
};
