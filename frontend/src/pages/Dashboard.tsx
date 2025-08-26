
// import { useEffect, useState } from "react";
// import axios from "axios";

// interface User {
//   name: string;
//   email: string;
//   oid: string;
// }

// const Dashboard = () => {
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     axios.get("http://localhost:5000/auth/user", { withCredentials: true })
//       .then(res => setUser(res.data))
//       .catch(err => {
//         console.error("Failed to load user:", err);
//         setUser(null);
//       })
//       .finally(() => setLoading(false));
//   }, []);

//   // const handleLogout = () => {
//   //   window.location.href = "http://localhost:5000/auth/logout";
//   // };

//   if (loading) return <p>Loading...</p>;

//   if (!user) {
//     return <p>You are not logged in.</p>;
//   }

//   return (
    
//     <div style={{ padding: 20 }}>
//       <h1>Welcome, {user.name}</h1>
//       <p>Email: {user.email}</p>
//       <p>OID: {user.oid}</p>
//       {/* <button onClick={handleLogout}>Logout</button> */}
//     </div>
//   );
// };

// export default Dashboard;



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
    </div>
  );
};

export default Dashboard;