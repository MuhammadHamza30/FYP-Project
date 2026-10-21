import { useState } from "react";
import { Form, Formik } from "formik";
import * as yup from "yup";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Input, Navbar, Footer } from "../components";
import { loginUser } from "../APIS";
import { auth } from "../APIS/config";
import { authHandler } from "../store/reducers";
import { dashboardFor } from "../utils/session";
import { FiArrowUpRight, FiCheck } from "react-icons/fi";
export const Login = () => {
  const [error, setError] = useState("");
  const [resetMessage, setResetMessage] = useState("");
  const [resetting, setResetting] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.user);
  if (user) return <Navigate to={dashboardFor(user)} replace />;
  return (
    <>
      <Navbar />
      <main className="auth-layout">
        <section className="auth-story">
          <span className="eyebrow light">WELCOME BACK TO THE COURT</span>
          <h1>
            Your game.
            <br />
            Your team.
            <br />
            <em>Your workspace.</em>
          </h1>
          <p>
            Pick up where you left off. Your profile, connections, and club
            updates are waiting.
          </p>
          <div className="auth-benefits">
            <span>
              <FiCheck /> One connected player profile
            </span>
            <span>
              <FiCheck /> Trainer and doctor feedback
            </span>
            <span>
              <FiCheck /> Tournament announcements
            </span>
          </div>
        </section>
        <section className="auth-panel">
          <span className="eyebrow">LET’S GET YOU SIGNED IN</span>
          <h2>Welcome back</h2>
          <p>Enter your account details to continue.</p>
          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={yup.object({
              email: yup
                .string()
                .trim()
                .email("Enter a valid email")
                .required("Email is required"),
              password: yup.string().required("Password is required"),
            })}
            onSubmit={async (values) => {
              setError("");
              try {
                const profile = await loginUser(values);
                dispatch(authHandler({ isAuthenticated: true, user: profile }));
                navigate(dashboardFor(profile), { replace: true });
              } catch (e) {
                setError(e.message || "Unable to sign in. Please try again.");
              }
            }}
          >
            {({ isSubmitting, values }) => (
              <Form>
                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}
                <Input
                  label="Email address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                />
                <Input
                  label="Password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Your password"
                />
                {resetMessage && (
                  <div role="status" className="alert alert-info">
                    {resetMessage}
                  </div>
                )}
                <button
                  type="button"
                  className="reset-button"
                  disabled={resetting || isSubmitting}
                  onClick={async () => {
                    if (
                      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())
                    ) {
                      setError(
                        "Enter your email address before requesting a reset.",
                      );
                      return;
                    }
                    setResetting(true);
                    setError("");
                    setResetMessage("");
                    try {
                      await auth.sendPasswordResetEmail(values.email.trim());
                      setResetMessage(
                        "If this email has an account, a password reset link will be sent.",
                      );
                    } catch {
                      setError(
                        "Unable to request a reset. Check your email and try again later.",
                      );
                    } finally {
                      setResetting(false);
                    }
                  }}
                >
                  {resetting ? "Requesting reset…" : "Forgot your password?"}
                </button>
                <button
                  className="btn primary-button w-100 mt-2"
                  disabled={isSubmitting}
                  type="submit"
                >
                  {isSubmitting ? (
                    "Signing in…"
                  ) : (
                    <>
                      Sign in <FiArrowUpRight />
                    </>
                  )}
                </button>
              </Form>
            )}
          </Formik>
          <div className="auth-switch">
            New to SPMS? <Link to="/register">Create an account</Link>
          </div>
          <Link className="subtle-link" to="/admin">
            Administrator sign in
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
};
