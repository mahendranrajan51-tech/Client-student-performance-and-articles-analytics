import { BookOpen, ChevronRight, LayoutDashboard, LogOut, PlusCircle, Sparkles } from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const base = user?.role === "teacher" ? "/teacher" : "/student";
  const menuItems = [
    {
      to: base,
      icon: LayoutDashboard,
      label: "Dashboard",
      description: "Performance overview",
    },
    user?.role === "teacher"
      ? {
          to: "/teacher/articles/new",
          icon: PlusCircle,
          label: "New Article",
          description: "Create learning content",
        }
      : {
          to: "/student/articles",
          icon: BookOpen,
          label: "Articles",
          description: "Read assigned lessons",
        },
  ];

  const onLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-top">
          <Link className="brand" to={base}>
            <span>SPA</span>
            <strong>Analytics</strong>
          </Link>
          <div className="sidebar-profile">
            <span className="avatar">{user?.name?.charAt(0)?.toUpperCase() || "U"}</span>
            <div>
              <strong>{user?.name}</strong>
              <small>{user?.role} workspace</small>
            </div>
          </div>
        </div>
        <nav className="sidebar-menu" aria-label="Main navigation">
          <span className="menu-label">Menu</span>
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink className="menu-link" key={item.to} to={item.to} end={item.to === base}>
                <span className="menu-icon"><Icon size={19} /></span>
                <span className="menu-copy">
                  <strong>{item.label}</strong>
                  <small>{item.description}</small>
                </span>
                <ChevronRight className="menu-arrow" size={17} />
              </NavLink>
            );
          })}
        </nav>
        <div className="sidebar-note">
          <Sparkles size={18} />
          <span>Keep each lesson focused and easy to explore.</span>
        </div>
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
