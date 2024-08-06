import { Button, Col, Container, ListGroup, Row, Spinner } from "react-bootstrap"
import { FileInput, MainSidebar } from "../../components"
import { Form } from "react-bootstrap"
import { useEffect, useState } from "react"
import { addTournment, deleteTournment, getTournments } from "../../APIS"
import { toast } from "react-toastify"


export const Tournments = () => {
	const [data, setData] = useState([]);
	const [item, setItem] = useState('');
	const [file, setFile] = useState(null);
	const [loading, setLoading] = useState(false);
	const [fileLoading] = useState(false);


	useEffect(() => {
		getTournments()
			.then(res => {
				setData(res);
			})
			.catch(err => {
				alert(err.message);
			})
	}, []);


	const addHandler = async () => {
		if (!item.length) return alert("Please enter info of tournment!");
		if (!file) return alert("Please add image");
		try {
			setLoading(true);
			await addTournment({ text: item, image: file });
			getTournments()
			.then(res => {
				setData(res);
			})
			.catch(err => {
				alert(err.message);
			})
			toast.success("Added successfully");
			setLoading(false);
			setItem("");
			setFile(null);
		} catch (error ) {
			setLoading(false);
			alert(error?.message)
		}
	}
	const removeItemHandler = async (id ) => {
		const c = window.confirm("Are you sure?");
		if (!c) return;
		try {
			await deleteTournment(id);
			setData((it ) => it.filter((filterItem ) => filterItem.docId !== id));
			toast.success("Removed successfully");
		} catch (error ) {
			alert(error?.message)
		}
	}
	return (
		<MainSidebar>
			<h2>Tournments</h2>
			<div className="gap-3 mb-2">
				<Row>
					<Col md={8}>
						<Form.Group style={{ width: "100%" }}>
							<Form.Label>Add Tournment Info</Form.Label>
							<Form.Control onChange={(e) => setItem(e.target.value)} className="bg-gray" value={item} />
						</Form.Group>
					</Col>
					<Col md={4}>
						<Container className="d-flex">
							<FileInput
								name="file"
								loading={fileLoading}
								changeHandler={(key , value: File) => setFile(value)}
								label="Upload Image"
							/>
							<div className="card-container">
								{file && <img src={URL.createObjectURL(file)} alt="" width="100%" height="100%" />}
							</div>
						</Container>
					</Col>
				</Row>
			</div>
			<Button onClick={addHandler} className="bg-light text-dark">{loading ? <Spinner animation="grow" variant="dark" /> : "Add"}</Button>

			<h4 className="my-3">List of added Tournments</h4>
			<ListGroup>
				{data.map((it ) => (
					<ListGroup.Item key={it.docId} className="d-flex justify-content-between">
						<Container>{it.text}</Container>
						<Container className="text-center">
							<img src={it.image} alt="" width="50px" />
						</Container>
						<Container className="text-blue text-end pointer"
							onClick={() => removeItemHandler(it.docId)}
						>Remove</Container>
					</ListGroup.Item>
				))}
			</ListGroup>
		</MainSidebar>
	)
}