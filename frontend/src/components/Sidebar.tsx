


import React from "react";
import { useNavigate } from "react-router-dom";
import { FaTachometerAlt, FaCalendarAlt, FaTasks, FaUsers } from "react-icons/fa";
import AgiraLogo from "../assets/agira-logo.png"
import { Box, Typography, Button } from "@mui/material";

interface SidebarProps {
  selected: string;
  onSelect: (menu: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ selected, onSelect }) => {
  const navigate = useNavigate();

  // const handleLogout = () => {
  //   window.location.href = "http://localhost:5000/auth/logout";
  // };
  
  const handleLogout = () => {
  window.location.href = `${import.meta.env.VITE_API_URL.replace('/api', '')}/auth/logout`;
};

  const menuItems = [
    { name: "Dashboard", icon: <FaTachometerAlt />, path: "/dashboard" },
    { name: "Calendar", icon: <FaCalendarAlt />, path: "/calendar" },
    { name: "Skill", icon: <FaTasks />, path: "/skills" },
    { name: "Project", icon: <FaTasks />, path: "/projects" },
    { name: "Employee", icon: <FaUsers />, path: "/employee" }
  ];

  return (
    <Box sx={{
      width: "220px",
      backgroundColor: "#fff",
      borderRight: "1px solid #ddd",
      padding: "20px 10px",
      display: "flex",
      flexDirection: "column",
      height: "100vh"
    }}>
      {/* Logo */}
      <Box sx={{ marginBottom: "30px", textAlign: "center" }}>
        <img
          src={AgiraLogo}
          alt="Agira Logo"
          style={{ width: "140px", height: "auto" }}
        />
      </Box>
      <Typography variant="h5" sx={{ marginBottom: "30px", textAlign: "center", color: "#333" }}>
        Agira
      </Typography>

      {/* Menu items container */}
      <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
        {menuItems.map((item) => (
          <Button
            key={item.name}
            onClick={() => {
              onSelect(item.name);
              navigate(item.path);
            }}
            sx={{
              width: '100%',
              justifyContent: 'flex-start',
              padding: "10px 15px",
              marginBottom: "10px",
              cursor: "pointer",
              borderRadius: "8px",
              backgroundColor: selected === item.name ? "#007bff" : "transparent",
              color: selected === item.name ? "#fff" : "#333",
              "&:hover": {
                backgroundColor: selected === item.name ? "#007bff" : "#f0f0f0",
              },
              gap: "10px"
            }}
          >
            {item.icon}
            {item.name}
          </Button>
        ))}
      </Box>

      {/* Log Out button */}
      <Button
        onClick={handleLogout}
        sx={{
          // marginTop: "auto",
          marginBottom: "80px",
          width: '100%',
          justifyContent: 'flex-start',

          padding: "10px 15px",
          cursor: "pointer",
          color: "red"
        }}
      >
        Log Out
      </Button>
    </Box>
  );
};

export default Sidebar;
