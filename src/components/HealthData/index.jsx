import React, { useEffect, useState } from 'react';
import { PiHeartbeatFill } from "react-icons/pi";
import { HeartbeatIcon } from '../HearthbeatIcon';
import { IoFootstepsSharp } from "react-icons/io5";
import { FaTemperatureHigh } from "react-icons/fa";
import { GrBarChart } from "react-icons/gr";
import { Form } from 'react-bootstrap';
import { Table } from 'react-bootstrap';
import { generateRandomData } from '../../utils';
import { StepsIcon } from '../../Assets/steps';
import { TemperatureIcon } from '../../Assets/temperature';

export const HealthData = () => {

	const [data, setData] = useState([]);

	useEffect(() => {
		const res = generateRandomData();
		setData(res);

	}, []);
	return <>
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
	</>
}