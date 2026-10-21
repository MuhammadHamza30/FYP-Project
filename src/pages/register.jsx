import { Formik, Form } from "formik";
import * as yup from "yup";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input, Select, Navbar, Footer } from "../components";
import { registerUser } from "../APIS";
const initial = {
  name: "",
  fatherName: "",
  dob: "",
  cnic: "",
  gender: "",
  city: "",
  phoneNumber: "",
  address: "",
  occupation: "Player",
  postalCode: "",
  email: "",
  password: "",
  confirmPassword: "",
  level: "",
  medal: "",
  height: "",
  weight: "",
  experience: "",
  achivement: "",
  specialization: "",
  clinicPhoneNumber: "",
  clinicTiming: "",
  clinicAddress: "",
  weekend: "",
  imageFile: null,
};
const schema = yup.object({
  name: yup.string().trim().required("Name is required"),
  fatherName: yup.string().trim().required("Father’s name is required"),
  dob: yup
    .date()
    .max(new Date(), "Birth date cannot be in the future")
    .required("Birth date is required"),
  cnic: yup
    .string()
    .matches(/^\d{5}-?\d{7}-?\d$/, "Enter a 13 digit CNIC or B-form number")
    .required("CNIC is required"),
  gender: yup.string().required("Choose a gender"),
  city: yup.string().trim().required("City is required"),
  phoneNumber: yup
    .string()
    .matches(/^\+?[\d\s()-]{7,20}$/, "Enter a valid phone number")
    .required("Phone number is required"),
  address: yup.string().trim().required("Address is required"),
  occupation: yup.string().oneOf(["Player", "Trainer", "Doctor"]).required(),
  email: yup
    .string()
    .trim()
    .email("Enter a valid email")
    .required("Email is required"),
  password: yup
    .string()
    .min(8, "Use at least 8 characters")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm your password"),
});
export const Registeration = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  return (
    <>
      <Navbar />
      <main className="registration-wrap">
        <div className="registration-heading">
          <span className="eyebrow">BECOME PART OF THE GAME</span>
          <h1>Your journey starts here.</h1>
          <p>Create your player, trainer, or doctor profile.</p>
        </div>
        <Formik
          initialValues={initial}
          validationSchema={schema}
          onSubmit={async (values) => {
            setError("");
            try {
              await registerUser(values);
              navigate("/login");
            } catch (e) {
              setError(e.message || "Unable to create your account.");
            }
          }}
        >
          {({ values, setFieldValue, isSubmitting }) => (
            <Form className="panel registration-form">
              {error && (
                <div role="alert" className="alert alert-danger">
                  {error}
                </div>
              )}
              <section>
                <div className="form-section-title">
                  <span>01</span>
                  <div>
                    <h3>Personal information</h3>
                    <p>Let’s start with the essentials.</p>
                  </div>
                </div>
                <div className="form-grid">
                  <Input name="name" label="Full name" autoComplete="name" />
                  <Input name="fatherName" label="Father’s name" />
                  <Input
                    name="dob"
                    type="date"
                    label="Date of birth"
                    max={new Date().toISOString().slice(0, 10)}
                  />
                  <Input
                    name="cnic"
                    label="CNIC / B-form"
                    placeholder="13 digits"
                  />
                  <Select
                    name="gender"
                    label="Gender"
                    searchKey="name"
                    searchValue="name"
                    data={[
                      { name: "Male" },
                      { name: "Female" },
                      { name: "Other" },
                    ]}
                  />
                  <Input
                    name="phoneNumber"
                    type="tel"
                    label="Phone number"
                    autoComplete="tel"
                  />
                  <Input
                    name="city"
                    label="City"
                    autoComplete="address-level2"
                  />
                  <Input
                    name="postalCode"
                    label="Postal code (optional)"
                    autoComplete="postal-code"
                  />
                  <Input
                    name="address"
                    label="Address"
                    autoComplete="street-address"
                  />
                  <div>
                    <label className="form-label" htmlFor="profile-image">
                      Profile photo (optional)
                    </label>
                    <input
                      id="profile-image"
                      className="form-control"
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (
                          file &&
                          (!["image/jpeg", "image/png", "image/webp"].includes(
                            file.type,
                          ) ||
                            file.size > 5 * 1024 * 1024)
                        ) {
                          setError(
                            "Choose a JPG, PNG, or WebP image under 5 MB.",
                          );
                          e.target.value = "";
                          setFieldValue("imageFile", null);
                          return;
                        }
                        setError("");
                        setFieldValue("imageFile", file || null);
                      }}
                    />
                    <small>JPG, PNG, or WebP · up to 5 MB</small>
                  </div>
                </div>
              </section>
              <section>
                <div className="form-section-title">
                  <span>02</span>
                  <div>
                    <h3>Your role in the game</h3>
                    <p>Build a profile that fits you.</p>
                  </div>
                </div>
                <div className="role-options">
                  {["Player", "Trainer", "Doctor"].map((role) => (
                    <button
                      type="button"
                      className={values.occupation === role ? "selected" : ""}
                      key={role}
                      onClick={() => setFieldValue("occupation", role)}
                      aria-pressed={values.occupation === role}
                    >
                      {role}
                    </button>
                  ))}
                </div>
                <div className="form-grid">
                  {(values.occupation === "Player"
                    ? [
                        ["level", "Playing level"],
                        ["height", "Height (cm)"],
                        ["weight", "Weight (kg)"],
                        ["medal", "Medals / achievements"],
                      ]
                    : values.occupation === "Trainer"
                      ? [
                          ["level", "Coaching level"],
                          ["experience", "Experience"],
                          ["achivement", "Achievements"],
                        ]
                      : [
                          ["specialization", "Specialization"],
                          ["experience", "Experience"],
                          ["clinicPhoneNumber", "Clinic phone number"],
                          ["clinicTiming", "Clinic hours"],
                          ["clinicAddress", "Clinic address"],
                          ["weekend", "Days off"],
                        ]
                  ).map(([name, label]) => (
                    <Input
                      key={name}
                      name={name}
                      label={label + " (optional)"}
                    />
                  ))}
                </div>
              </section>
              <section>
                <div className="form-section-title">
                  <span>03</span>
                  <div>
                    <h3>Account details</h3>
                    <p>
                      Your credentials are managed by Firebase Authentication.
                    </p>
                  </div>
                </div>
                <div className="form-grid">
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
                    autoComplete="new-password"
                  />
                  <Input
                    name="confirmPassword"
                    label="Confirm password"
                    type="password"
                    autoComplete="new-password"
                  />
                </div>
              </section>
              <div className="form-actions">
                <p>
                  Already registered? <Link to="/login">Sign in</Link>
                </p>
                <button
                  type="submit"
                  className="btn primary-button"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? "Creating your account…"
                    : "Create account ↗"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </main>
      <Footer />
    </>
  );
};
