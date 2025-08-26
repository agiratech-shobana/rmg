




// //this is not storing file 


// // frontend/src/pages/UsersList.tsx

// import React, { useEffect, useState } from 'react';

// // You don't need the UploadResume component anymore, so we can remove the import
// // import UploadResume from '../components/UploadResume'; 

// interface User {
//   id: number;
//   name: string;
//   email: string;
// }

// const UsersList: React.FC = () => {
//   // --- States for User List and Pagination ---
//   const [users, setUsers] = useState<User[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [selectedUser, setSelectedUser] = useState<User | null>(null);

//   // --- NEW States to manage the single upload process ---
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [uploadMessage, setUploadMessage] = useState<string>("");
//   const [resumeFile, setResumeFile] = useState<File | null>(null);
//   const [downloadFilename, setDownloadFilename] = useState<string | null>(null);
//   const [matchedSkills, setMatchedSkills] = useState<string[]>([]);

//   const USERS_PER_PAGE = 7;

//   // Fetch users when the component loads
//   useEffect(() => {
//     fetch('http://localhost:5000/api/users')
//       .then((res) => res.json())
//       .then((data) => {
//         setUsers(data);
//         setLoading(false);
//       })
//       .catch((err) => {
//         setError(err.message);
//         setLoading(false);
//       });
//   }, []);


//   useEffect(() => {
//   if (!selectedUser) return;

//   // Reset states while loading
//   setIsProcessing(false);
//   setUploadMessage("");
//   setResumeFile(null);
//   setDownloadFilename(null);
//   setMatchedSkills([]);

//   // Fetch existing resume data
//   fetch(`http://localhost:5000/api/resumes/employee/${selectedUser.id}`)
//     .then((res) => res.json())
//     .then((data) => {
//       if (data.resume) {
//         if (data.resume.formatted) {
//           setDownloadFilename(data.resume.formatted);
//         }
//         if (data.skills) {
//           setMatchedSkills(data.skills);
//         }
//         setUploadMessage("Existing resume loaded.");
//       } else {
//         setUploadMessage("No resume uploaded yet.");
//       }
//     })
//     .catch((err) => {
//       console.error("Error fetching resume:", err);
//       setUploadMessage("Failed to fetch resume data.");
//     });
// }, [selectedUser]);


//   // --- NEW function to handle the file selection ---
//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files.length > 0) {
//       setResumeFile(e.target.files[0]);
//       setUploadMessage("");
//       setDownloadFilename(null);
//     }
//   };

//   // --- NEW function to handle the form submission ---
//   const handleProcessResume = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!selectedUser || !resumeFile) {
//       setUploadMessage("Please select a user and a file.");
//       return;
//     }

//     setIsProcessing(true);
//     setUploadMessage("Processing resume... this may take a moment.");
//     setMatchedSkills([]);

//     const formData = new FormData();
//     formData.append("resume", resumeFile);

//     try {
//       const response = await fetch(`http://localhost:5000/api/resumes/process/${selectedUser.id}`, {
//         method: "POST",
//         body: formData,
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.error || "An unknown error occurred.");
//       }
      
//       setUploadMessage("Resume processed successfully!");
//       setMatchedSkills(data.matchedSkills || []);
//       setDownloadFilename(data.downloadFilename || null);

//     } catch (error: any) {
//       console.error("Upload failed:", error);
//       setUploadMessage(`Error: ${error.message}`);
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   // Filtering and pagination logic (no changes here)
//   const filteredUsers = users.filter((u) => u.name.toLowerCase().includes(searchTerm.toLowerCase()));
//   const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);
//   const currentUsers = filteredUsers.slice((currentPage - 1) * USERS_PER_PAGE, currentPage * USERS_PER_PAGE);

//   if (loading) return <div>Loading users...</div>;
//   if (error) return <div>Error: {error}</div>;

//   return (
//     <div style={{ display: 'flex', padding: '20px', gap: '20px' }}>
//       {/* Left side: Users List (No changes here) */}
//       <div style={{ flex: 1, maxWidth: '400px' }}>
//         <input type="text" placeholder="Search by name..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ padding: '8px', width: '100%', marginBottom: '20px' }} />
//         <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
//           {currentUsers.map((u) => (
//             <div key={u.id} onClick={() => setSelectedUser(u)} style={{ padding: '12px', background: selectedUser?.id === u.id ? '#e0e0e0' : '#fff', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', cursor: 'pointer' }}>
//               <strong>{u.name}</strong><br />
//               <span>{u.email}</span>
//             </div>
//           ))}
//         </div>
//         {/* Pagination UI */}
//          <div
//           style={{
//             marginTop: '20px',
//             display: 'flex',
//             justifyContent: 'space-between',
//             alignItems: 'center',
//           }}
//         >
//           <button
//             onClick={() => setCurrentPage(currentPage - 1)}
//             disabled={currentPage === 1}
//           >
//             Prev
//           </button>
//           <span>
//             Page {currentPage} of {totalPages}
//           </span>
//           <button
//             onClick={() => setCurrentPage(currentPage + 1)}
//             disabled={currentPage === totalPages}
//           >
//             Next
//           </button>
//         </div>
//       </div>

