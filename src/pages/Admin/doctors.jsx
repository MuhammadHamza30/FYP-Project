import { useEffect, useState } from "react"
import { MainSidebar } from "../../components"
import { deleteUser, getUsers } from "../../APIS";
import { toast } from "react-toastify";
import { Spinner, Table } from "react-bootstrap";

export const Doctors = () => {
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(false);


	const deleteUserHandler = async (id ) => {
		if (!window.confirm("Are you sure?")) return;
		try {
			setLoading(true);
			await deleteUser(id);

			getUsers().then((res ) => {
				console.log(res);

				setData(res.filter((item ) => item.occupation.includes("Doctor")));
			})
				.catch((err ) => {
					toast.error(err.message);
				})
			setLoading(false);
		} catch (error ) {
			setLoading(false);
			toast.error(error?.message);
		}
	}

	useEffect(() => {
		getUsers().then((res ) => {
			setData(res.filter((item ) => item.occupation.includes("Doctor")));
		})
			.catch((err ) => {
				toast.error(err.message);
			})
	}, [])

	return (
		<MainSidebar>
			<h2>Doctors List: </h2>

			<Table striped bordered hover>
				<thead>
					<tr>
						<th>Name</th>
						<th>Father Name</th>
						<th>Age</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					{data.map((item ) => (
						<tr>
							<td>{item.name}</td>
							<td>{item.fatherName}</td>
							<td>{item.age}</td>
							<td>
								<button className="btn btn-danger" onClick={() => deleteUserHandler(item.docId)}>
									{loading ? <Spinner animation="grow" variant="light" /> : "Remove"}
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</Table>
		</MainSidebar>
	)
}