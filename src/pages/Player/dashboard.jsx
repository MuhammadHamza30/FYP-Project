import { Container, ListGroup, ListGroupItem } from "react-bootstrap"
import { MainSidebar } from "../../components";
import { useEffect, useState } from "react"
import { getTournments, getUpdates } from "../../APIS"

export const PlayerDashboard = () => {
	const [tournmentsdData, setTournmentsData] = useState([]);
	const [updatesData, setUpdatesData] = useState([]);


	useEffect(() => {
		getUpdates()
			.then(res => {
				setUpdatesData(res);
			})
			.catch(err => {
				alert(err.message);
			})
		getTournments()
			.then(res => {
				setTournmentsData(res);
			})
			.catch(err => {
				alert(err.message);
			})
	}, []);


	return (
		<MainSidebar>
			<h2 className="mb-3">Fee Update: </h2>
			<div className="row mb-2">
				<div className="col-md-4">
					<div className="card bg-gray p-2 mb-2">
						<p>ID: P202323</p>
						<p>Name: Muhammad Hamza</p>
						<p>Month: November 2023</p>
						<p>Fee: 300</p>
						<p>Status: <span className="text-success">Successfull</span></p>
						<p>Fee Chalan: <a href="#challan">Download</a></p>
					</div>
				</div>
				<div className="col-md-4">
					<div className="card bg-gray p-2 mb-2">
						<p>ID: P202323</p>
						<p>Name: Muhammad Hamza</p>
						<p>Month: December 2023</p>
						<p>Fee: 300</p>
						<p>Status: <span className="text-danger">Pending</span></p>
						<p>Fee Chalan: <a href="#challan">Download</a></p>
					</div>
				</div>
			</div>
			<div className="row mb-2">
				<div className="col-md-5">
					<div className="card bg-gray p-2 mb-2"> Choose document...</div>
				</div>
				<div className="col-md-3">
					<button className="btn btn-primary">Upload Fee Challan</button>
				</div>
			</div>
			<h2 className="mb-3">Tournment Updates</h2>
			<Container className="tournment-container mb-3">
				{tournmentsdData.map(((item ) => (
					<Container className="tournment-item">
						<img src={item.image} alt="" />
						<h6 className="text-dark">{item.text}</h6>
					</Container>
				)))}
			</Container>
			<h2 className="mb-3">Other Updates</h2>
			<ListGroup className="bg-gray mb-3">
				{updatesData.map(((item ) => (
					<ListGroupItem className="update-item">
						<a href="#item">{item.text}</a>
					</ListGroupItem>
				)))}
			</ListGroup>
		</MainSidebar>
	)
}