//       {/* Right side: Details and Upload Panel */}
//       <div style={{ flex: 2, padding: '20px', background: '#f9f9f9', borderRadius: '8px' }}>
//         <h3>Employee Details</h3>
//         {selectedUser ? (
//           <div>
//             <p><strong>Name:</strong> {selectedUser.name}</p>
//             <p><strong>Email:</strong> {selectedUser.email}</p>

//             {/* THIS IS THE NEW UNIFIED UPLOAD FORM */}
//             <div style={{ marginTop: '2rem', borderTop: '1px solid #eee', paddingTop: '1rem' }}>
//               <h4>Upload and Process Resume</h4>
//               <form onSubmit={handleProcessResume}>
//                 <input 
//                   id="resume-input"
//                   type="file" 
//                   accept=".pdf,.doc,.docx" 
//                   onChange={handleFileChange}
//                   disabled={isProcessing}
//                 />
//                 <br />
//                 <button 
//                   type="submit" 
//                   style={{ marginTop: '10px', padding: '6px 12px' }}
//                   disabled={isProcessing || !resumeFile}
//                 >
//                   {isProcessing ? "Processing..." : "Upload & Process"}
//                 </button>
//               </form>

//               {/* Section to show messages, skills, and download link */}
//               <div style={{marginTop: '20px'}}>
//                 {uploadMessage && <p style={{ color: uploadMessage.startsWith('Error') ? 'red' : 'green' }}>{uploadMessage}</p>}
                
//                 {matchedSkills.length > 0 && (
//                   <div>
//                     <h4>Matched Skills</h4>
//                     <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
//                       {matchedSkills.map((skill, i) => (
//                         <span key={i} style={{ padding: '6px 10px', background: '#007bff', color: '#fff', borderRadius: '6px' }}>
//                           {skill}
//                         </span>
//                       ))}
//                     </div>
//                   </div>
//                 )}
                
//                 {downloadFilename && (
//                   <div style={{ marginTop: '20px' }}>
//                     <h4>Download Formatted Resume</h4>
//                     <a href={`http://localhost:5000/api/resumes/download/${downloadFilename}`} target="_blank" rel="noopener noreferrer">
//                       Download PDF
//                     </a>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         ) : (
//           <p>Click on a user card to view details and upload a resume.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default UsersList;


// frontend/src/pages/UsersList.tsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  TextField,
  Pagination,
  CircularProgress,
  Divider,
  Chip,
} from "@mui/material";

interface User {
  id: number;
  name: string;
  email: string;
}

