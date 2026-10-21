import { Formik, Form } from "formik";
import * as yup from "yup";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MainSidebar } from "./Sidebar";
import { Input } from "./Input";
import { FileInput } from "./FilePicker";
import { updateUser, uploadFile } from "../APIS";
import { authHandler } from "../store/reducers";
import { ageFromDate, roleOf } from "../utils/session";
import { toast } from "react-toastify";
export const Settings = () => {
  const { user } = useSelector((s) => s.user);
  const dispatch = useDispatch();
  const role = roleOf(user);
  const [image, setImage] = useState(user.image || "");
  const [uploading, setUploading] = useState(false);
  const fields = [
    ["name", "Full name"],
    ["fatherName", "Father’s name"],
    ["dob", "Date of birth", "date"],
    ["cnic", "CNIC / B-form"],
    ["gender", "Gender"],
    ["city", "City"],
    ["phoneNumber", "Phone number", "tel"],
    ["address", "Address"],
    ["postalCode", "Postal code"],
  ];
  const extra =
    role === "player"
      ? [
          ["level", "Playing level"],
          ["medal", "Medals / achievements"],
          ["height", "Height (cm)"],
          ["weight", "Weight (kg)"],
        ]
      : role === "trainer"
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
          ];
  const initial = Object.fromEntries(
    [...fields, ...extra].map(([name]) => [name, user[name] || ""]),
  );
  return (
    <MainSidebar>
      <div className="page-heading">
        <div>
          <span className="eyebrow">MAKE IT YOURS</span>
          <h1>Profile & settings</h1>
          <p>Keep your details current and manage your account.</p>
        </div>
      </div>
      <section className="panel">
        <h3 className="mb-4">Personal information</h3>
        <div className="settings-photo">
          <div className="profile-photo">
            {image ? (
              <img src={image} alt="Your profile" />
            ) : (
              <span>{user.name?.[0]}</span>
            )}
          </div>
          <FileInput
            name="profile-photo"
            label="Profile photo"
            loading={uploading}
            changeHandler={async (name, file) => {
              setUploading(true);
              try {
                setImage(await uploadFile(file));
              } catch (e) {
                toast.error(e.message);
              } finally {
                setUploading(false);
              }
            }}
          />
        </div>
        <Formik
          initialValues={initial}
          validationSchema={yup.object({
            name: yup.string().trim().required("Name is required"),
            dob: yup
              .date()
              .max(new Date(), "Birth date cannot be in the future")
              .required("Birth date is required"),
          })}
          onSubmit={async (values) => {
            try {
              const age = ageFromDate(values.dob);
              const profile = await updateUser(
                { ...values, image, age: String(age) },
                user.docId,
              );
              dispatch(authHandler({ isAuthenticated: true, user: profile }));
              toast.success("Profile saved.");
            } catch (e) {
              toast.error(e.message);
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="form-grid">
                {fields.map(([name, label, type]) => (
                  <Input
                    key={name}
                    name={name}
                    label={label}
                    type={type || "text"}
                  />
                ))}
              </div>
              <hr />
              <h3 className="mb-4">{user.occupation} information</h3>
              <div className="form-grid">
                {extra.map(([name, label]) => (
                  <Input key={name} name={name} label={label} />
                ))}
              </div>
              <div className="text-end">
                <button
                  className="btn primary-button"
                  type="submit"
                  disabled={isSubmitting || uploading}
                >
                  {isSubmitting ? "Saving…" : "Save profile"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </section>
      <section className="panel mt-4">
        <h3>Account security</h3>
        <p className="small">
          Signed in as {user.email}. Recent authentication may be required to
          change your password.
        </p>
        <Formik
          initialValues={{ password: "", confirmPassword: "" }}
          validationSchema={yup.object({
            password: yup
              .string()
              .min(8, "Use at least 8 characters")
              .required("Password is required"),
            confirmPassword: yup
              .string()
              .oneOf([yup.ref("password")], "Passwords must match")
              .required("Confirm your password"),
          })}
          onSubmit={async (values, { resetForm }) => {
            try {
              await updateUser({ password: values.password }, user.docId);
              resetForm();
              toast.success("Password updated.");
            } catch (e) {
              toast.error(
                e.code === "auth/requires-recent-login"
                  ? "Sign out and sign in again before changing your password."
                  : e.message,
              );
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="form-grid">
                <Input
                  name="password"
                  label="New password"
                  type="password"
                  autoComplete="new-password"
                />
                <Input
                  name="confirmPassword"
                  label="Confirm new password"
                  type="password"
                  autoComplete="new-password"
                />
              </div>
              <button
                type="submit"
                className="btn outline-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Updating…" : "Update password"}
              </button>
            </Form>
          )}
        </Formik>
      </section>
    </MainSidebar>
  );
};
