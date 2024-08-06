import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Footer, Navbar } from '../components';
import { useNavigate } from 'react-router-dom';
import { getUsers } from '../APIS';
import { toast } from 'react-toastify';

export const Home = () => {
	const [users, setUsers] = useState([]);
	const navigate = useNavigate();


	useEffect(() => {
		getUsers().then((res ) => {
			setUsers(res);
		})
			.catch((err ) => {
				toast.error(err.message);
			})
	}, []);

	return (
		<div style={{ height: "100vh" }}>
			<Navbar />
			<div style={{ backgroundImage: "url(hero.jpg)", height: '80vh', backgroundSize: 'cover', backgroundPosition: 'center' }}>
				<Container>
					<Row className="align-items-center" style={{ height: '80vh' }}>
						<Col md={2}>
							<h1>Squash Player Management System</h1>
							<Button className='secondary-button px-5 py-2'
								onClick={() => navigate("/register")}
							>Sign Up</Button>
						</Col>
					</Row>
				</Container>
			</div>

			<Container className="my-5">
				<Row>
					<Col md={3}>
						<Container className='d-flex gap-2 flex-column justify-content-center'>
							<img src='t3.jpg' alt='' width="100%" height={200} />
							<Button className='tertiary-button py-2 px-5'>Back</Button>
						</Container>
					</Col>
					<Col md={6}>
						<Container>
							<img src='p8.png' alt='' width="100%" height={250} />
						</Container>
					</Col>
					<Col md={3}>
						<Container className='d-flex gap-2 flex-column justify-content-center'>
							<img src='p5.jpg' alt='' width="100%" height={200} />
							<Button className='tertiary-button py-2 px-5'>Next</Button>
						</Container>
					</Col>
				</Row>
			</Container>
			<section className="info-section">
				<Container>
					<Row>
						<Col md={4}>
							<Container className='d-flex gap-2 align-items-center'>
								<img src='t1.jpg' alt='' width="100%" />
								<Container>
									<p className='font-25 '>{users.filter((item ) => item.occupation.includes("Player")).length}</p>
									<p>Total registered players</p>
								</Container>
							</Container>
						</Col>
						<Col md={4}>
							<Container className='d-flex gap-2 align-items-center'>
								<img src='player.jpg' alt='' width="100%" />
								<Container>
									<p className='font-25'>{users.filter((item ) => item.occupation.includes("Trainer")).length}</p>
									<p>Total registered trainers</p>
								</Container>
							</Container>
						</Col>
						<Col md={4}>
							<Container className='d-flex gap-2 align-items-center'>
								<img src='d3.jpg' alt='' width="100%" />
								<Container>
									<p className='font-25'>{users.filter((item ) => item.occupation.includes("Doctor")).length}</p>
									<p>Total registered Doctors</p>
								</Container>
							</Container>
						</Col>
					</Row>
				</Container>
			</section>
			<Footer />
		</div>
	);
};