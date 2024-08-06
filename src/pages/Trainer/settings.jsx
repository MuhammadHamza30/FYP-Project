import { useState } from "react";
import { Form, Formik } from "formik";
import * as yup from "yup";
import { FileInput, Input, MainSidebar } from "../../components";
import { toast } from "react-toastify";
import { Button, Col, Container, Row } from "react-bootstrap";
import Spinner from "react-bootstrap/Spinner";
import { updateUser, uploadFile } from "../../APIS";
import { useDispatch, useSelector } from "react-redux";
import { authHandler } from "../../store/reducers";

export const TrainerSettings = () => {
	const [playerIfoLoading, setPlayerIfoLoading] = useState(false);
	const [securityLoading, setSecurityLoading] = useState(false);
	const [loading, setLoading] = useState(false);
	const [fileLoading, setFileLoading] = useState(false);
	const dispatch = useDispatch();
	const { user } = useSelector((st ) => st.user);

	const [state, setState] = useState({
		name: user?.name ?? "",
		fatherName: user?.fatherName ?? "",
		image: user?.image ?? "",
		dob: user?.dob ?? "",
		cnic: user?.cnic ?? "",
		age: user?.age ?? "",
		gender: user?.gender ?? "",
		city: user?.city ?? "",
		phoneNumber: user?.phoneNumber ?? "",
		address: user?.address ?? "",
		occupation: user?.occupation ?? "",
		postalCode: user?.postalCode ?? "",
	});
	const [trainerData, setTrainerData] = useState({
		level: user?.level ?? "",
		experience: user?.experience ?? "",
		achivement: user?.achivement ?? "",
	});
	const [securityData, setSecurityData] = useState({
		password: "",
		confirmPassword: "",
	});

	const securityValidations = yup.object().shape({
		password: yup.string().min(6).required(),
		confirmPassword: yup.string().required()
	});
	const doctorvalidations = yup.object().shape({
		level: yup.string().required(),
		experience: yup.string().required(),
		achivement: yup.string().required()
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
		postalCode: yup.string().required(),
	});

	const changeHandler = (key , value ) => {
		setState((p ) => ({
			...p,
			[key]: value
		}))
	}
	const trainerInforChangeHandler = (key , value ) => {
		setTrainerData((p ) => ({
			...p,
			[key]: value
		}))
	}
	const securityChangeHandler = (key , value ) => {
		setSecurityData((p ) => ({
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
			setLoading(true);
			const res = await updateUser(
				{ ...values, image: state.image },
				user?.docId
			);
			const payload = {
				isAuthenticated: true,
				user: res,
			};
			dispatch(authHandler(payload));
			toast.success("Updated successfully!");
			setLoading(false);
		} catch (error ) {
			setLoading(false);
			toast.error(error?.message);
		}
	};
	const infoSubmitHandler = async (values ) => {
		try {
			setPlayerIfoLoading(true);
			const res = await updateUser(
				values,
				user?.docId
			);
			const payload = {
				isAuthenticated: true,
				user: res,
			};
			dispatch(authHandler(payload));
			toast.success("Updated successfully!");
			setPlayerIfoLoading(false);
		} catch (error ) {
			setPlayerIfoLoading(false);
			toast.error(error?.message);
		}
	};
	const securitySubmitHandler = async (v ) => {		
		try {
			if (v.password !== v.confirmPassword) {
				return alert("Confirm password doesn't matched!")
			}
			setSecurityLoading(true);
			await updateUser(
				{ password: v.password },
				user?.docId
			);

			toast.success("Updated successfully!");
			setSecurityLoading(false);
		} catch (error ) {
			setSecurityLoading(false);
			toast.error(error?.message);
		}
	};

	return (
		<MainSidebar>
			<Container>

				<Formik
					initialValues={state}
					validationSchema={validations}
					onSubmit={handleSubmit}
				>
					{() => (
						<>
							<Form>
								<h5 className="mb-4 fw-bold">Basic Info</h5>
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
										<Input
											label="Postal Code"
											name="postalCode"
											changeHandler={changeHandler}
										/>
									</Col>
									<Col md={12}>
										<div className="d-flex justify-content-end">
											<Button className="secondary-button" type="submit">
												{loading ? <Spinner animation="grow" /> : "Save"}
											</Button>
										</div>
									</Col>
								</Row>
							</Form>
						</>
					)}
				</Formik>
				<Formik
					initialValues={securityData}
					validationSchema={securityValidations}
					onSubmit={securitySubmitHandler}
				>
					{() => (
						<>
							<Form>
								<Row>
									<Col md={12}>
										<hr />
									</Col>
									<h5 className="fw-bold mt-4">Security</h5>
									<Col md={4}>
										<Input
											label="Password"
											name="password"
											changeHandler={securityChangeHandler}
											type="password"
										/>
									</Col>
									<Col md={4}>
										<Input
											label="Confirm Password"
											name="confirmPassword"
											changeHandler={securityChangeHandler}
											type="password"
										/>
									</Col>
									<Col md={12}>
										<div className="d-flex justify-content-end">
											<Button className="secondary-button" type="submit">
												{securityLoading ? <Spinner animation="grow" /> : "Save"}
											</Button>
										</div>
									</Col>
								</Row>
							</Form>
						</>
					)}
				</Formik>
				<Formik
					initialValues={trainerData}
					validationSchema={doctorvalidations}
					onSubmit={infoSubmitHandler}
				>
					{() => (
						<>
							<Form>
								<Row>
									<Col md={12}>
										<hr />
									</Col>
									<h5 className="fw-bold mt-4">Experience</h5>
									<Col md={4}>
										<Input
											label="Level"
											name="level"
											value={trainerData.level}
											changeHandler={trainerInforChangeHandler}
										/>
									</Col>
									<Col md={4}>
										<Input
											label="Experience"
											value={trainerData.experience}
											name="experience"
											changeHandler={trainerInforChangeHandler}
										/>
									</Col>
									<Col md={4}>
										<Input
											label="Achievement"
											value={trainerData.achivement}
											name="achivement"
											changeHandler={trainerInforChangeHandler}
										/>
									</Col>
									<Col md={12}>
										<div className="d-flex justify-content-end">
											<Button className="secondary-button" type="submit">
												{playerIfoLoading ? <Spinner animation="grow" /> : "Save"}
											</Button>
										</div>
									</Col>
								</Row>
							</Form>
						</>
					)}
				</Formik>
			</Container>
		</MainSidebar>
	);
};
