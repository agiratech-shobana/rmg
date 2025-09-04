import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [selectedMenu, setSelectedMenu] = useState("Dashboard");
const  userName = localStorage.getItem("userName") ||"Guest";
  //  Get today's date dynamically
  const today = new Date().toLocaleDateString("en-GB", {  
    weekday: "long",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  return (
    <div style={{ display: "flex", height: "100vh",width: "100vw", overflow: "hidden" }}>
      <Sidebar selected={selectedMenu} onSelect={setSelectedMenu} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column"}}>
        <Header userName={userName} date={today}/>
        <div style={{ padding: "20px", flex: 1, overflowY: "auto", }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
