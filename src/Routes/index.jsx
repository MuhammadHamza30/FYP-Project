import { ProtectedRoute } from "../components/ProtectedRoute";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
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
  Doctors,
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
        <Route element={<ProtectedRoute role="player" />}>
          <Route path="/player/dashboard" element={<PlayerDashboard />} />
          <Route path="/player/ai-helper" element={<AiHelper />} />
          <Route path="/player/trainers" element={<PlayerTrainers />} />
          <Route path="/player/doctors" element={<PlayerDoctors />} />
          <Route path="/player/health-data" element={<Health />} />
          <Route path="/player/settings" element={<PlayerSettings />} />
        </Route>
        {/* Trainer routes */}
        <Route element={<ProtectedRoute role="trainer" />}>
          <Route path="/trainer/dashboard" element={<TrainerDashboard />} />
          <Route path="/trainer/players" element={<TrainerPlayers />} />
          <Route path="/trainer/settings" element={<TrainerSettings />} />
          <Route
            path="/trainer/players/health-data"
            element={<TrainerHealth />}
          />
        </Route>
        {/* Doctor routes */}
        <Route element={<ProtectedRoute role="doctor" />}>
          <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
          <Route path="/doctor/players" element={<DoctorPlayers />} />
          <Route
            path="/doctor/players/health-data"
            element={<DoctorHealth />}
          />
          <Route path="/doctor/settings" element={<DocctorSettings />} />
        </Route>
        {/* Admin routes */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route element={<ProtectedRoute role="admin" />}>
          <Route path="/admin/updates" element={<Updates />} />
          <Route path="/admin/tournments" element={<Tournments />} />
          <Route path="/admin/players" element={<Players />} />
          <Route path="/admin/trainers" element={<AdminTrainers />} />
          <Route path="/admin/doctors" element={<AdminDoctors />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default Index;
