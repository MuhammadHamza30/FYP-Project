import { useState } from "react";
import { Form, Formik } from "formik";
import * as yup from "yup";
import { FileInput, Input, Select } from "../components";
import { toast } from "react-toastify";
import { Button, Col, Container, Row } from "react-bootstrap";
import Spinner from "react-bootstrap/Spinner";
import { useNavigate } from "react-router-dom";
import { registerUser, uploadFile } from "../APIS";

export const Registeration = () => {
  const [loading, setLoading] = useState(false);
  const [fileLoading, setFileLoading] = useState(false);
  const navigate = useNavigate();
  const [state, setState] = useState({
    name: "",
    fatherName: "",
    image: "",
    dob: "",
    cnic: "",
    age: "",
    gender: "",
    city: "",
    phoneNumber: "",
    address: "",
    occupation: "",
    postalCode: "",
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
    email: "",
    password: "",
    confirmPassword: "",
  });

  const validations = yup.object().shape({
    name: yup.string().required(),
    fatherName: yup.string().required(),
    dob: yup.string().required(),
    cnic: yup.string().required(),
    age: yup.string().required(),
    gender: yup.string().required(),
    city: yup.string().required(),
    phoneNumber: yup.string().required(),
    address: yup.string().required(),
    occupation: yup.string().required(),
    postalCode: yup.string().required(),
    email: yup.string().email().required(),
    password: yup.string().min(6).required(),
  });

  const changeHandler = (key , value ) => {
    setState((p ) => ({
      ...p,
      [key]: value
    }))
  }
  const fileChangeHandler = async (key , value ) => {
    try {
      setFileLoading(true);
      const ref = await uploadFile(value);
      setState((p ) => ({
        ...p,
        [key]: ref
      }))
      setFileLoading(false);
    } catch (error ) {
      setFileLoading(false);
      alert(error?.message);
    }
  }

  const handleSubmit = async (values ) => {
    try {
      if (state.password !== state.confirmPassword) {
        return alert("Confirm password doesn't matched!")
      }
      setLoading(true);
      await registerUser(state);
      toast.success("Register successfully!");
      navigate("/login");
      setLoading(false);
    } catch (error ) {
      setLoading(false);
      toast.error(error?.response?.data?.errors[0]?.msg);
    }
  };

  return (
    <Container className="my-5">

      <Formik
        initialValues={state}
        validationSchema={validations}
        onSubmit={handleSubmit}
      >
        {() => (
          <>
            <Form>
              <h3 className="mb-4 text-center fw-bolder">Sign Up</h3>
              <h5 className="mb-4 text-center fw-bold">Basic Info</h5>
              <Row>
                <Col md={4}>
                  <Input
                    name="name"
                    changeHandler={changeHandler}
                    label="Name"
                  />
                </Col>
                <Col md={4}>
                  <Input
                    name="fatherName"
                    changeHandler={changeHandler}
                    label="Father Name"
                  />
                </Col>
                <Col md={4}>
                  <Container className="d-flex">
                    <FileInput
                      name="image"
                      loading={fileLoading}
                      changeHandler={fileChangeHandler}
                      label="Upload Image"
                    />
                    <div className="card-container">
                      {state.image && <img src={state.image} alt="" width="100%" height="100%" />}
                    </div>
                  </Container>
                </Col>
                <Col md={4}>
                  <Input
                    name="dob"
                    type="date"
                    changeHandler={changeHandler}
                    label="Date of birth"
                  />
                </Col>
                <Col md={4}>
                  <Input
                    name="cnic"
                    changeHandler={changeHandler}
                    label="CNIC / B-form"
                  />
                </Col>
                <Col md={2}>
                  <Input
                    name="gender"
                    changeHandler={changeHandler}
                    label="Gender"
                  />
                </Col>
                <Col md={2}>
                  <Input
                    name="age"
                    type="number"
                    changeHandler={changeHandler}
                    label="age"
                  />
                </Col>
                <Col md={4}>
                  <Input
                    name="email"
                    type="email"
                    changeHandler={changeHandler}
                    label="Email"
                  />
                </Col>
                <Col md={4}>
                  <Input
                    name="city"
                    changeHandler={changeHandler}
                    label="City"
                  />
                </Col>
                <Col md={4}>
                  <Input
                    name="phoneNumber"
                    changeHandler={changeHandler}
                    label="Phone Number"
                  />
                </Col>
                <Col md={12}>
                  <Input
                    name="address"
                    changeHandler={changeHandler}
                    label="Address"
                  />
                </Col>

                <Col md={4}>
                  <Select
                    name="occupation"
                    searchKey="name"
                    searchValue="name"
                    data={[{ name: "Player" }, { name: "Trainer" }, { name: "Doctor" }]}
                    changeHandler={changeHandler}
                    label="Occupation"
                  />
                </Col>
                <Col md={4}>
                  <Input
                    label="Postal Code"
                    name="postalCode"
                    changeHandler={changeHandler}
                  />
                </Col>

                {state.occupation.includes("Player") && (
                  <>
                    <h5 className="text-center fw-bold mt-4">For Player</h5>
                    <Row>
                      <Col md={4}>
                        <Input
                          label="Level"
                          name="level"
                          changeHandler={changeHandler}
                        />
                      </Col>
                      <Col md={4}>
                        <Input
                          label="Height"
                          name="height"
                          changeHandler={changeHandler}
                        />
                      </Col>
                      <Col md={4}>
                        <Input
                          label="Weight"
                          name="weight"
                          changeHandler={changeHandler}
                        />
                      </Col>
                      <Col md={8}>
                        <Input
                          label="Medal"
                          name="medal"
                          changeHandler={changeHandler}
                        />
                      </Col>
                    </Row>
                  </>
                )}

                {state.occupation.includes("Doctor") && (
                  <>
                    <h5 className="text-center fw-bold mt-4">For Doctor</h5>
                    <Row>
                      <Col md={4}>
                        <Input
                          label="Specialization"
                          name="specialization"
                          changeHandler={changeHandler}
                        />
                      </Col>
                      <Col md={4}>
                        <Input
                          label="Experience"
                          name="experience"
                          changeHandler={changeHandler}
                        />
                      </Col>
                      <Col md={4}>
                        <Input
                          label="Clinic Phone Number"
                          name="clinicPhoneNumber"
                          changeHandler={changeHandler}
                        />
                      </Col>
                      <Col md={4}>
                        <Input
                          label="Clinic Timing"
                          name="clinicTiming"
                          changeHandler={changeHandler}
                        />
                      </Col>
                      <Col md={4}>
                        <Input
                          label="Weekend"
                          name="weekend"
                          changeHandler={changeHandler}
                        />
                      </Col>
                      <Col md={12}>
                        <Input
                          label="Clinic Address"
                          name="clinicAddress"
                          changeHandler={changeHandler}
                        />
                      </Col>
                    </Row>
                  </>
                )}

                {state.occupation.includes("Trainer") && (
                  <>
                    <h5 className="text-center fw-bold mt-4">For Trainer</h5>
                    <Row>
                      <Col md={4}>
                        <Input
                          label="Level"
                          name="level"
                          changeHandler={changeHandler}
                        />
                      </Col>
                      <Col md={4}>
                        <Input
                          label="Experience"
                          name="height"
                          changeHandler={changeHandler}
                        />
                      </Col>
                      <Col md={12}>
                        <Input
                          label="Achivement"
                          name="achivement"
                          changeHandler={changeHandler}
                        />
                      </Col>
                    </Row>
                  </>
                )}

                <Col md={12}>
                  <hr />
                </Col>

                <Col md={4}>
                  <Input
                    label="Password"
                    name="password"
                    changeHandler={changeHandler}
                    type="password"
                  />
                </Col>
                <Col md={4}>
                  <Input
                    label="Confirm Password"
                    name="confirmPassword"
                    changeHandler={changeHandler}
                    type="password"
                  />
                </Col>
              </Row>
              <Button type="submit" className="btn secondary-button mt-3 px-5">
                {loading ? <Spinner animation="grow" /> : "Register"}
              </Button>
            </Form>
          </>
        )}
      </Formik>
    </Container>
  );
};
