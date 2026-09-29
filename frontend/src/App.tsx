import { Routes, Route } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import ApplyJob from "./pages/ApplyJob";
import CreateJob from "./pages/CreateJob";
import CandidateDashboard from "./pages/CandidateDashboard";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/new" element={<ProtectedRoute allowedRoles={["EMPLOYER"]}><CreateJob /></ProtectedRoute>} />
        <Route path="/jobs/:id" element={<JobDetails />} />
        <Route path="/jobs/:id/apply" element={<ProtectedRoute allowedRoles={["CANDIDATE"]}><ApplyJob /></ProtectedRoute>} />

        <Route path="/candidate" element={<ProtectedRoute allowedRoles={["CANDIDATE"]}><CandidateDashboard /></ProtectedRoute>} />
        <Route path="/recruiter" element={<ProtectedRoute allowedRoles={["EMPLOYER"]}><RecruiterDashboard /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute allowedRoles={["ADMIN"]}><AdminDashboard /></ProtectedRoute>} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </AppLayout>
  );
}
