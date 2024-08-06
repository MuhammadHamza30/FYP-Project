import { Button, Container, ListGroup } from "react-bootstrap"
import { MainSidebar } from "../../components"
import { Form } from "react-bootstrap"
import { useEffect, useState } from "react"
import { addUpdate, deleteUpdate, getUpdates } from "../../APIS"
import { toast } from "react-toastify"


export const Updates = () => {
	const [data, setData] = useState([]);
	const [item, setItem] = useState('');


	useEffect(() => {
		getUpdates()
			.then(res => {
				setData(res);
			})
			.catch(err => {
				alert(err.message);
			})
	}, []);


	const addHandler = async () => {
		if (!item.length) return;
		try {
			await addUpdate({ text: item });
			setData((it ) => ([{ text: item, docId: Date.now().toString() }, ...it]));
			toast.success("Added successfully");
			setItem("");
		} catch (error ) {
			alert(error?.message)
		}
	}
	const removeItemHandler = async (id ) => {
		const c = window.confirm("Are you sure?");
		if (!c) return;
		try {
			await deleteUpdate(id);
			setData((it ) => it.filter((filterItem ) => filterItem.docId !== id));
			toast.success("Removed successfully");
		} catch (error ) {
			alert(error?.message)
		}
	}
	return (
		<MainSidebar>
			<h2>Add Updates</h2>
			<div className="d-flex align-items-center gap-3">
				<Form.Group>
					<Form.Control onChange={(e) => setItem(e.target.value)} className="bg-gray" value={item}/>
				</Form.Group>
				<Button onClick={addHandler} className="bg-light text-dark">Add</Button>
			</div>

			<h4 className="my-3">List of added Updates</h4>
			<ListGroup>
				{data.map((it ) => (
					<ListGroup.Item key={it.docId} className="d-flex justify-content-between">
						<Container>{it.text}</Container>
						<Container className="text-blue text-end pointer"
							onClick={() => removeItemHandler(it.docId)}
						>Remove</Container>
					</ListGroup.Item>
				))}
			</ListGroup>
		</MainSidebar>
	)
}