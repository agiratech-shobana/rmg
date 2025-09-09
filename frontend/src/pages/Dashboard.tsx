

// // src/pages/Dashboard.tsx

// import { useAuth } from "../context/AuthContext"; // Import the useAuth hook

// const Dashboard = () => {
//   // Get user and loading state from the central context
//   // No need for local useState or useEffect to fetch the user anymore!
//   const { user, loading } = useAuth();

//   if (loading) {
//     return <p>Loading...</p>;
//   }

//   // ProtectedRoute will prevent this from showing if not logged in,
//   // but it's good practice to keep the check.
//   if (!user) {
//     return <p>You are not logged in.</p>;
//   }

//   return (
//     <div style={{ padding: 20 }}>
//       <h1>Welcome, {user.name}</h1>
//       <p>Email: {user.email}</p>
//       <p>OID: {user.oid}</p>
//        <div>
//       <h1 >Comming Soon...</h1>
//     </div>
//     </div>
   
//   );
// };

// export default Dashboard;


// import { useAuth } from "../context/AuthContext";

// const Dashboard = () => {
//   const { user, loading } = useAuth();

//   if (loading) {
//     return <p>Loading...</p>;
//   }

//   if (!user) {
//     return <p>You are not logged in.</p>;
//   }

//   return (
//     <div style={{ padding: 20 }}>
//       <h1>Welcome, {user.name}</h1>
//       <p>Email: {user.email}</p>
//       <p>OID: {user.oid}</p>

//       <div style={{ marginTop: 40 }}>
//         <h2>Coming Soon...</h2>
//         <p>Your dashboard content will be here.</p>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = () => {
  const { user, loading } = useAuth();
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    // fetch cached users and roles from backend
    axios.get(`${import.meta.env.VITE_API_URL}/users`, { withCredentials: true })
      .then(res => setUsers(res.data))
      .catch(err => console.error(err));

    axios.get(`${import.meta.env.VITE_API_URL}/roles`, { withCredentials: true })
      .then(res => setRoles(res.data.roles))
      .catch(err => console.error(err));
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>You are not logged in.</p>;

  return (
    <div style={{ padding: 20 }}>
      <h1>Welcome, {user.name}</h1>
      <p>Email: {user.email}</p>
      <p>OID: {user.oid}</p>

      <div style={{ marginTop: 40 }}>
        <h2>Employees</h2>
      
      </div>
    </div>
  );
};

export default Dashboard;
