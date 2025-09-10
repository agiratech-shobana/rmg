// // src/context/AuthContext.tsx

// import { createContext, useState, useEffect,  useContext } from "react";
// import type { ReactNode } from "react";
// import axios from "axios";

// interface User {
//   name: string;
//   email: string;
//   oid: string;
// }

// interface AuthContextType {
//   user: User | null;
//   loading: boolean;
// }

// const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

// export const AuthProvider = ({ children }: { children: ReactNode }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // This runs only once when the app starts to check for an existing session
//     axios.get(`${import.meta.env.VITE_API_BASE_URL}/auth/user`, { withCredentials: true })
//       .then(res => {
//         setUser(res.data);
//       })
//       .catch(() => {
//         setUser(null);
//       })
//       .finally(() => {
//         setLoading(false);
//       });
//   }, []);

//   const value = { user, loading };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };

//   export const useAuth = () => {
//     return useContext(AuthContext);
//   };

// src/context/AuthContext.tsx

import { createContext, useState, useEffect, useContext } from "react";
import type { ReactNode } from "react";
import axios from "axios";

// ✅ set defaults once
axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;

interface User {
  name: string;
  email: string;
  oid: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("/auth/user")
      .then(res => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
