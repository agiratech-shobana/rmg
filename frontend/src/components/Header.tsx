

import React from "react";
import { useAuth } from "../context/AuthContext"; // Import the useAuth hook to access user data

// This helper function creates a nicely formatted date string.
// Example: "Thursday, September 4, 2025"
const getFormattedDate = () => {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// The component no longer needs to accept any props.
const Header: React.FC = () => {
  // Get the global user object and loading state from the AuthContext.
  const { user, loading } = useAuth();

  // Get the current date by calling our helper function.
  const date = getFormattedDate();

  // This logic safely determines what name to show:
  // - If loading, show "..."
  // - If not loading and no user, show "Guest"
  // - If a user is logged in, show their name
  const displayName = loading ? "..." : (user ? user.name : "Guest");

  return (
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "15px 20px",
      backgroundColor: "#fff",
      borderBottom: "1px solid #ddd"
    }}>
      {/* Display the name and the date here */}
      <h3 style={{ margin: 0 }}>Hey, {displayName}</h3>
      <span style={{ color: "#888" }}>{date}</span>
    </div>
  );
};

export default Header;