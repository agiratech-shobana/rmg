

// // frontend/src/pages/UsersList.tsx
// import React, { useEffect, useState } from "react";
// import {
//   Box,
//   Button,
//   Card,
//   CardContent,
//   Typography,
//   TextField,
//   Pagination,
//   CircularProgress,
//   Divider,
//   Chip,
// } from "@mui/material";
// import axios from "axios";
// interface User {
//   id: number;
//   name: string;
//   email: string;
// }

// const UsersList: React.FC = () => {
//   const [users, setUsers] = useState<User[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [selectedUser, setSelectedUser] = useState<User | null>(null);

//   const [isProcessing, setIsProcessing] = useState(false);
//   const [uploadMessage, setUploadMessage] = useState<string>("");
//   const [resumeFile, setResumeFile] = useState<File | null>(null);
//   const [downloadFilename, setDownloadFilename] = useState<string | null>(null);
//   const [matchedSkills, setMatchedSkills] = useState<string[]>([]);

//   const [userLoggedHours, setUserLoggedHours] = useState<number | null>(null);
//   const [hoursLoading, setHoursLoading] = useState(false);
//   const [lastProject, setLastProject] = useState<ProjectInfo | null>(null);
//   const [lastProjectLoading, setLastProjectLoading] = useState(false);  

//   const USERS_PER_PAGE = 7;

//   useEffect(() => {
//     fetch("http://localhost:5000/api/users")
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
//     if (!selectedUser) return;

//     setIsProcessing(false);
//     setUploadMessage("");
//     setResumeFile(null);
//     setDownloadFilename(null);
//     setMatchedSkills([]);

//     fetch(`http://localhost:5000/api/resumes/employee/${selectedUser.id}`)
//       .then((res) => res.json())
//       .then((data) => {
//         if (data.resume) {
//           if (data.resume.formatted) setDownloadFilename(data.resume.formatted);
//           if (data.skills) setMatchedSkills(data.skills);
//           setUploadMessage("Existing resume loaded.");
//         } else {
//           setUploadMessage("No resume uploaded yet.");
//         }
//       })
//       .catch(() => setUploadMessage("Failed to fetch resume data."));
//   }, [selectedUser]);


//   useEffect(() => {
//     if (!selectedUser) {
//       setUserLoggedHours(null);
//       return;
//     }
//     setHoursLoading(true);
//     fetch(`http://localhost:5000/api/users/${selectedUser.id}/logged-hours`)
//       .then((res) => res.json())
//       .then((data) => {
//         setUserLoggedHours(data.loggedHours);
//       })
//       .catch((err) => {
//         console.error("Failed to fetch logged hours:", err);
//         setUserLoggedHours(null);
//       })
//       .finally(() => {
//         setHoursLoading(false);
//       });
//   }, [selectedUser]);

//   useEffect(() => {
//     if (!selectedUser) {
//       setLastProject(null);
//       return;
//     }

//     setLastProjectLoading(true);
//     axios.get(`http://localhost:5000/api/users/${selectedUser.id}/memberships`)
//       .then(res => {
//         const memberships = res.data?.user?.memberships;
//         if (memberships && memberships.length > 0) {
//             const latestMembership = memberships[memberships.length - 1]; // Get the last project in the array
//             setLastProject(latestMembership.project);
//         } else {
//             setLastProject(null);
//         }
//       })
//       .catch(err => {
//         console.error("Failed to fetch memberships:", err);
//         setLastProject(null);
//       })
//       .finally(() => {
//         setLastProjectLoading(false);
//       });
//   }, [selectedUser]);



//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files?.length) {
//       setResumeFile(e.target.files[0]);
//       setUploadMessage("");
//       setDownloadFilename(null);
//     }
//   };

//   const handleProcessResume = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!selectedUser || !resumeFile) {
//       setUploadMessage("Please select a user and a file.");
//       return;
//     }

//     setIsProcessing(true);
//     setUploadMessage("Processing resume...");

//     const formData = new FormData();
//     formData.append("resume", resumeFile);

