import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import CoachDashboard from "./pages/coach/Dashboard";
import AdminDashboard from "./pages/admin/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicTrainer from "./pages/public/PublicTrainer";
import SharedExercises from "./pages/public/SharedExercises";
import { ToastContainer } from "react-toastify";
import StudentDashboard from "./pages/student/StudentDashboard";
import Landing from './pages/Landing';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <div dir="rtl" className="rtl">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/coach/dashboard"
            element={
              <ProtectedRoute role="coach">
                <CoachDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/dashboard"
            element={
              <ProtectedRoute role="student">
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute role="admin">
        <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/shared-exercises/:shareId" element={<SharedExercises />} />
          <Route path="/public/:phone" element={<PublicTrainer />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={true}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </BrowserRouter>
    </div>
  );
}

export default App;
