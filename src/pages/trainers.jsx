import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Footer, Loader, Navbar } from '../components';
import { getUsers } from '../APIS';
import { toast } from 'react-toastify';

export const Trainers = () => {
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		getUsers().then((res ) => {
			setUsers(res.filter((it  ) => it.occupation.includes("Trainer")));
			setLoading(false);
		})
			.catch((err ) => {
				setLoading(false);
				toast.error(err.message);
			})
	}, []);

	return (
		<div>
			<Navbar />
			<Container className='users-list-container my-5'>
				{loading ? <Loader /> : (
					<Row>
						{users.map((user) => (
							<Col md={3}>
								<img src={user.image} alt={user.name} />
								<h6 className="mt-3">{user.name}</h6>
							</Col>
						))}
					</Row>
				)}
			</Container>
			<Footer />
		</div>
	);
};