const UsersList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<string>("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [downloadFilename, setDownloadFilename] = useState<string | null>(null);
  const [matchedSkills, setMatchedSkills] = useState<string[]>([]);

  const [userLoggedHours, setUserLoggedHours] = useState<number | null>(null);
  const [hoursLoading, setHoursLoading] = useState(false);

  const USERS_PER_PAGE = 7;

  useEffect(() => {
    fetch("http://localhost:5000/api/users")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!selectedUser) return;

    setIsProcessing(false);
    setUploadMessage("");
    setResumeFile(null);
    setDownloadFilename(null);
    setMatchedSkills([]);

    fetch(`http://localhost:5000/api/resumes/employee/${selectedUser.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.resume) {
          if (data.resume.formatted) setDownloadFilename(data.resume.formatted);
          if (data.skills) setMatchedSkills(data.skills);
          setUploadMessage("Existing resume loaded.");
        } else {
          setUploadMessage("No resume uploaded yet.");
        }
      })
      .catch(() => setUploadMessage("Failed to fetch resume data."));
  }, [selectedUser]);


  useEffect(() => {
    if (!selectedUser) {
      setUserLoggedHours(null);
      return;
    }
    setHoursLoading(true);
    fetch(`http://localhost:5000/api/users/${selectedUser.id}/logged-hours`)
      .then((res) => res.json())
      .then((data) => {
        setUserLoggedHours(data.loggedHours);
      })
      .catch((err) => {
        console.error("Failed to fetch logged hours:", err);
        setUserLoggedHours(null);
      })
      .finally(() => {
        setHoursLoading(false);
      });
  }, [selectedUser]);


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setResumeFile(e.target.files[0]);
      setUploadMessage("");
      setDownloadFilename(null);
    }
  };

  const handleProcessResume = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !resumeFile) {
      setUploadMessage("Please select a user and a file.");
      return;
    }

    setIsProcessing(true);
    setUploadMessage("Processing resume...");

    const formData = new FormData();
    formData.append("resume", resumeFile);

    try {
      const response = await fetch(
        `http://localhost:5000/api/resumes/process/${selectedUser.id}`,
        { method: "POST", body: formData }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unknown error");
      setUploadMessage("Resume processed successfully!");
      setMatchedSkills(data.matchedSkills || []);
      setDownloadFilename(data.downloadFilename || null);
    } catch (error: any) {
      setUploadMessage(`Error: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);
  const currentUsers = filteredUsers.slice(
    (currentPage - 1) * USERS_PER_PAGE,
    currentPage * USERS_PER_PAGE
  );

  if (loading)
    return (
      <Box p={4} textAlign="center">
        <CircularProgress />
        <Typography mt={2}>Loading users...</Typography>
      </Box>
    );

  if (error)
    return (
      <Box p={4} textAlign="center" color="red">
        <Typography>Error: {error}</Typography>
      </Box>
    );

  return (
    <Box display="flex" height="100vh">
      {/* Left Panel: User List */}
      <Box
        flex={1}
        // maxWidth="350px"
        width={900}
        p={3}
        borderRight="1px solid #e0e0e0"
        display="flex"
        flexDirection="column"
      >
        <TextField
          label="Search by name"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Box flex={1} overflow="auto" display="flex" flexDirection="column" gap={2}>
          {currentUsers.map((u) => (
            <Card
              key={u.id}
              onClick={() => setSelectedUser(u)}
              sx={{
                cursor: "pointer",
                border:
                  selectedUser?.id === u.id
                    ? "2px solid #1976d2"
                    : "1px solid #e0e0e0",
              }}
            >
              <CardContent>
                <Typography variant="subtitle1" fontWeight="bold">
                  {u.name}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {u.email}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
        <Box mt={2} display="flex" justifyContent="center">
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(_, value) => setCurrentPage(value)}
            color="primary"
          />
        </Box>
      </Box>

      {/* Right Panel: User Details & Resume Upload */}
      <Box flex={2} p={3} overflow="auto" width={"100%"}>
        <Card sx={{ height: "100%" }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Employee Details
            </Typography>
            {selectedUser ? (
              <>
                <Typography>
                  <strong>Name:</strong> {selectedUser.name}
                </Typography>
                <Typography>
                  <strong>Email:</strong> {selectedUser.email}
                </Typography>
                {hoursLoading ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <CircularProgress size={16} sx={{ mr: 1 }} />
                    <Typography>Loading hours...</Typography>
                  </Box>
                ) : (
                  userLoggedHours !== null && (
                    <Typography>
                      <strong>Logged Hours:</strong> {userLoggedHours} hrs
                    </Typography>
                  )
                )}


                <Divider sx={{ my: 3 }} />

                <Typography variant="subtitle1" gutterBottom>
                  Upload and Process Resume
                </Typography>
                <form onSubmit={handleProcessResume}>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    disabled={isProcessing}
                  />
                  <br />
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{ mt: 2 }}
                    disabled={isProcessing || !resumeFile}
                  >
                    {isProcessing ? "Processing..." : "Upload & Process"}
                  </Button>
                </form>

                {uploadMessage && (
                  <Typography
                    mt={2}
                    color={
                      uploadMessage.startsWith("Error") ? "error" : "success.main"
                    }
                  >
                    {uploadMessage}
                  </Typography>
                )}

                {matchedSkills.length > 0 && (
                  <Box mt={3}>
                    <Typography fontWeight="bold">Matched Skills</Typography>
                    <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
                      {matchedSkills.map((skill, i) => (
                        <Chip key={i} label={skill} color="primary" />
                      ))}
                    </Box>
                  </Box>
                )}

                {downloadFilename && (
                  <Box mt={3}>
                    <Typography fontWeight="bold">
                      Download Formatted Resume
                    </Typography>
                    <Button
                      href={`http://localhost:5000/api/resumes/download/${downloadFilename}`}
                      target="_blank"
                      variant="outlined"
                      sx={{ mt: 1 }}
                    >
                      Download PDF
                    </Button>
                  </Box>
                )}
              </>
            ) : (
              <Typography>Select a user to view details and upload resume.</Typography>
            )}
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default UsersList;
