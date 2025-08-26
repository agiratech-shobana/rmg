
import React from "react";

interface HeaderProps {
  userName: string;
  date: string;
}

const Header: React.FC<HeaderProps> = ({ userName, date }) => {
  return (
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "15px 20px",
      backgroundColor: "#fff",
      borderBottom: "1px solid #ddd"
    }}>
      <h3 style={{ margin: 0 }}>Hey, {userName}</h3>
      <span style={{ color: "#888" }}>{date}</span>
    </div>
  );
};

export default Header;
