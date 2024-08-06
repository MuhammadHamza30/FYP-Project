import React, { ReactNode, useEffect, useMemo, useState } from 'react';
import { Container, Row, Col, ListGroup, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { authHandler } from '../../store/reducers';
import { MdOutlineDashboard } from "react-icons/md";
import { RiHeartPulseFill } from "react-icons/ri";
import { CiMedicalCase } from "react-icons/ci";
import { HiOutlineDotsCircleHorizontal } from "react-icons/hi";
import { CiSettings } from "react-icons/ci";
import { TbTournament } from "react-icons/tb";
import { CiBoxList } from "react-icons/ci";
import { GiArtificialHive } from "react-icons/gi";
import isMobileScreen from '../../hooks/isMobileScreen';
import { CopyRight } from '../Footer/copyRight';

const ADMIN_LINKS = [
  { label: "Add Updates", url: "/admin/updates", Icon: CiBoxList },
  { label: "Add Tournaments", url: "/admin/tournments", Icon: TbTournament },
  { label: "Players", url: "/admin/players", Icon: HiOutlineDotsCircleHorizontal },
  { label: "Trainers", url: "/admin/trainers", Icon: HiOutlineDotsCircleHorizontal },
  { label: "Doctors", url: "/admin/doctors", Icon: HiOutlineDotsCircleHorizontal },
];
const DOCTOR_LINKS = [
  { label: "Dashboard", url: "/doctor/dashboard", Icon: MdOutlineDashboard },
  { label: "Players", url: "/doctor/players", Icon: HiOutlineDotsCircleHorizontal },
  { label: "Settings", url: "/doctor/settings", Icon: CiSettings },
];
const TRAINER_LINKS = [
  { label: "Dashboard", url: "/trainer/dashboard", Icon: MdOutlineDashboard },
  { label: "Players", url: "/trainer/players", Icon: HiOutlineDotsCircleHorizontal },
  { label: "Settings", url: "/trainer/settings", Icon: CiSettings },
];
const PLAYER_LINKS = [
  { label: "Dashboard", url: "/player/dashboard", Icon: MdOutlineDashboard },
  { label: "Health Data", url: "/player/health-data", Icon: RiHeartPulseFill },
  { label: "Trainers", url: "/player/trainers", Icon: HiOutlineDotsCircleHorizontal },
  { label: "Doctors", url: "/player/doctors", Icon: CiMedicalCase },
  { label: "AI Helper", url: "/player/ai-helper", Icon: GiArtificialHive },
  { label: "Settings", url: "/player/settings", Icon: CiSettings },
];


export const MainSidebar = ({ children }) => {
  const isMobile = isMobileScreen();
  const [showSidebar, setShowSidebar] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((st) => st.user);
  useEffect(() => {
    if (isMobile) {
      setShowSidebar(false);
    } else {
      setShowSidebar(true);
    }
  }, [isMobile]);

  const handleItemClick = (url) => {
    navigate(url);
    setShowSidebar(false); // Hide sidebar on item click
  };

  const logoutHandler = () => {
    if (user) {
      if (window.confirm("Are you sure?")) {
        sessionStorage.removeItem("spms-user");
        dispatch(authHandler({
          isAuthenticated: false,
          user: null,
        }));
        window.location.replace("/");
      }
    } else {
      if (window.confirm("Are you sure?")) {
        sessionStorage.removeItem("spms-admin");
        window.location.replace("/admin");
      }
    }
  };

  const filteredLinks = useMemo(() => {
    return user ? user?.occupation?.includes("Doctor") ?
      DOCTOR_LINKS :
      user?.occupation?.includes("Trainer") ?
        TRAINER_LINKS : PLAYER_LINKS
      : ADMIN_LINKS;
  }, [user]);

  return (
    <Container fluid>
      <Row>
        <Col xs="auto" className="p-0">
          <Button
            variant="dark"
            className="d-md-none"
            onClick={() => setShowSidebar(!showSidebar)}
          >
            ☰
          </Button>
          <div
            className={`d-flex flex-column p-3 bg-black text-white sidebar-container ${showSidebar ? 'show' : ''}`}
            style={{ width: '280px', height: '100vh', position: 'fixed', left: showSidebar ? 0 : '-280px', transition: 'left 0.3s' }}
          >
            <h2 className="text-center mb-4 text-yellow">SPMS</h2>
            <h5 className="text-center mb-3">
              {user ? (
                <div className='user-profile'>
                  <img src={user?.image} alt='' />
                  <span>{user?.name}</span>
                </div>
              ) : "Admin123"}
            </h5>
            <ListGroup variant="flush" className="flex-grow-1 sidebar-items-container">
              {filteredLinks.map((link, index) => (
                <ListGroup.Item
                  key={index}
                  className={`${window.location.pathname.includes(link.url) ? 'active' : ''}`}
                  onClick={() => handleItemClick(link.url)}
                  style={{ cursor: 'pointer' }}
                >
                  <link.Icon />
                  <span>{link.label}</span>
                </ListGroup.Item>
              ))}
            </ListGroup>
            <button onClick={logoutHandler} className="font-25 btn text-yellow fw-bold mt-auto">Log Out</button>
          </div>
        </Col>
        <Col className="p-0" style={{ marginLeft: showSidebar ? "280px" : "0", transition: 'margin-left 0.3s' }}>
          <div style={{ height: "60px", backgroundColor: "black" }}></div>
          <div className="p-4">
            {children}
          </div>
          <CopyRight />
        </Col>
      </Row>
    </Container>
  );
};
