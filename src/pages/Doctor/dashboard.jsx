import { Container, ListGroup, ListGroupItem } from "react-bootstrap"
import { MainSidebar } from "../../components"
import { useEffect, useState } from "react"
import { getTournments, getUpdates } from "../../APIS";

export const DoctorDashboard = () => {
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
			<h2 className="mb-3">Tournment Updates</h2>
			<Container className="tournment-container mb-3">
				{tournmentsdData.map(((item ) => (
					<Container className="tournment-item">
						<img src={item.image} alt=""/>
						<h6 className="text-dark p-2">{item.text}</h6>
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