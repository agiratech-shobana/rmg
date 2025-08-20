import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
// import React, { useState } from 'react';
import Layout from "./components/Layout";
import Employee from "./pages/Employee";
import ProjectDashboard from "./components/ProjectDashboard";
// import Sidebar from './components/Sidebar';
// import Header from './components/Header';

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/dashboard" element={<Dashboard />} />
//       </Routes>
//     </Router>
//   );
// }

// /
// import React from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Layout from "./components/Layout";
// import Home from "./pages/Home";
// import Dashboard from "./pages/Dashboard";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
        <Route path="/employee" element={<Layout><Employee/></Layout>} />

<Route path="/projects" element={<Layout><ProjectDashboard /></Layout>} />
      </Routes>
    </Router>
  );
};

export default App;
