import { BookOpen, LayoutDashboard, LogOut, PlusCircle } from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const base = user?.role === "teacher" ? "/teacher" : "/student";

  const onLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Link className="brand" to={base}>
          <span>SPA</span>
          <strong>Analytics</strong>
        </Link>
        <nav>
          <NavLink to={base}><LayoutDashboard size={18} />Dashboard</NavLink>
          {user?.role === "teacher" ? (
            <NavLink to="/teacher/articles/new"><PlusCircle size={18} />New Article</NavLink>
          ) : (
            <NavLink to="/student/articles"><BookOpen size={18} />Articles</NavLink>
          )}
        </nav>
        <button className="ghost-button" onClick={onLogout}><LogOut size={18} />Logout</button>
      </aside>
      <main className="content">
        <header className="topbar">
          <div>
            <p>{user?.role}</p>
            <h1>Welcome, {user?.name}</h1>
          </div>
        </header>
        {children}
      </main>
    </div>
  );
}
