import React, { useState, useEffect } from 'react';
import { Loader, MainSidebar } from '../../components';
import { useDispatch, useSelector } from 'react-redux';
import { getSelectedPlayers, updateUser } from '../../APIS';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { authHandler } from '../../store/reducers';
export const Players = () => {
	const [data, setData] = useState([]);
	const [currentUser, setUser] = useState(null);
	const { user } = useSelector((st ) => st.user);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const addHandler = async (id , trainers ) => {
		try {
			setLoading(true);
			console.log(currentUser);
			
			// For trainer
			let players = [...currentUser?.players];
			const index = players.findIndex((tr ) => tr.userId === id);
			if (index >= 0) {
				players = players.map((plr ) => {
					if (plr.userId === id) {
						return {
							...plr,
							isConfirmed: true
						};
					}
					return plr;
				});
				const res = await updateUser({ players }, currentUser?.docId);
				const payloadData = {
					isAuthenticated: true,
					user: res,
				};
				dispatch(authHandler(payloadData));
			}

			// For player

			let tTrainers = [...trainers];
			const tIndex = tTrainers.findIndex((tr ) => tr.userId === user?.docId);
			if (tIndex >= 0) {
				tTrainers = tTrainers.map((player ) => {
					if (player.userId === user?.docId) {
						return {
							...player,
							isConfirmed: true
						};
					}
					return player;
				});
				await updateUser({ trainers: tTrainers }, id);
			}
			toast.success("Successfully Added!");
			setLoading(false);
		} catch (error ) {
			setLoading(false);
			toast.error(error.message);
		}
	};

	const removeHandler = async (id , trainers ) => {
		if (!window.confirm("Are you sure?")) return;
		try {
			setLoading(true);
			// For trainer
			const players = [...currentUser.players];
			const index = players.findIndex((tr ) => tr.userId === id);
			if (index >= 0) {
				players.splice(index, 1);
				const res = await updateUser({ players }, user?.docId);
				const payloadData = {
					isAuthenticated: true,
					user: res,
				};
				dispatch(authHandler(payloadData));
			}

			// For player

			const tTrainers = [...trainers];
			const tIndex = tTrainers.findIndex((tr ) => tr.userId === user?.docId);
			if (tIndex >= 0) {
				tTrainers.splice(tIndex, 1);
				await updateUser({ trainers: tTrainers }, id);
			}
			toast.success("Successfully removed!");
			setLoading(false);
		} catch (error ) {
			setLoading(false);
			toast.error(error.message);
		}
	};

	useEffect(() => {
		getSelectedPlayers(user.docId).then((res ) => {
			setData(res.data);
			setUser(res.user);
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
			<h4>Added Players:</h4>
			<div className="row cards-container">
				{data.filter((it ) => it.isConfirmed).length ? data.filter((it ) => it.isConfirmed).map((usr ) => (
					<div className="col-md-4" key={usr.user?.docId}>
						<div className='card bg-black p-3 mb-2'>
							<div className='d-flex align-items-center gap-3'>
								<img src={usr.user?.image ? usr.user?.image : "placeholder.jpg"} alt="" />
								<div>
									<h6>{usr.user?.name}</h6>
								</div>
							</div>
							<div>
								<h6>Level: </h6>
								<p>{usr.user?.level}</p>
							</div>
							<div>
								<h6>Age: </h6>
								<p>{usr.user?.age}</p>
							</div>
							<div>
								<h6>Medal: </h6>
								<p>{usr.user?.medal}</p>
							</div>
							<div>
								<h6>Height: </h6>
								<p>{usr.user?.height}</p>
							</div>
							<div>
								<h6>Weight: </h6>
								<p>{usr.user?.weight}</p>
							</div>

							<div className="d-flex justify-content-between align-items-center">
								<button onClick={() => navigate("/trainer/players/health-data", { state: usr.user?.docId })} className='btn text-yellow fw-bold'>View Health Data</button>
								<button onClick={() => removeHandler(usr.user?.docId, usr.user?.trainers)} className='btn text-yellow fw-bold'>Remove</button>

							</div>
						</div>
					</div>
				)) : <p className='text-dark'>No Player!</p>}
			</div>
			<h4>Add Players:</h4>
			<div className="row cards-container">
				{data.filter((it ) => !it.isConfirmed).length ? data.filter((it ) => !it.isConfirmed).map((usr ) => (
					<div className="col-md-4" key={usr.user?.docId}>
						<div className='card bg-black p-3 mb-2'>
							<div className='d-flex align-items-center gap-3'>
								<img src={usr.user?.image ? usr.user?.image : "placeholder.jpg"} alt="" />
								<div>
									<h6>{usr.user?.name}</h6>
								</div>
							</div>
							<div>
								<h6>Level: </h6>
								<p>{usr.user?.level}</p>
							</div>
							<div>
								<h6>Age: </h6>
								<p>{usr.user?.age}</p>
							</div>
							<div>
								<h6>Medal: </h6>
								<p>{usr.user?.medal}</p>
							</div>
							<div>
								<h6>Height: </h6>
								<p>{usr.user?.height}</p>
							</div>
							<div>
								<h6>Weight: </h6>
								<p>{usr.user?.weight}</p>
							</div>
							<button onClick={() => addHandler(usr.user?.docId, usr.user?.trainers)} className='btn text-yellow fw-bold'>Add</button>
						</div>
					</div>
				)) : <p className='text-dark'>No Player!</p>}
			</div>
		</MainSidebar>
	);
}
