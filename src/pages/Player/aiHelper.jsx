import { Container, Spinner } from "react-bootstrap"
import { MainSidebar } from "../../components";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { askGemini } from "../../utils";
import { useSelector } from "react-redux";
import { addPrompt, getPrompts } from "../../APIS";
import { FaUser } from "react-icons/fa6";
import { SiOpenai } from "react-icons/si";

export const AiHelper = () => {
	const [data, setData] = useState([]);
	const [item, setItem] = useState('');
	const [loading, setLoading] = useState(false);
	const { user } = useSelector((st ) => st.user);

	const handleKeyDown = (event ) => {
		if (event.key === 'Enter') {
			submitHandler();
		}
	}

	const submitHandler = async () => {
		if (!item.length) return toast.error("Please add question");
		try {
			setLoading(true);
			const res = await askGemini(item);
			const payload = {
				userId: user?.docId,
				question: item,
				answer: res,
				docId: new Date().toString()
			};
			await addPrompt(payload);
			setData((prev ) => ([...prev, payload]))
			setItem('');
			setLoading(false);
		} catch (error ) {
			setLoading(false);
			toast.error(error.message);
		}
	};

	const formatText = (text )  => {
		const formattedItinerary = text
		  .replace(/\n/g, '<br />')
		  .replace(/\\(.?)\\*/g, '<p class="fw-bold">$1</p>')
		  .replace(/\((.*?)\*/g, '<p class="fw-bold">$1</p>')
		  .replace(/\## /g, '');
		  
		return formattedItinerary;
	  };

	useEffect(() => {
		getPrompts(user?.docId).then((res ) => {
			setData(res);
		})
			.catch((err ) => {
				toast.error(err.message);
			})
	}, [user?.docId])



	return (
		<MainSidebar>
			<Container className="card bg-gray ai-helper-container">
				<div>
					{
						data.map((item ) => (
							<div key={item.docId} className="prompt-container">
								<p className="question">
									<FaUser />
									<span style={{ maxWidth: "600px", }}>{item.question}</span>
								</p>
								<p className="answer">
									<SiOpenai />
									<span style={{ maxWidth: "600px" }} dangerouslySetInnerHTML={{ __html: formatText(item.answer) }} ></span>
								</p>
							</div>
						))
					}
				</div>
				<div className="input-group mb-3 p-2">
					<input
						type="text"
						className="form-control"
						value={item}
						onKeyDown={handleKeyDown}
						placeholder="Enter your query..."
						onChange={(e) => setItem(e.target.value)}
					/>
					<div className="input-group-append">
						<button onClick={submitHandler} className="input-group-text" id="ai-helper-input">
							{loading ? <Spinner variant="light" animation="grow" /> : "Send"}
						</button>
					</div>
				</div>
			</Container>
		</MainSidebar>
	)
}