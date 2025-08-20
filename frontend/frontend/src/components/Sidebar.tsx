
import React from "react";
import { useNavigate } from "react-router-dom";
import { FaTachometerAlt, FaCalendarAlt, FaTasks, FaUsers } from "react-icons/fa";
import AgiraLogo from "../assets/agira-logo.png"


interface SidebarProps {
  selected: string;
  onSelect: (menu: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ selected, onSelect }) => {
const navigate = useNavigate();

 const handleLogout = () => {
    window.location.href = "http://localhost:5000/auth/logout";
  };
  const menuItems = [
    { name: "Dashboard", icon: <FaTachometerAlt />,path:"/dashboard"},
    { name: "Calendar", icon: <FaCalendarAlt />,path:"/calendar"},
    { name: "Skill", icon: <FaTasks />,path:"/skills"},
    { name: "Project", icon: <FaTasks />,path:"/projects" },
    { name: "Employee", icon: <FaUsers />,path:"/employee" }
  ];

  return (
    <div style={{
      width: "220px",
      backgroundColor: "#fff",
      borderRight: "1px solid #ddd",
      padding: "20px 10px",
      display: "flex",
      flexDirection: "column",
      height: "100vh"
    }}>
      {/* Logo */}
      <div style={{ marginBottom: "30px", textAlign: "center" }}>
        <img
          src={AgiraLogo}
          alt="Agira Logo"
          style={{ width: "140px", height: "auto" }}
        />
      </div>
      <h2 style={{ marginBottom: "30px", textAlign: "center", color: "#333" }}>Agira</h2>
      {menuItems.map((item) => (
        <div
          key={item.name}
          onClick={() => {onSelect(item.name);
            navigate(item.path);
          }}
          style={{
            padding: "10px 15px",
            marginBottom: "10px",
            cursor: "pointer",
            borderRadius: "8px",
            backgroundColor: selected === item.name ? "#007bff" : "transparent",
            color: selected === item.name ? "#fff" : "#333",
            display: "flex",
            alignItems: "center",
            gap: "10px"
          }}
        >
          {item.icon}
          {item.name}
        </div>
      ))}
      <div style={{ marginTop: "auto", padding: "10px 15px", cursor: "pointer", color: "red" }}
      onClick={handleLogout}>
        Log Out
      </div>
    </div>
  );
};

export default Sidebar;
