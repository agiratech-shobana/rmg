
import React from "react";
import Agiralogo from "../assets/agira-logo.png";
const API_URL = import.meta.env.VITE_API_URL;

// const Home: React.FC = () => {
//   const handleMicrosoftLogin = () => {
//     window.location.href = "http://localhost:5000/auth/login";
//   };

const handleMicrosoftLogin = () => {
  window.location.href = `${import.meta.env.VITE_API_URL.replace('/api', '')}/auth/login`;
};


  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#fefefe",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        marginLeft:"500px"
      }}
    >
      {/* Top Centered Logo */}
      <div style={{ marginTop: "50px", textAlign: "center" }}>
        <img
          src={Agiralogo}
          alt="Agira Logo"
          style={{ height: "80px", marginBottom: "20px" }}
        />
      </div>

      {/* Login Card */}
      <div
        style={{
          margin: "0 auto",
          backgroundColor: "#fff3cd",
          padding: "30px",
          borderRadius: "5px",
          width: "350px",
          boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
          border: "1px solid #f5c16c",
          textAlign: "center",
        }}
      >
        {/* Microsoft login */}
        <h4>If you have an agiratech account</h4>
        <button
          onClick={handleMicrosoftLogin}
          style={{
            backgroundColor: "#fff",
            border: "1px solid #ccc",
            padding: "8px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "10px auto 20px auto",
            cursor: "pointer",
          }}
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg"
            alt="Microsoft Logo"
            style={{ width: "20px", marginRight: "8px" }}
          />
          Sign in with Microsoft
        </button>

      </div>

      {/* Footer */}
      <footer
        style={{
          backgroundColor: "#4d85c0",
          color: "#fff",
          textAlign: "center",
          padding: "5px",
          fontSize: "0.85em",
        }}
      >
        Powered by <strong>Agira Tech</strong> © 2016-2025
      </footer>
    </div>
  );
};

export default Home;
