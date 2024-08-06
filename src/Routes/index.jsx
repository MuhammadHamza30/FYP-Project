import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import {
  AdminLogin,
  AiHelper,
  DocctorSettings,
  DoctorDashboard,
  DoctorHealth,
  DoctorPlayers,
  AdminDoctors,
  Health,
  Home,
  Login,
  PlayerDashboard,
  PlayerDoctors,
  PlayerSettings,
  PlayerTrainers,
  Players,
  Registeration,
  Tournments,
  TrainerDashboard,
  TrainerHealth,
  TrainerPlayers,
  TrainerSettings,
  AdminTrainers,
  Updates,
  Trainers,
  Doctors
} from "../pages";

const Index = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/trainers" element={<Trainers />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/register" element={<Registeration />} />
        <Route path="/login" element={<Login />} />
        {/* Player routes */}
        <Route path="/player/dashboard" element={<PlayerDashboard />} />
        <Route path="/player/ai-helper" element={<AiHelper />} />
        <Route path="/player/trainers" element={<PlayerTrainers />} />
        <Route path="/player/doctors" element={<PlayerDoctors />} />
        <Route path="/player/health-data" element={<Health />} />
        <Route path="/player/settings" element={<PlayerSettings />} />
        {/* Trainer routes */}
        <Route path="/trainer/dashboard" element={<TrainerDashboard />} />
        <Route path="/trainer/players" element={<TrainerPlayers />} />
        <Route path="/trainer/settings" element={<TrainerSettings />} />
        <Route path="/trainer/players/health-data" element={<TrainerHealth />} />
        {/* Doctor routes */}
        <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
        <Route path="/doctor/players" element={<DoctorPlayers />} />
        <Route path="/doctor/players/health-data" element={<DoctorHealth />} />
        <Route path="/doctor/settings" element={<DocctorSettings />} />
        {/* Admin routes */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/updates" element={<Updates />} />
        <Route path="/admin/tournments" element={<Tournments />} />
        <Route path="/admin/players" element={<Players />} />
        <Route path="/admin/trainers" element={<AdminTrainers />} />
        <Route path="/admin/doctors" element={<AdminDoctors />} />
      </Routes>
    </Router>
  );
};

export default Index;
