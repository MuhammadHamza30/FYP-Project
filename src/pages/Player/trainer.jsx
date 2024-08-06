import React, { useEffect, useState } from 'react';
import { Loader, MainSidebar } from '../../components';
import { getUser, getUsers, updateUser } from '../../APIS';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { authHandler } from '../../store/reducers';

export const Trainers = () => {
	const [data, setData] = useState([]);
	const [feedbacks, setFeedbacks] = useState([]);
	const [currentUser, setUser] = useState(null);
	const { user } = useSelector((st ) => st.user);
	const [loading, setLoading] = useState(true);
	const dispatch = useDispatch();

	const accessHandler = async (id , players ) => {
		try {
			setLoading(true);
			// For player
			let trainers = [...currentUser?.trainers];
			const index = trainers.findIndex((tr ) => tr.userId === id);
			if (index >= 0) {
				if (trainers[index].viewHealthData) {
					setLoading(false);
					return toast.error("Already given access to this trainer");
				}
				trainers = trainers.map((trainer ) => {
					if (trainer.userId === id) {
						return {
							...trainer,
							viewHealthData: true
						};
					}
					return trainer;
				});
				const res = await updateUser({ trainers }, user?.docId);
				const payloadData = {
					isAuthenticated: true,
					user: res,
				};
				dispatch(authHandler(payloadData));
			}

			// For trainer

			let tPlayers = [...players];
			const tIndex = tPlayers.findIndex((tr ) => tr.userId === user?.docId);
			if (tIndex >= 0) {
				if (tPlayers[tIndex].viewHealthData) {
					setLoading(false);
					return toast.error("Already given access to this trainer")
				};
				tPlayers = tPlayers.map((player ) => {
					if (player.userId === user?.docId) {
						return {
							...player,
							viewHealthData: true
						};
					}
					return player;
				});
				await updateUser({ players: tPlayers }, id);
			}
			toast.success("Successfully given access!");
			setLoading(false);
		} catch (error ) {
			setLoading(false);
			toast.error(error.message);
		}
	};
	const removeHandler = async (id , players ) => {
		if (!window.confirm("Are you sure?")) return;
		try {
			setLoading(true);
			// For player
			const trainers = [...currentUser.trainers];
			const index = trainers.findIndex((tr ) => tr.userId === id);
			if (index >= 0) {
				trainers.splice(index, 1);
				const res = await updateUser({ trainers }, user?.docId);
				const payloadData = {
					isAuthenticated: true,
					user: res,
				};
				dispatch(authHandler(payloadData));
			}

			// For trainer

			const tPlayers = [...players];
			const tIndex = tPlayers.findIndex((tr ) => tr.userId === user?.docId);
			if (tIndex >= 0) {
				tPlayers.splice(tIndex, 1);
				await updateUser({ players: tPlayers }, id);
				getUser(user?.docId).then((res ) => {
					setUser(res);
				})
					.catch((err ) => {
						toast.error(err.message);
					})
			}
			toast.success("Successfully removed!");
			setLoading(false);
		} catch (error ) {
			setLoading(false);
			toast.error(error.message);
		}
	};
	const addHandler = async (id , players ) => {
		try {
			setLoading(true);
			// For player
			const payload = {
				isConfirmed: false,
				viewHealthData: false,
				userId: id,
			};
			const trainers = [...currentUser?.trainers, payload];
			const res = await updateUser({ trainers }, user?.docId);
			const payloadData = {
				isAuthenticated: true,
				user: res,
			};
			dispatch(authHandler(payloadData));

			// For trainer
			const tpPayload = {
				isConfirmed: false,
				viewHealthData: false,
				userId: user?.docId,
			};

			const tPlayers = [...players, tpPayload];
			await updateUser({ players: tPlayers }, id);
			getUser(user?.docId).then((res ) => {
				setUser(res);
			})
				.catch((err ) => {
					toast.error(err.message);
				})
			toast.success("Successfully Added!");
			setLoading(false);
		} catch (error ) {
			setLoading(false);
			toast.error(error.message);
		}
	};

	useEffect(() => {
		getUser(user?.docId).then((res ) => {
			setUser(res);
			setFeedbacks(res.trainerFeedbacks);
		})
			.catch((err ) => {
				toast.error(err.message);
			})
	}, [user?.docId]);


	useEffect(() => {
		getUsers().then((res ) => {
			setData(res.filter((item ) => {
				return item.occupation.includes("Trainer");
			}));
			setLoading(false);
		})
			.catch((err ) => {
				setLoading(false);
				toast.error(err.message);
			})
	}, [user?.trainers]);

	if (loading) return <MainSidebar> <Loader /> </MainSidebar>
	const trainers = currentUser?.trainers.map((it ) => it.userId);

	return (
		<MainSidebar>
			<h4>Add Trainer:</h4>
			<div className="row cards-container">
				{data.filter((it ) => !trainers.includes(it.docId)).length ? data.filter((it ) => !trainers.includes(it.docId)).map((usr ) => (
					<div className="col-md-4" key={usr.docId}>
						<div className='card bg-black p-3 mb-2'>
							<div className='d-flex align-items-center gap-3'>
								<img src={usr.image ? usr.image : "placeholder.jpg"} alt="" />
								<div>
									<h6>{usr.name}</h6>
									<p>{usr.level}</p>
								</div>
							</div>
							<div className='my-3'>
								<h6>Achivement: </h6>
								<p>{usr.achivement}</p>
							</div>
							<div className='my-2'>
								<h6>Experience: </h6>
								<p>{usr.experience}</p>
							</div>

							<button className='btn text-yellow fw-bold' onClick={() => addHandler(usr.docId, usr.players)}>Add</button>
						</div>
					</div>
				)) : <p className='text-dark'>No trainers to added!</p>}
			</div>
			<h4 className='mt-3'>Remove Trainer:</h4>
			<div className="row cards-container">
				{data.filter((it ) => trainers.includes(it.docId)).length ? data.filter((it ) => trainers.includes(it.docId)).map((usr ) => (
					<div className="col-md-4" key={usr.docId}>
						<div className='card bg-black p-3 mb-2'>
							<div className='d-flex align-items-center gap-3'>
								<img src={usr.image ? usr.image : "placeholder.jpg"} alt="" />
								<div>
									<h6>{usr.name}</h6>
									<p>{usr.level}</p>
								</div>
							</div>
							<div className='my-3'>
								<h6>Achivement: </h6>
								<p>{usr.achivement}</p>
							</div>
							<div className='my-2'>
								<h6>Experience: </h6>
								<p>{usr.experience}</p>
							</div>

							<div className="d-flex justify-content-between align-items-center">
								<button className='btn text-yellow fw-bold' onClick={() => accessHandler(usr.docId, usr.players)}>Give Access</button>
								<button className='btn text-yellow fw-bold' onClick={() => removeHandler(usr.docId, usr.players)}>Remove</button>
							</div>
						</div>
					</div>
				)) : <p className='text-dark'>No trainers to remove!</p>}
			</div>
			<h4 className='mt-3'>Feedbacks from Trainer:</h4>
			{feedbacks.length ? feedbacks.map((feedback ) => (
				<p className='bg-gray p-3'>{feedback}</p>
			)) : <p>No feedbacks added yet!</p>}

		</MainSidebar>
	);
}
