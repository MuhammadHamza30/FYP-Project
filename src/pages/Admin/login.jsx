import { useState } from "react";
import { Form, Formik } from "formik";
import * as yup from "yup";
import { Input } from "../../components";
import { toast } from "react-toastify";
import { Button, Card, Container } from "react-bootstrap";
import Spinner from "react-bootstrap/Spinner";
import { useNavigate } from "react-router-dom";
import { loginAdmin } from "../../APIS";
// import { loginAdmin } from "../APIS";

export const AdminLogin = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [state] = useState({
    email: "",
    password: "",
  });

  const admmin = sessionStorage.getItem("spms-admin");

  const validations = yup.object().shape({
    email: yup.string().email().required(),
    password: yup.string().min(6).required(),
  });

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const res = await loginAdmin(values);
      if (res) {
        const payload = {
          isAuthenticated: true,
        };
        sessionStorage.setItem("spms-admin", JSON.stringify(payload))
        navigate("/admin/updates");
        toast.success("Login successfully!");
      }
      setLoading(false);
    } catch (error ) {
      setLoading(false);
      toast.error(error?.message);
    }
  };

  if (admmin) {
    navigate("/admin/updates");
    return <></>;
  }

  return (
    <Container className="login-container">
      <Card>
        <Card.Body>
          <Formik
            initialValues={state}
            validationSchema={validations}
            onSubmit={handleSubmit}
          >
            {() => (
              <>
                <Form>
                  <h3 className="mb-4">Admin Login</h3>
                  <Input
                    name="email"
                    type="email"
                    label="Email"
                    placeholder="Enter your email"
                  />
                  <Input
                    label="Password"
                    name="password"
                    placeholder="Enter password"
                    type="password"
                  />
                  <Button type="submit" className="btn primary-button mt-3 px-5">
                    {loading ? <Spinner animation="grow" /> : "Login"}
                  </Button>
                </Form>
              </>
            )}
          </Formik>
        </Card.Body>
      </Card>
    </Container>
  );
};
