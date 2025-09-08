

// src/pages/Dashboard.tsx

import { useAuth } from "../context/AuthContext"; // Import the useAuth hook

const Dashboard = () => {
  // Get user and loading state from the central context
  // No need for local useState or useEffect to fetch the user anymore!
  const { user, loading } = useAuth();

  if (loading) {
    return <p>Loading...</p>;
  }

  // ProtectedRoute will prevent this from showing if not logged in,
  // but it's good practice to keep the check.
  if (!user) {
    return <p>You are not logged in.</p>;
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Welcome, {user.name}</h1>
      <p>Email: {user.email}</p>
      <p>OID: {user.oid}</p>
       <div>
      <h1 >Comming Soon...</h1>
    </div>
    </div>
   
  );
};

export default Dashboard;