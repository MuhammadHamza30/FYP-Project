import { useState } from "react";
import { Form, Formik } from "formik";
import * as yup from "yup";
import { Input } from "../components";
import { toast } from "react-toastify";
import { Button, Card, Container } from "react-bootstrap";
import Spinner from "react-bootstrap/Spinner";
import { useDispatch, useSelector } from "react-redux";
import { authHandler } from "../store/reducers";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../APIS";
import { CopyRight } from "../components/Footer/copyRight";
// import { loginAdmin } from "../APIS";

export const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [state] = useState({
    email: "",
    password: "",
  });
  const dispatch = useDispatch();
  const { user } = useSelector((st) => st.user);

  const validations = yup.object().shape({
    email: yup.string().email().required(),
    password: yup.string().min(6).required(),
  });

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const res = await loginUser(values);
      if (res) {
        const payload = {
          isAuthenticated: true,
          user: res,
        };
        dispatch(authHandler(payload));
        if (res?.occupation?.includes("Doctor")) {
          navigate("/doctor/dashboard");
        } else if (res?.occupation?.includes("Trainer")) {
          navigate("/trainer/dashboard");
        } if (res?.occupation?.includes("Player")) {
          navigate("/player/dashboard");
        }
        toast.success("Login successfully!");
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error(error?.response?.data?.errors[0]?.msg);
    }
  };


  if (user?.occupation?.includes("Doctor")) {
    window.location.replace("/doctor/dashboard");
  }
  if (user?.occupation?.includes("Trainer")) {
    window.location.replace("/trainer/dashboard");
  }
  if (user?.occupation?.includes("Player")) {
    window.location.replace("/player/dashboard");
  }

  return (
    <>
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
                    <h3 className="mb-4">Login</h3>
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
      <div style={{ marginTop: "-90px" }}>
        <CopyRight />
      </div>
    </>
  );
};
