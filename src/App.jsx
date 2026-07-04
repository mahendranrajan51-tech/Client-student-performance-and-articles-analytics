import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import TeacherDashboard from "./pages/TeacherDashboard";
import ArticleEditor from "./pages/ArticleEditor";
import StudentDashboard from "./pages/StudentDashboard";
import ArticleList from "./pages/ArticleList";
import ArticleReader from "./pages/ArticleReader";
import { useAuth } from "./context/AuthContext";

function HomeRedirect() {
  const { user, loading } = useAuth();
  if (loading) return <main className="center-screen">Loading...</main>;
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={user.role === "teacher" ? "/teacher" : "/student"} replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeRedirect />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/teacher" element={<ProtectedRoute roles={["teacher"]}><TeacherDashboard /></ProtectedRoute>} />
      <Route path="/teacher/articles/new" element={<ProtectedRoute roles={["teacher"]}><ArticleEditor /></ProtectedRoute>} />
      <Route path="/teacher/articles/:id/edit" element={<ProtectedRoute roles={["teacher"]}><ArticleEditor /></ProtectedRoute>} />
      <Route path="/student" element={<ProtectedRoute roles={["student"]}><StudentDashboard /></ProtectedRoute>} />
      <Route path="/student/articles" element={<ProtectedRoute roles={["student"]}><ArticleList /></ProtectedRoute>} />
      <Route path="/student/articles/:id" element={<ProtectedRoute roles={["student"]}><ArticleReader /></ProtectedRoute>} />
    </Routes>
  );
}
