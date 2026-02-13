import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const { logout } = useAuth();

  return (
    <nav className="navbar">
      <h1 className="logo">AI RAG SaaS</h1>

      <div className="nav-links">

        <NavLink 
          to="/"
          className={({ isActive }) => isActive ? "active" : ""}
        >
          Home
        </NavLink>

        <NavLink 
          to="/app/chat"
          className={({ isActive }) => isActive ? "active" : ""}
        >
          Chat
        </NavLink>

        <NavLink 
          to="/app/analytics"
          className={({ isActive }) => isActive ? "active" : ""}
        >
          Analytics
        </NavLink>

        <button className="logout-btn" onClick={logout}>
          Logout
        </button>

      </div>
    </nav>
  );
};

export default Navbar;

