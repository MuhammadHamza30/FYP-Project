import React, { useState, useEffect } from 'react';
import { Loader, MainSidebar } from '../../components';
import { useSelector } from 'react-redux';
import { getDoctorSelectedPlayers } from '../../APIS';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
export const Players = () => {
	const [data, setData] = useState([]);
	const { user } = useSelector((st ) => st.user);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();

	useEffect(() => {
		getDoctorSelectedPlayers(user.docId).then((Res ) => {
			setData(Res.data);
			setLoading(false);
		})
			.catch((err ) => {
				setLoading(false);
				toast.error(err.message);
			})
	}, [user.docId, user.players]);

	if (loading) return <MainSidebar> <Loader /> </MainSidebar>
	return (
		<MainSidebar>
			<div className="row cards-container">
				{data.length ? data.map((usr ) => (
					<div className="col-md-4" key={usr.docId}>
						<div className='card bg-black p-3 mb-2'>
							<div className='d-flex align-items-center gap-3'>
								<img src={usr.image ? usr.image : "placeholder.jpg"} alt="" />
								<div>
									<h6>{usr.name}</h6>
								</div>
							</div>
							<div>
								<h6>Level: </h6>
								<p>{usr.level}</p>
							</div>
							<div>
								<h6>Age: </h6>
								<p>{usr.age}</p>
							</div>
							<div>
								<h6>Medal: </h6>
								<p>{usr.medal}</p>
							</div>
							<div>
								<h6>Height: </h6>
								<p>{usr.height}</p>
							</div>
							<div>
								<h6>Weight: </h6>
								<p>{usr.weight}</p>
							</div>

							<button onClick={() => navigate("/doctor/players/health-data", { state: usr.docId })} className='btn text-yellow fw-bold'>View Health Data</button>
						</div>
					</div>
				)) : <p className='text-dark'>No trainers to added!</p>}
			</div>
		</MainSidebar>
	);
}
