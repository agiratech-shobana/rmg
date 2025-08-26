// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Home from "./pages/Home";
// import Dashboard from "./pages/Dashboard";
// // import React, { useState } from 'react';
// import Layout from "./components/Layout";
// import Employee from "./pages/Employee";
// import ProjectDashboard from "./components/ProjectDashboard";
// import ProjectDetailPage from "./pages/ProjectDetailPage";


// const App: React.FC = () => {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
//         <Route path="/employee" element={<Layout><Employee/></Layout>} />
//         <Route path="/projects/:id" element={<Layout><ProjectDetailPage /></Layout>} />


// <Route path="/projects" element={<Layout><ProjectDashboard /></Layout>} />
//       </Routes>
//     </Router>
//   );
// };

// export default App;


// src/App.tsx

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";      // <-- IMPORT
import ProtectedRoute from "./components/ProtectedRoute"; // <-- IMPORT

// Your Page Components
import Home from "./pages/Home";  
import Dashboard from "./pages/Dashboard";
import Layout from "./components/Layout";
import Employee from "./pages/Employee";
import ProjectDashboard from "./components/ProjectDashboard";
import ProjectDetailPage from "./pages/ProjectDetailPage";

const App: React.FC = () => {
  return (
    // Wrap the entire application in AuthProvider
    <AuthProvider>
      <Router>
        <Routes>
          {/* ============== PUBLIC ROUTE ============== */}
          {/* Anyone can visit the login page */}
          <Route path="/" element={<Home />} />

          {/* ============== PROTECTED ROUTES ============== */}
          {/* Only logged-in users can visit these pages */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
            <Route path="/employee" element={<Layout><Employee /></Layout>} />
            <Route path="/projects/:id" element={<Layout><ProjectDetailPage /></Layout>} />
            <Route path="/projects" element={<Layout><ProjectDashboard /></Layout>} />
          </Route>

        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;