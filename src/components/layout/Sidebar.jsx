import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="sidebar">

      <NavLink to="/app/chat">
        + New Chat
      </NavLink>

      <h3 style={{ marginTop: "20px", marginBottom: "10px", color: "#94a3b8" }}>
        Features
      </h3>

      <NavLink to="/app/home">
        Home
      </NavLink>

      <NavLink to="/app/chat">
        Chat
      </NavLink>

      <NavLink to="/app/analytics">
        Analytics
      </NavLink>

      <NavLink to="/app/profile">
        Profile
      </NavLink>

    </aside>
  );
};

export default Sidebar;