//     try {
//       const response = await fetch(
//         `http://localhost:5000/api/resumes/process/${selectedUser.id}`,
//         { method: "POST", body: formData }
//       );
//       const data = await response.json();
//       if (!response.ok) throw new Error(data.error || "Unknown error");
//       setUploadMessage("Resume processed successfully!");
//       setMatchedSkills(data.matchedSkills || []);
//       setDownloadFilename(data.downloadFilename || null);
//     } catch (error: any) {
//       setUploadMessage(`Error: ${error.message}`);
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   const filteredUsers = users.filter((u) =>
//     u.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );
//   const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);
//   const currentUsers = filteredUsers.slice(
//     (currentPage - 1) * USERS_PER_PAGE,
//     currentPage * USERS_PER_PAGE
//   );

//   if (loading)
//     return (
//       <Box p={4} textAlign="center">
//         <CircularProgress />
//         <Typography mt={2}>Loading users...</Typography>
//       </Box>
//     );

//   if (error)
//     return (
//       <Box p={4} textAlign="center" color="red">
//         <Typography>Error: {error}</Typography>
//       </Box>
//     );

//   return (
//     <Box display="flex" height="100vh">
//       {/* Left Panel: User List */}
//       <Box
//         flex={1}
//         // maxWidth="350px"
//         width={900}
//         p={3}
//         borderRight="1px solid #e0e0e0"
//         display="flex"
//         flexDirection="column"
//       >
//         <TextField
//           label="Search by name"
//           variant="outlined"
//           fullWidth
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           sx={{ mb: 2 }}
//         />
//         <Box flex={1} overflow="auto" display="flex" flexDirection="column" gap={2}>
//           {currentUsers.map((u) => (
//             <Card
//               key={u.id}
//               onClick={() => setSelectedUser(u)}
//               sx={{
//                 cursor: "pointer",
//                 border:
//                   selectedUser?.id === u.id
//                     ? "2px solid #1976d2"
//                     : "1px solid #e0e0e0",
//               }}
//             >
//               <CardContent>
//                 <Typography variant="subtitle1" fontWeight="bold">
//                   {u.name}
//                 </Typography>
//                 <Typography variant="body2" color="textSecondary">
//                   {u.email}
//                 </Typography>
//               </CardContent>
//             </Card>
//           ))}
//         </Box>
//         <Box mt={2} display="flex" justifyContent="center">
//           <Pagination
//             count={totalPages}
//             page={currentPage}
//             onChange={(_, value) => setCurrentPage(value)}
//             color="primary"
//           />
//         </Box>
//       </Box>

//       {/* Right Panel: User Details & Resume Upload */}
//       <Box flex={2} p={3} overflow="auto" width={"100%"}>
//         <Card sx={{ height: "100%" }}>
//           <CardContent>
//             <Typography variant="h6" gutterBottom>
//               Employee Details
//             </Typography>
//             {selectedUser ? (
//               <>
//                 <Typography>
//                   <strong>Name:</strong> {selectedUser.name}
//                 </Typography>
//                 <Typography>
//                   <strong>Email:</strong> {selectedUser.email}
//                 </Typography>
//                 {hoursLoading ? (
//                   <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
//                     <CircularProgress size={16} sx={{ mr: 1 }} />
//                     <Typography>Loading hours...</Typography>
//                   </Box>
//                 ) : (
//                   userLoggedHours !== null && (
//                     <Typography>
//                       <strong>Logged Hours:</strong> {userLoggedHours} hrs
//                     </Typography>
//                   )
//                 )}

//                   {lastProjectLoading ? (
//                     <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
//                         <CircularProgress size={16} sx={{ mr: 1 }} />
//                         <Typography>Loading last project...</Typography>
//                     </Box>
//                 ) : (
//                     lastProject && (
//                         <Typography>
//                             <strong>Last Project:</strong> {lastProject.name}
//                         </Typography>
//                     )
//                 )}


//                 <Divider sx={{ my: 3 }} />

//                 <Typography variant="subtitle1" gutterBottom>
//                   Upload and Process Resume
//                 </Typography>
//                 <form onSubmit={handleProcessResume}>
//                   <input
//                     type="file"
//                     accept=".pdf,.doc,.docx"
//                     onChange={handleFileChange}
//                     disabled={isProcessing}
//                   />
//                   <br />
//                   <Button
//                     type="submit"
//                     variant="contained"
//                     sx={{ mt: 2 }}
//                     disabled={isProcessing || !resumeFile}
//                   >
//                     {isProcessing ? "Processing..." : "Upload & Process"}
//                   </Button>
//                 </form>

//                 {uploadMessage && (
//                   <Typography
//                     mt={2}
//                     color={
//                       uploadMessage.startsWith("Error") ? "error" : "success.main"
//                     }
//                   >
//                     {uploadMessage}
//                   </Typography>
//                 )}

//                 {matchedSkills.length > 0 && (
//                   <Box mt={3}>
//                     <Typography fontWeight="bold">Matched Skills</Typography>
//                     <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
//                       {matchedSkills.map((skill, i) => (
//                         <Chip key={i} label={skill} color="primary" />
//                       ))}
//                     </Box>
//                   </Box>
//                 )}

//                 {downloadFilename && (
//                   <Box mt={3}>
//                     <Typography fontWeight="bold">
//                       Download Formatted Resume
//                     </Typography>
//                     <Button
//                       href={`http://localhost:5000/api/resumes/download/${downloadFilename}`}
//                       target="_blank"
//                       variant="outlined"
//                       sx={{ mt: 1 }}
//                     >
//                       Download PDF
//                     </Button>
//                   </Box>
//                 )}
//               </>
//             ) : (
//               <Typography>Select a user to view details and upload resume.</Typography>
//             )}
//           </CardContent>
//         </Card>
//       </Box>
//     </Box>
//   );
// };

// export default UsersList;


// import React, { useEffect, useState } from "react";
// import {
//   Box,
//   Button,
//   Card,
//   CardContent,
//   Typography,
//   TextField,
//   Pagination,
//   CircularProgress,
//   Divider,
//   Chip,
//   Paper,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
// } from "@mui/material";
// import { styled } from "@mui/system";
// import axios from "axios";

// // Styled component for the user cards in the list
// const StyledUserCard = styled(Card)(({ theme }) => ({
//   cursor: "pointer",
//   transition: "all 0.2s ease-in-out",
//   "&:hover": {
//     boxShadow: '0px 6px 12px rgba(0,0,0,0.1)',
//     transform: "translateY(-2px)",
//   },
// }));

// interface User {
//   id: number;
//   name: string;
//   email: string;
// }

// interface ProjectInfo {
//   id: number;
//   name: string;
// }

// // Interface for a skill, with name and id
// interface Skill {
//   id: number;
//   name: string;
// }

// const UsersList: React.FC = () => {
//   const [users, setUsers] = useState<User[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [selectedUser, setSelectedUser] = useState<User | null>(null);

//   const [isProcessing, setIsProcessing] = useState(false);
//   const [uploadMessage, setUploadMessage] = useState<string>("");
//   const [resumeFile, setResumeFile] = useState<File | null>(null);
//   const [downloadFilename, setDownloadFilename] = useState<string | null>(null);
  
//   // States for other data
//   const [userLoggedHours, setUserLoggedHours] = useState<number | null>(null);
//   const [hoursLoading, setHoursLoading] = useState(false);
//   const [lastProject, setLastProject] = useState<ProjectInfo | null>(null);
//   const [lastProjectLoading, setLastProjectLoading] = useState(false);
  
//   // --- NEW STATES FOR MANUAL SKILL ADDITION ---
//   const [allSkills, setAllSkills] = useState<Skill[]>([]);
//   const [employeeSkills, setEmployeeSkills] = useState<Skill[]>([]);
//   const [newSkillName, setNewSkillName] = useState('');
//   const [addSkillLoading, setAddSkillLoading] = useState(false);
//   const [skillsLoading, setSkillsLoading] = useState(false);
//   // --- END NEW STATES ---

//   const USERS_PER_PAGE = 7;

//   useEffect(() => {
//     // Consolidated to use axios for consistency
//     axios
//       .get("http://localhost:5000/api/users")
//       .then((res) => {
//         setUsers(res.data);
//       })
//       .catch((err) => {
//         setError(err.message);
//       })
//       .finally(() => {
//         setLoading(false);
//       });
//   }, []);

//   useEffect(() => {
//     if (!selectedUser) return;

//     setIsProcessing(false);
//     setUploadMessage("");
//     setResumeFile(null);
//     setDownloadFilename(null);
    
//     // Consolidated to use axios for consistency
//     axios
//       .get(`http://localhost:5000/api/resumes/employee/${selectedUser.id}`)
//       .then((res) => {
//         const data = res.data;
//         if (data.resume) {
//           if (data.resume.formatted) setDownloadFilename(data.resume.formatted);
//           setUploadMessage("Existing resume loaded.");
//         } else {
//           setUploadMessage("No resume uploaded yet.");
//         }
//       })
//       .catch(() => setUploadMessage("Failed to fetch resume data."));
//   }, [selectedUser]);

//   useEffect(() => {
//     if (!selectedUser) {
//       setUserLoggedHours(null);
//       return;
//     }
//     setHoursLoading(true);
//     // Consolidated to use axios for consistency
//     axios
//       .get(`http://localhost:5000/api/users/${selectedUser.id}/logged-hours`)
//       .then((res) => {
//         setUserLoggedHours(res.data.loggedHours);
//       })
//       .catch((err) => {
//         console.error("Failed to fetch logged hours:", err);
//         setUserLoggedHours(null);
//       })
//       .finally(() => {
//         setHoursLoading(false);
//       });
//   }, [selectedUser]);

//   useEffect(() => {
//     if (!selectedUser) {
//       setLastProject(null);
//       return;
//     }

//     setLastProjectLoading(true);
//     axios
//       .get(`http://localhost:5000/api/users/${selectedUser.id}/memberships`)
//       .then((res) => {
//         const memberships = res.data?.user?.memberships;
//         if (memberships && memberships.length > 0) {
//           const latestMembership = memberships[memberships.length - 1];
//           setLastProject(latestMembership.project);
//         } else {
//           setLastProject(null);
//         }
//       })
//       .catch((err) => {
//         console.error("Failed to fetch memberships:", err);
//         setLastProject(null);
//       })
//       .finally(() => {
//         setLastProjectLoading(false);
//       });
//   }, [selectedUser]);
  
//   // --- NEW: Fetch all skills and employee's existing skills ---
//   useEffect(() => {
//     const fetchSkills = async () => {
//       setSkillsLoading(true);
//       if (!selectedUser) {
//         setAllSkills([]);
//         setEmployeeSkills([]);
//         setSkillsLoading(false);
//         return;
//       }
//       try {
//         const [allSkillsRes, employeeSkillsRes] = await Promise.all([
//           axios.get('http://localhost:5000/api/resumes/skills'),
//           axios.get(`http://localhost:5000/api/resumes/employees/${selectedUser.id}/skills`),
//         ]);
//         setAllSkills(allSkillsRes.data.skills || []);
//         const uniqueSkills = [...new Set(employeeSkillsRes.data.employeeSkills.map((s: Skill) => s.name))]
//             .map(name => ({ id: allSkillsRes.data.skills.find((s: Skill) => s.name === name)?.id, name }));
        
//         setEmployeeSkills(uniqueSkills);
//       } catch (err) {
//         console.error("Failed to fetch skills:", err);
//       } finally {
//         setSkillsLoading(false);
//       }
//     };
//     fetchSkills();
//   }, [selectedUser]);
//   // --- END NEW ---

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files?.length) {
//       setResumeFile(e.target.files[0]);
//       setUploadMessage("");
//       setDownloadFilename(null);
//     }
//   };

//   const handleProcessResume = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!selectedUser || !resumeFile) {
//       setUploadMessage("Please select a user and a file.");
//       return;
//     }

//     setIsProcessing(true);
//     setUploadMessage("Processing resume...");

//     const formData = new FormData();
//     formData.append("resume", resumeFile);

//     try {
//       const response = await axios.post(
//         `http://localhost:5000/api/resumes/process/${selectedUser.id}`,
//         formData,
//         { headers: { "Content-Type": "multipart/form-data" } }
//       );
//       const data = response.data;
//       setUploadMessage("Resume processed successfully!");
//       const employeeSkillsRes = await axios.get(`http://localhost:5000/api/resumes/employees/${selectedUser.id}/skills`);
//       setEmployeeSkills(employeeSkillsRes.data.employeeSkills || []);
      
//       setDownloadFilename(data.downloadFilename || null);
//     } catch (error: any) {
//       setUploadMessage(`Error: ${error.response?.data?.error || error.message}`);
//     } finally {
//       setIsProcessing(false);
//     }
//   };
  
//   // --- NEW: Handler for manually adding a skill ---
//   const handleAddSkill = async () => {
//     if (!selectedUser || !newSkillName.trim()) {
//       alert("Please select a user and enter a skill name.");
//       return;
//     }
    
//     setAddSkillLoading(true);
//     try {
//       await axios.post(`http://localhost:5000/api/resumes/employees/${selectedUser.id}/add-skill`, { skillName: newSkillName.trim() });
//       alert("Skill added successfully!");
      
//       const employeeSkillsRes = await axios.get(`http://localhost:5000/api/resumes/employees/${selectedUser.id}/skills`);
//       setEmployeeSkills(employeeSkillsRes.data.employeeSkills || []);
      
//       setNewSkillName(''); // Clear the input field
//     } catch (err: any) {
//       console.error("Failed to add skill:", err);
//       alert(`Error: ${err.response?.data?.error || err.message}`);
//     } finally {
//       setAddSkillLoading(false);
//     }
//   };
//   // --- END NEW ---

//   const filteredUsers = users.filter((u) =>
//     u.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );
//   const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);
//   const currentUsers = filteredUsers.slice(
//     (currentPage - 1) * USERS_PER_PAGE,
//     currentPage * USERS_PER_PAGE
//   );
  
//   const skillsToAdd = allSkills.filter(skill => !employeeSkills.some(es => es.id === skill.id));

//   if (loading)
//     return (
//       <Box p={4} textAlign="center">
//         <CircularProgress />
//         <Typography mt={2}>Loading users...</Typography>
//       </Box>
//     );

//   if (error)
//     return (
//       <Box p={4} textAlign="center" color="red">
//         <Typography>Error: {error}</Typography>
//       </Box>
//     );

//   return (
//     <Box display="flex" height="100vh" sx={{ bgcolor: "background.paper" }}>
//       {/* Left Panel: User List */}
//       <Box
//         flex={1}
//         width={900}
//         p={3}
//         borderRight="1px solid #e0e0e0"
//         display="flex"
//         flexDirection="column"
//         sx={{
//           bgcolor: 'white',
//           borderRadius: '8px',
//           boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
//           mx: 2,
//           my: 3,
//         }}
//       >
//         <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold", color: 'primary.main' }}>
//           Employees
//         </Typography>
//         <TextField
//           label="Search by name"
//           variant="outlined"
//           fullWidth
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           sx={{ mb: 2 }}
//         />
//         <Box
//           flex={1}
//           overflow="auto"
//           display="flex"
//           flexDirection="column"
//           gap={2}
//         >
//           {currentUsers.length > 0 ? (
//             currentUsers.map((u) => (
//               <StyledUserCard
//                 key={u.id}
//                 onClick={() => setSelectedUser(u)}
//                 sx={{
//                   border:
//                     selectedUser?.id === u.id
//                       ? "2px solid #1976d2"
//                       : "1px solid #e0e0e0",
//                 }}
//               >
//                 <CardContent>
//                   <Typography variant="subtitle1" fontWeight="bold">
//                     {u.name}
//                   </Typography>
//                   <Typography variant="body2" color="textSecondary">
//                     {u.email}
//                   </Typography>
//                 </CardContent>
//               </StyledUserCard>
//             ))
//           ) : (
//             <Typography variant="body2" color="text.secondary">
//               No users found.
//             </Typography>
//           )}
//         </Box>
//         <Box mt={2} display="flex" justifyContent="center">
//           <Pagination
//             count={totalPages}
//             page={currentPage}
//             onChange={(_, value) => setCurrentPage(value)}
//             color="primary"
//           />
//         </Box>
//       </Box>

//       {/* Right Panel: User Details & Resume Upload */}
//       <Box flex={2} p={3} overflow="auto" width={"100%"}>
//         <Paper elevation={3} sx={{ height: "100%", p: 3, borderRadius: 2 }}>
//           <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold", color: 'primary.dark' }}>
//             Employee Details
//           </Typography>
//           {selectedUser ? (
//             <>
//               <Typography>
//                 <strong>Name:</strong> {selectedUser.name}
//               </Typography>
//               <Typography>
//                 <strong>Email:</strong> {selectedUser.email}
//               </Typography>
//               {hoursLoading ? (
//                 <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
//                   <CircularProgress size={16} sx={{ mr: 1 }} />
//                   <Typography>Loading hours...</Typography>
//                 </Box>
//               ) : (
//                 userLoggedHours !== null && (
//                   <Typography>
//                     <strong>Logged Hours:</strong> {userLoggedHours} hrs
//                   </Typography>
//                 )
//               )}

//               {lastProjectLoading ? (
//                 <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
//                   <CircularProgress size={16} sx={{ mr: 1 }} />
//                   <Typography>Loading last project...</Typography>
//                 </Box>
//               ) : (
//                 lastProject && (
//                   <Typography>
//                     <strong>Last Project:</strong> {lastProject.name}
//                   </Typography>
//                 )
//               )}
              
//               <Divider sx={{ my: 3 }} />

//               <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: "bold", color: 'secondary.dark' }}>
//                 Upload and Process Resume
//               </Typography>
//               <form onSubmit={handleProcessResume}>
//                 <input
//                   type="file"
//                   accept=".pdf,.doc,.docx"
//                   onChange={handleFileChange}
//                   disabled={isProcessing}
//                 />
//                 <br />
//                 <Button
//                   type="submit"
//                   variant="contained"
//                   sx={{ mt: 2, bgcolor: 'primary.main', '&:hover': { bgcolor: 'primary.dark' } }}
//                   disabled={isProcessing || !resumeFile}
//                 >
//                   {isProcessing ? "Processing..." : "Upload & Process"}
//                 </Button>
//               </form>

//               {downloadFilename && (
//                 <Box mt={3}>
//                   <Typography fontWeight="bold">
//                     Download Formatted Resume
//                   </Typography>
//                   <Button
//                     href={`http://localhost:5000/api/resumes/download/${downloadFilename}`}
//                     target="_blank"
//                     variant="outlined"
//                     sx={{ mt: 1 }}
//                   >
//                     Download PDF
//                   </Button>
//                 </Box>
//               )}

//               <Divider sx={{ my: 3 }} />

//               <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: "bold", color: 'secondary.dark' }}>
//                 Employee Skills
//               </Typography>
//               <Box mb={2}>
//                 {skillsLoading ? (
//                   <CircularProgress size={20} />
//                 ) : (
//                   employeeSkills.length > 0 ? (
//                     <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
//                       {employeeSkills.map((skill) => (
//                         <Chip key={skill.id} label={skill.name} color="primary" />
//                       ))}
//                     </Box>
//                   ) : (
//                     <Typography variant="body2" color="text.secondary">No skills added yet.</Typography>
//                   )
//                 )}
//               </Box>

//               <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
//                 <TextField
//                   fullWidth
//                   size="small"
//                   label="Add a Skill"
//                   variant="outlined"
//                   value={newSkillName}
//                   onChange={(e) => setNewSkillName(e.target.value)}
//                   disabled={addSkillLoading}
//                 />
//                 <Button 
//                   variant="contained" 
//                   onClick={handleAddSkill} 
//                   disabled={!newSkillName.trim() || addSkillLoading}
//                 >
//                   {addSkillLoading ? <CircularProgress size={24} color="inherit" /> : 'Add'}
//                 </Button>
//               </Box>
              
//             </>
//           ) : (
//             <Typography variant="body1" color="text.secondary">
//               Select a user to view details and upload resume.
//             </Typography>
//           )}
//         </Paper>
//       </Box>
//     </Box>
//   );
// };

// export default UsersList;



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
  Paper,
  Snackbar,
  Alert as MuiAlert,
  
  
} from "@mui/material";
import { styled } from "@mui/system";
import axios from "axios";

