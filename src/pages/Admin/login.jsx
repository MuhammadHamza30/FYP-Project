import { useState } from "react";
import { Form, Formik } from "formik";
import * as yup from "yup";
import { Input, Navbar } from "../../components";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { loginAdmin } from "../../APIS";
import { readSession } from "../../utils/session";
export const AdminLogin = () => {
  const [error, setError] = useState("");
  const navigate = useNavigate();
  if (readSession("spms-admin")?.isAuthenticated)
    return <Navigate to="/admin/updates" replace />;
  return (
    <>
      <Navbar />
      <main className="admin-login">
        <section className="panel">
          <span className="eyebrow">CLUB MANAGEMENT</span>
          <h1>Administrator access</h1>
          <p>Manage your community, tournaments, and announcements.</p>
          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={yup.object({
              email: yup.string().email().required(),
              password: yup.string().required(),
            })}
            onSubmit={async (values) => {
              try {
                setError("");
                await loginAdmin(values);
                navigate("/admin/updates", { replace: true });
              } catch (e) {
                setError(e.message);
              }
            }}
          >
            {({ isSubmitting }) => (
              <Form>
                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}
                <Input
                  name="email"
                  label="Email address"
                  type="email"
                  autoComplete="email"
                />
                <Input
                  name="password"
                  label="Password"
                  type="password"
                  autoComplete="current-password"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn primary-button w-100"
                >
                  {isSubmitting ? "Signing in…" : "Sign in as administrator"}
                </button>
              </Form>
            )}
          </Formik>
          <Link to="/login" className="subtle-link">
            Back to member sign in
          </Link>
        </section>
      </main>
    </>
  );
};
