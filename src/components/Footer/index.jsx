import { Col, Container, Row } from "react-bootstrap"
import { GmailIcon } from "../../Assets/gmail"
import { FacebookIcon } from "../../Assets/facebook"
import { TwitterIcon } from "../../Assets/twitter"
import { WhatsappIcon } from "../../Assets/whatsapp"
import { CopyRight } from "./copyRight"

export const Footer = () => {

	return (
		<footer className="text-white">
			<div className="bg-light text-dark py-5">
				<Container>
					<Row className="footer-links">
						<Col md={6} className="mb-3 mb-md-0">
							<h1 className="m-0 fw-bold">SPMS</h1>
							<p className="mb-1">Squash Player Management System</p>
							<ul className="list-unstyled">
								<li>
									<GmailIcon />
									<span className="fw-500">Gmail</span>
								</li>
								<li>
									<FacebookIcon />
									<span className="fw-500">Facebook</span>
								</li>
								<li>
									<TwitterIcon />
									<span className="fw-500">Twitter</span>
								</li>
								<li>
									<WhatsappIcon />
									<span className="fw-500">WhatsApp</span>
								</li>
							</ul>
						</Col>
						<Col md={2} className="mb-3 mb-md-0">
							<h5>About Us</h5>
							<ul className="list-unstyled">
								<li className="mb-2"><a href="#home" className="text-white">Our Story</a></li>
								<li  className="mb-2"><a href="#features" className="text-white">Our Team</a></li>
								<li  className="mb-2"><a href="#pricing" className="text-white">Careers</a></li>
							</ul>
						</Col>
						<Col md={2}>
							<h5>Staff</h5>
							<ul className="list-unstyled">
								<li  className="mb-2"><a href="#services" className="text-white">Players</a></li>
								<li  className="mb-2"><a href="#portfolio" className="text-white">Trainers</a></li>
								<li  className="mb-2"><a href="#team" className="text-white">Doctors</a></li>
							</ul>
						</Col>
						<Col md={2}>
							<h5>Contact</h5>
							<ul className="list-unstyled">
								<li  className="mb-2"><a href="#services" className="text-white">Contact us</a></li>
								<li  className="mb-2"><a href="#services" className="text-white">Location</a></li>
								<li  className="mb-2"><a href="#services" className="text-white">Feedbacks</a></li>
							</ul>
						</Col>
					</Row>
				</Container>
			</div>
			<CopyRight />
		</footer>
	)
}