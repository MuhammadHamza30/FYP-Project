import React, { useEffect, useState } from 'react';
import { HeartbeatIcon, MainSidebar } from '../../components';
import { Button, Col, Form, Row, Table } from 'react-bootstrap';
import { generateRandomData } from '../../utils';
import { PiHeartbeatFill } from 'react-icons/pi';
import { IoFootstepsSharp } from 'react-icons/io5';
import { FaTemperatureHigh } from 'react-icons/fa';
import { GrBarChart } from 'react-icons/gr';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { addTrainerFeedbackIntoDB } from '../../APIS';
import { TemperatureIcon } from '../../Assets/temperature';
import { StepsIcon } from '../../Assets/steps';

export const Health = () => {
	const [data, setData] = useState([]);
	const [item, setItem] = useState("");
	const { state } = useLocation();

	useEffect(() => {
		const res = generateRandomData();
		setData(res);
	}, []);

	const addFeedback = async () => {
		if (!item.length) return toast.error("Please enter feedback");
		try {
			await addTrainerFeedbackIntoDB(item, state);
			setItem("");
			toast.success("Added feedback successfully");
		} catch (error  ) {
			toast.error(error.message);
		}
	}


	return <MainSidebar>
		<div className='d-flex justify-content-between dashboard-cards-container'>
			<div className="card bg-gray p-2">
				<div className='d-flex justify-content-center align-items-center gap-2'>
					<PiHeartbeatFill fontSize={50} />
					<span>Heartbeat</span>
				</div>
				<h6 className='mx-5'>{data[0]?.heartBeat} bpm</h6>
				<div>
					<HeartbeatIcon />
				</div>
			</div>
			<div className="card bg-gray p-2">
				<div className='d-flex justify-content-center align-items-center gap-2'>
					<IoFootstepsSharp fontSize={50} />
					<span>Steps</span>
				</div>
				<h6 className='mx-5'>{data[0]?.steps}</h6>
				<div>
					<StepsIcon />
				</div>
			</div>
			<div className="card bg-gray p-2">
				<div className='d-flex justify-content-center align-items-center gap-2'>
					<FaTemperatureHigh fontSize={50} />
					<span>Temperature</span>
				</div>
				<h6 className='mx-5'>{data[0]?.temperature}</h6>
				<div>
					<TemperatureIcon />
				</div>
			</div>
		</div>
		<div className='dashboard-img-container'>
			<div>
				<h4 className='my-3'>Sleep</h4>
				<h4 className='mx-5 my-4'>8 Hour</h4>
			</div>
			<div>
				<GrBarChart fontSize={50} />
			</div>
		</div>

		<Row>
			<Col md={8}>
				<Form.Group className="mb-3 d-flex align-items-center  justify-content-center gap-3">
					<Form.Label style={{ fontWeight: "bold" }}>Search By Date:</Form.Label>
					<Form.Control type="date" className='bg-gray' style={{ maxWidth: "300px" }} />
				</Form.Group>

				<Table bordered hover>
					<thead>
						<tr>
							<th>S.No</th>
							<th>Date</th>
							<th>Heartbeat</th>
							<th>Steps</th>
							<th>Temperature</th>
						</tr>
					</thead>
					<tbody>
						{
							data.map((it , index ) => (
								<tr>
									<td>{index + 1}</td>
									<td>{it.date}</td>
									<td>{it.heartBeat}</td>
									<td>{it.steps}</td>
									<td>{it.temperature}</td>
								</tr>
							))
						}
					</tbody>
				</Table>
			</Col>
			<Col md={4}>
				<h6 className='text-dark'>Add Feedback</h6>
				<Form.Group className="mb-3">
					<Form.Control value={item} onChange={(e) => setItem(e.target.value)} as="textarea" rows={3} className='bg-gray' style={{ maxWidth: "300px" }} />
				</Form.Group>
				<Button className='btn secondary-button px-5' onClick={addFeedback}>Add</Button>
			</Col>
		</Row>
	</MainSidebar>
}
