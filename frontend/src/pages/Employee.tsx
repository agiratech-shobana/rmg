



import React, { useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
  Typography,
  Snackbar,
  Alert as MuiAlert,
} from "@mui/material";
import axios from "axios";

// Import the new components
import UserListComponent from "../components/UserListComponent";
import UserDetailsPanel from "../components/UserDetailsPanel";

// Keep interfaces that are used across components here in the parent
interface User {
  id: number;
  name: string;
  email: string;
}

interface ProjectInfo {
  id: number;
  name: string;
}

interface Skill {
  id: number;
  name: string;
}

const UsersPage: React.FC = () => {
  // All state and logic remains in the parent component
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
  
  const [userLoggedHours, setUserLoggedHours] = useState<number | null>(null);
  const [hoursLoading, setHoursLoading] = useState(false);
  const [lastProject, setLastProject] = useState<ProjectInfo | null>(null);
  const [lastProjectLoading, setLastProjectLoading] = useState(false);
  
  const [employeeSkills, setEmployeeSkills] = useState<Skill[]>([]);
  const [newSkillName, setNewSkillName] = useState('');
  const [addSkillLoading, setAddSkillLoading] = useState(false);
  const [skillsLoading, setSkillsLoading] = useState(false);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  const USERS_PER_PAGE = 7;

  // --- All useEffect hooks also remain in the parent ---
  useEffect(() => {
    const fetchUsersAndSelect = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/users`);
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
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    fetchUsersAndSelect();
  }, []);

  useEffect(() => {
    if (!selectedUser) return;
    
    const params = new URLSearchParams(window.location.search);
    params.set('userId', selectedUser.id.toString());
    window.history.pushState(null, '', `?${params.toString()}`);

    setIsProcessing(false);
    setUploadMessage("");
    setResumeFile(null);
    setDownloadFilename(null);
    
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/resumes/employee/${selectedUser.id}`)
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
      setLastProject(null);
      setEmployeeSkills([]);
      return;
    }

    const fetchUserDetails = async () => {
      // Fetch Logged Hours
      setHoursLoading(true);
      axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/users/${selectedUser.id}/logged-hours`)
        .then(res => setUserLoggedHours(res.data.loggedHours))
        .catch(err => { console.error("Failed to fetch logged hours:", err); setUserLoggedHours(null); })
        .finally(() => setHoursLoading(false));

      // Fetch Last Project
      setLastProjectLoading(true);
      axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/users/${selectedUser.id}/memberships`)
        .then(res => {
          const memberships = res.data?.user?.memberships;
          setLastProject(memberships?.length > 0 ? memberships[memberships.length - 1].project : null);
        })
        .catch(err => { console.error("Failed to fetch memberships:", err); setLastProject(null); })
        .finally(() => setLastProjectLoading(false));
        
      // Fetch Skills
      setSkillsLoading(true);
      axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/resumes/employees/${selectedUser.id}/skills`)
        .then(res => setEmployeeSkills(res.data.employeeSkills || []))
        .catch(err => console.error("Failed to fetch skills:", err))
        .finally(() => setSkillsLoading(false));
    };

    fetchUserDetails();
  }, [selectedUser]);


  function getErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    return err.response?.data?.error || err.message;
  }
  if (err instanceof Error) {
    return err.message;
  }
  return String(err);
}


  // --- All handler functions remain in the parent ---
  const handleShowSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = (_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;
    setOpenSnackbar(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setResumeFile(e.target.files[0]);
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
    const formData = new FormData();
    formData.append("resume", resumeFile);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/resumes/process/${selectedUser.id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      handleShowSnackbar("Resume processed successfully!", 'success');
      const employeeSkillsRes = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/resumes/employees/${selectedUser.id}/skills`);
      setEmployeeSkills(employeeSkillsRes.data.employeeSkills || []);
      setDownloadFilename(response.data.downloadFilename || null);
    }
    //  catch (error: any) {
    //   handleShowSnackbar(`Error: ${error.response?.data?.error || error.message}`, 'error');
    // } 
     catch (err) {
  handleShowSnackbar(`Error: ${getErrorMessage(err)}`, 'error');
}

    finally {
      setIsProcessing(false);
    }
  };
  
  const handleAddSkill = async () => {
    if (!selectedUser || !newSkillName.trim()) {
      handleShowSnackbar("Please select a user and enter a skill name.", 'error');
      return;
    }
    
    setAddSkillLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/resumes/employees/${selectedUser.id}/add-skill`, { skillName: newSkillName.trim() });
      handleShowSnackbar("Skill added successfully!", 'success');
      
      const employeeSkillsRes = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/resumes/employees/${selectedUser.id}/skills`);
      setEmployeeSkills(employeeSkillsRes.data.employeeSkills || []);
      
      setNewSkillName('');
    } 
    // catch (err: any) {
    //   handleShowSnackbar(`Error: ${err.response?.data?.error || err.message}`, 'error');
    // } 
    catch (error) {
  handleShowSnackbar(`Error: ${getErrorMessage(error)}`, 'error');
    }

    finally {
      setAddSkillLoading(false);
    }
  };

  // Logic for filtering and pagination remains in the parent
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

  // The main render method is now much cleaner
  return (
    <>
      <Box display="flex" sx={{ bgcolor: "background.paper",height: 'calc(100vh - 64px)' }}>
        <UserListComponent
          usersToDisplay={currentUsers}
          selectedUser={selectedUser}
          searchTerm={searchTerm}
          totalPages={totalPages}
          currentPage={currentPage}
          onSearchChange={setSearchTerm}
          onSelectUser={setSelectedUser}
          onPageChange={setCurrentPage}
        />
        <UserDetailsPanel
         key={selectedUser ? selectedUser.id : 'no-user-selected'}
          selectedUser={selectedUser}
           uploadMessage={uploadMessage} 
          isProcessing={isProcessing}
          downloadFilename={downloadFilename}
          userLoggedHours={userLoggedHours}
          hoursLoading={hoursLoading}
          lastProject={lastProject}
          lastProjectLoading={lastProjectLoading}
          employeeSkills={employeeSkills}
          skillsLoading={skillsLoading}
          newSkillName={newSkillName}
          addSkillLoading={addSkillLoading}
          onFileChange={handleFileChange}
          onProcessResume={handleProcessResume}
          onNewSkillNameChange={setNewSkillName}
          onAddSkill={handleAddSkill}
        />
         {/* {uploadMessage && (
      <Box mt={1}>
        <Typography variant="body2" color="text.secondary">
          {uploadMessage}
        </Typography>
      </Box>
    )} */}
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

export default UsersPage;