import React, { useEffect, useState } from 'react';
import { Loader, MainSidebar } from '../../components';
import { getUser, getUsers, updateUser } from '../../APIS';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { authHandler } from '../../store/reducers';

export const Doctors = () => {
	const [data, setData] = useState([]);
	const [feedbacks, setFeedbacks] = useState([]);
	const { user } = useSelector((st ) => st.user);
	const [loading, setLoading] = useState(true);
	const dispatch = useDispatch();

	const addHandler = async (id , players ) => {
		try {
			setLoading(true);
			// For player
			const doctors = [...user.doctors, id];
			const res = await updateUser({ doctors }, user?.docId);
			const payloadData = {
				isAuthenticated: true,
				user: res,
			};
			dispatch(authHandler(payloadData));

			// For doctor

			const tPlayers = [...players, user?.docId];
			await updateUser({ players: tPlayers }, id);
			toast.success("Successfully given!");
			setLoading(false);
		} catch (error ) {
			setLoading(false);
			toast.error(error.message);
		}
	};


	useEffect(() => {
		getUser(user?.docId).then((res ) => {
			setFeedbacks(res.doctorFeedbacks);
		})
			.catch((err ) => {
				toast.error(err.message);
			})
	}, [user?.docId]);


	useEffect(() => {
		getUsers().then((res ) => {
			setData(res.filter((item ) => {
				return item.occupation.includes("Doctor");
			}));
			setLoading(false);
		})
			.catch((err ) => {
				setLoading(false);
				toast.error(err.message);
			})
	}, []);

	if (loading) return <MainSidebar> <Loader /> </MainSidebar>

	return (
		<MainSidebar>
			<h4>Add Doctor:</h4>
			<div className="row cards-container">
				{data.filter((it ) => !user?.doctors.includes(it.docId)).length ? data.filter((it ) => !user?.doctors.includes(it.docId)).map((usr ) => (
					<div className="col-md-4" key={usr.docId}>
						<div className='card bg-black p-3 mb-2'>
							<div className='d-flex align-items-center gap-3'>
								<img src={usr.image ? usr.image : "placeholder.jpg"} alt="" />
								<div>
									<h6>{usr.name}</h6>
								</div>
							</div>
							<p className='mb-2'>{usr.specialization}</p>
							<div>
								<h6>Experience: </h6>
								<p>{usr.experience}</p>
							</div>
							<div>
								<h6>Phone No: {usr.phoneNumber}</h6>
							</div>
							<div>
								<h6>Clinic Address:</h6>
								<p>{usr.clinicAddress}</p>
							</div>
							<div>
								<h6>Clinic Timing:</h6>
								<p>{usr.clinicTiming}</p>
							</div>
							<div>
								<h6>Clinic Weekend:</h6>
								<p>{usr.weekend}</p>
							</div>

							<button className='btn text-yellow fw-bold' onClick={() => addHandler(usr.docId, usr.players)}>Give Access</button>
						</div>
					</div>
				)) : <p className='text-dark'>No doctors to added!</p>}
			</div>
			<h4 className='mt-3'>Feedbacks from Doctors:</h4>
			{feedbacks.length ? feedbacks.map((feedback ) => (
				<p className='bg-gray p-3'>{feedback}</p>
			)) : <p>No feedbacks added yet!</p>}

		</MainSidebar>
	);
}