// Styled component for the user cards in the list
const StyledUserCard = styled(Card)(({ theme }) => ({
  cursor: "pointer",
  transition: "all 0.2s ease-in-out",
  "&:hover": {
    boxShadow: '0px 6px 12px rgba(0,0,0,0.1)',
    transform: "translateY(-2px)",
  },
}));

interface User {
  id: number;
  name: string;
  email: string;
}

interface ProjectInfo {
  id: number;
  name: string;
}

// Interface for a skill, with name and id
interface Skill {
  id: number;
  name: string;
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
  
  // States for other data
  const [userLoggedHours, setUserLoggedHours] = useState<number | null>(null);
  const [hoursLoading, setHoursLoading] = useState(false);
  const [lastProject, setLastProject] = useState<ProjectInfo | null>(null);
  const [lastProjectLoading, setLastProjectLoading] = useState(false);
  
  // --- NEW STATES FOR MANUAL SKILL ADDITION ---
  const [allSkills, setAllSkills] = useState<Skill[]>([]);
  const [employeeSkills, setEmployeeSkills] = useState<Skill[]>([]);
  const [newSkillName, setNewSkillName] = useState('');
  const [addSkillLoading, setAddSkillLoading] = useState(false);
  const [skillsLoading, setSkillsLoading] = useState(false);
  // --- END NEW STATES ---

