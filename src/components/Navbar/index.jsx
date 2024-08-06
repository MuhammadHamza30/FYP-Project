import { useState } from 'react';
import { Navbar as BNav, Nav, Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
export const Navbar = () => {
	const [active, setActive] = useState("home");
	return (
		<BNav bg="dark" variant="dark" expand="lg">
			<Container>
				<BNav.Brand className='text-yellow font-25' href="/">SPMS</BNav.Brand>
				<BNav.Toggle aria-controls="basic-navbar-nav" />
				<BNav.Collapse id="basic-navbar-nav">
					<Nav className="w-100 d-flex align-items-center justify-content-end links-container">
						<Link onClick={() => setActive("home")} to="/" className={active.includes("home") ? "text-yellow" : ""}>Home</Link>
						<Link onClick={() => setActive("trainer")} to="/trainers" className={active.includes("trainer") ? "text-yellow": ""}>Trainers</Link>
						<Link onClick={() => setActive("doctor")} to="/doctors" className={active.includes("doctor") ? "text-yellow": ""}>Doctors</Link>
						<Nav.Link href="#about">About Us</Nav.Link>
						<Link to="/login">
							<Button className='primary-button'>Login</Button>
						</Link>
					</Nav>
				</BNav.Collapse>
			</Container>
		</BNav>
	)
}