  // --- NEW STATES FOR TOASTER MESSAGES ---
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  // --- END NEW STATES ---

  const USERS_PER_PAGE = 7;

  // --- NEW: A single effect that handles fetching users and checking the URL for a selected user ID ---
  useEffect(() => {
    const fetchUsersAndSelect = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/users");
        const usersData = response.data;
        setUsers(usersData);

        const params = new URLSearchParams(window.location.search);
        const userIdFromUrl = params.get('userId');
        
        if (userIdFromUrl) {
          const foundUser = usersData.find((u: User) => u.id === parseInt(userIdFromUrl, 10));
          if (foundUser) {
            setSelectedUser(foundUser);
          }
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUsersAndSelect();
  }, []);
  // --- END NEW ---

  useEffect(() => {
    if (!selectedUser) return;
    // --- NEW: Update the URL when a user is selected ---
    const params = new URLSearchParams(window.location.search);
    params.set('userId', selectedUser.id.toString());
    window.history.pushState(null, '', `?${params.toString()}`);

    setIsProcessing(false);
    setUploadMessage("");
    setResumeFile(null);
    setDownloadFilename(null);
    
    // Consolidated to use axios for consistency
    axios
      .get(`http://localhost:5000/api/resumes/employee/${selectedUser.id}`)
      .then((res) => {
        const data = res.data;
        if (data.resume) {
          if (data.resume.formatted) setDownloadFilename(data.resume.formatted);
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
    // Consolidated to use axios for consistency
    axios
      .get(`http://localhost:5000/api/users/${selectedUser.id}/logged-hours`)
      .then((res) => {
        setUserLoggedHours(res.data.loggedHours);
      })
      .catch((err) => {
        console.error("Failed to fetch logged hours:", err);
        setUserLoggedHours(null);
      })
      .finally(() => {
        setHoursLoading(false);
      });
  }, [selectedUser]);

  useEffect(() => {
    if (!selectedUser) {
      setLastProject(null);
      return;
    }

    setLastProjectLoading(true);
    axios
      .get(`http://localhost:5000/api/users/${selectedUser.id}/memberships`)
      .then((res) => {
        const memberships = res.data?.user?.memberships;
        if (memberships && memberships.length > 0) {
          const latestMembership = memberships[memberships.length - 1];
          setLastProject(latestMembership.project);
        } else {
          setLastProject(null);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch memberships:", err);
        setLastProject(null);
      })
      .finally(() => {
        setLastProjectLoading(false);
      });
  }, [selectedUser]);
  
  // --- NEW: Fetch all skills and employee's existing skills ---
  useEffect(() => {
    const fetchSkills = async () => {
      setSkillsLoading(true);
      if (!selectedUser) {
        setAllSkills([]);
        setEmployeeSkills([]);
        setSkillsLoading(false);
        return;
      }
      try {
        const [allSkillsRes, employeeSkillsRes] = await Promise.all([
          axios.get('http://localhost:5000/api/resumes/skills'),
          axios.get(`http://localhost:5000/api/resumes/employees/${selectedUser.id}/skills`),
        ]);
        setAllSkills(allSkillsRes.data.skills || []);
        const uniqueSkills = [...new Set(employeeSkillsRes.data.employeeSkills.map((s: Skill) => s.name))]
            .map(name => ({ id: allSkillsRes.data.skills.find((s: Skill) => s.name === name)?.id, name }));
        
        setEmployeeSkills(uniqueSkills);
      } catch (err) {
        console.error("Failed to fetch skills:", err);
      } finally {
        setSkillsLoading(false);
      }
    };
    fetchSkills();
  }, [selectedUser]);
  // --- END NEW ---

  // --- NEW: Handler for Snackbar notifications ---
  const handleShowSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };
  // --- END NEW ---

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
      handleShowSnackbar("Please select a user and a file.", 'error');
      return;
    }

    setIsProcessing(true);
    setUploadMessage("Processing resume...");

    const formData = new FormData();
    formData.append("resume", resumeFile);

    try {
      const response = await axios.post(
        `http://localhost:5000/api/resumes/process/${selectedUser.id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      const data = response.data;
      setUploadMessage("Resume processed successfully!");
      const employeeSkillsRes = await axios.get(`http://localhost:5000/api/resumes/employees/${selectedUser.id}/skills`);
      setEmployeeSkills(employeeSkillsRes.data.employeeSkills || []);
      
      setDownloadFilename(data.downloadFilename || null);
    } catch (error: any) {
      setUploadMessage(`Error: ${error.response?.data?.error || error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };
  
  // --- NEW: Handler for manually adding a skill ---
  const handleAddSkill = async () => {
    if (!selectedUser || !newSkillName.trim()) {
      handleShowSnackbar("Please select a user and enter a skill name.", 'error');
      return;
    }
    
    setAddSkillLoading(true);
    try {
      await axios.post(`http://localhost:5000/api/resumes/employees/${selectedUser.id}/add-skill`, { skillName: newSkillName.trim() });
      handleShowSnackbar("Skill added successfully!", 'success');
      
      const employeeSkillsRes = await axios.get(`http://localhost:5000/api/resumes/employees/${selectedUser.id}/skills`);
      setEmployeeSkills(employeeSkillsRes.data.employeeSkills || []);
      
      setNewSkillName(''); // Clear the input field
    } catch (err: any) {
      console.error("Failed to add skill:", err);
      handleShowSnackbar(`Error: ${err.response?.data?.error || err.message}`, 'error');
    } finally {
      setAddSkillLoading(false);
    }
  };
  // --- END NEW ---

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);
  const currentUsers = filteredUsers.slice(
    (currentPage - 1) * USERS_PER_PAGE,
    currentPage * USERS_PER_PAGE
  );

  const skillExists = employeeSkills.some(skill => skill.name.toLowerCase() === newSkillName.trim().toLowerCase());
  const isAddButtonDisabled = !newSkillName.trim() || addSkillLoading || skillExists;
  
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
    <>
      <Box display="flex"  sx={{ bgcolor: "background.paper" }}>
        {/* Left Panel: User List */}
        <Box
          flex={1}
          width={900}
          p={3}
          borderRight="1px solid #e0e0e0"
          display="flex"
          flexDirection="column"
          sx={{
            bgcolor: 'white',
            borderRadius: '8px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            mx: 2,
            my: 3,
          }}
        >
          <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold", color: 'primary.main' }}>
            Employees
          </Typography>
          <TextField
            label="Search by name"
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Box
            flex={1}
            display="flex"
            flexDirection="column"
            gap={2}
          >
            {currentUsers.length > 0 ? (
              currentUsers.map((u) => (
                <StyledUserCard
                  key={u.id}
                  onClick={() => setSelectedUser(u)}
                  sx={{
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
                </StyledUserCard>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                No users found.
              </Typography>
            )}
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
        <Box flex={2} p={3}  width={"100%"}>
          <Paper elevation={3} sx={{ height: "800px", p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold", color: 'primary.dark' }}>
              Employee Details
            </Typography>
            {selectedUser ? (
              <>
                <Typography >
                  <strong>Name:</strong> {selectedUser.name}
                </Typography>
                <Typography>
                  <strong>Email:</strong> {selectedUser.email}
                </Typography>
                {hoursLoading ? (
                  <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
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

                {lastProjectLoading ? (
                  <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                    <CircularProgress size={16} sx={{ mr: 1 }} />
                    <Typography>Loading last project...</Typography>
                  </Box>
                ) : (
                  lastProject && (
                    <Typography>
                      <strong>Last Project:</strong> {lastProject.name}
                    </Typography>
                  )
                )}
                
                <Divider sx={{ my: 3 }} />

                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: "bold", color: 'secondary.dark' }}>
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
                    sx={{ mt: 2, bgcolor: 'primary.main', '&:hover': { bgcolor: 'primary.dark' } }}
                    disabled={isProcessing || !resumeFile}
                  >
                    {isProcessing ? "Processing..." : "Upload & Process"}
                  </Button>
                </form>

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

                <Divider sx={{ my: 3 }} />

                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: "bold", color: 'secondary.dark' }}>
                  Employee Skills
                </Typography>
                <Box mb={2}>
                  {skillsLoading ? (
                    <CircularProgress size={20} />
                  ) : (
                    employeeSkills.length > 0 ? (
                      <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
                        {[...new Set(employeeSkills.map(s => s.name))].map((skillName, index) => (
                          <Chip key={index} label={skillName} color="primary" />
                        ))}
                      </Box>
                    ) : (
                      <Typography variant="body2" color="text.secondary">No skills added yet.</Typography>
                    )
                  )}
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Add a Skill"
                    variant="outlined"
                    value={newSkillName}
                    onChange={(e) => setNewSkillName(e.target.value)}
                    disabled={addSkillLoading || (employeeSkills.some(skill => skill.name.toLowerCase() === newSkillName.toLowerCase()))}
                    helperText={employeeSkills.some(skill => skill.name.toLowerCase() === newSkillName.toLowerCase()) && "Skill already exists."}
                  />
                  <Button 
                    variant="contained" 
                    onClick={handleAddSkill} 
                    disabled={!newSkillName.trim() || addSkillLoading || (employeeSkills.some(skill => skill.name.toLowerCase() === newSkillName.toLowerCase()))}
                  >
                    {addSkillLoading ? <CircularProgress size={24} color="inherit" /> : 'Add'}
                  </Button>
                </Box>
                
                </>
            ) : (
              <Typography variant="body1" color="text.secondary">
                Select a user to view details and upload resume.
              </Typography>
            )}
          </Paper>
        </Box>
      </Box>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <MuiAlert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </>
  );
};

export default UsersList;
  