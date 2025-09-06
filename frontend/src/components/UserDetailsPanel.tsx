


import React, { useRef, useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Chip,
  TextField,
  Avatar, 
  Grid,
  Card,
  CardContent,
  CardHeader,
} from "@mui/material";

// Import the icons we'll be using
import { MailOutline, AccessTime, WorkOutline, PersonSearch, UploadFile, Psychology } from '@mui/icons-material';

// Interfaces for props
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

interface UserDetailsPanelProps {
  selectedUser: User | null;
  isProcessing: boolean;
  downloadFilename: string | null;
  userLoggedHours: number | null;
  hoursLoading: boolean;
  lastProject: ProjectInfo | null;
  lastProjectLoading: boolean;
  employeeSkills: Skill[];
  skillsLoading: boolean;
  newSkillName: string;
  addSkillLoading: boolean;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onProcessResume: (e: React.FormEvent) => void;
  onNewSkillNameChange: (name: string) => void;
  onAddSkill: () => void;
}

// Helper function to get initials from a name for the Avatar
const getInitials = (name: string = "") => {
  const words = name.split(' ');
  if (words.length > 1) {
    return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

const UserDetailsPanel: React.FC<UserDetailsPanelProps> = ({
  selectedUser,
  isProcessing,
  downloadFilename,
  userLoggedHours,
  hoursLoading,
  lastProject,
  lastProjectLoading,
  employeeSkills,
  skillsLoading,
  newSkillName,
  addSkillLoading,
  onFileChange,
  onProcessResume,
  onNewSkillNameChange,
  onAddSkill,
}) => {
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setSelectedFileName(null);
  }, [selectedUser]);

  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleActualFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFileChange(e);
    setSelectedFileName(e.target.files?.[0]?.name || null);
  };

  const skillExists = employeeSkills.some(skill => skill.name.toLowerCase() === newSkillName.trim().toLowerCase());
  const isAddButtonDisabled = !newSkillName.trim() || addSkillLoading || skillExists;

  if (!selectedUser) {
    return (
      <Box flex={2} p={3} display="flex" flexDirection="column" justifyContent="center" alignItems="center" sx={{ height: 'calc(100vh - 100px)' }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2, textAlign: 'center' }}>
          <PersonSearch color="primary" sx={{ fontSize: 60, mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            Select an Employee
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Details and actions will be shown here.
          </Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Box flex={2} p={3} sx={{ maxHeight: 'calc(100vh - 100px)', overflowY: 'auto' }}>
      {/* Profile Header - No changes here */}
      <Box display="flex" alignItems="center" mb={3}>
        <Avatar sx={{ width: 64, height: 64, bgcolor: 'primary.main', fontSize: '1.75rem' }}>
          {getInitials(selectedUser.name)}
        </Avatar>
        <Box ml={2}>
          <Typography variant="h5" fontWeight="bold">
            {selectedUser.name}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Team Member
          </Typography>
        </Box>
      </Box>

      {/* Grid layout for key information - No changes here */}
      <Grid container spacing={2} mb={3}>
        <Grid size={5}>
            <Paper variant="outlined" sx={{ p: 2, display: 'flex', alignItems: 'center', height: '100%',borderRadius: 4 }}>
                <MailOutline color="action" />
                <Box ml={2}>
                    <Typography variant="body2" color="text.secondary">Email</Typography>
                    <Typography variant="body1" fontWeight={500}>{selectedUser.email}</Typography>
                </Box>
            </Paper>
        </Grid>
        <Grid size={3}>
             <Paper variant="outlined" sx={{ p: 2, display: 'flex', alignItems: 'center', height: '100%' ,borderRadius: 4 }}>
                <AccessTime color="action" />
                <Box ml={2}>
                    <Typography variant="body2" color="text.secondary">Logged Hours</Typography>
                    {hoursLoading ? <CircularProgress size={20} /> : <Typography variant="body1" fontWeight={500}>{userLoggedHours ?? 'N/A'} hrs</Typography>}
                </Box>
            </Paper>
        </Grid>
        <Grid size={3}>
             <Paper variant="outlined" sx={{ p: 2, display: 'flex', alignItems: 'center', height: '100%',borderRadius: 4  }}>
                <WorkOutline color="action" />
                <Box ml={2}>
                    <Typography variant="body2" color="text.secondary">Last Project</Typography>
                    {lastProjectLoading ? <CircularProgress size={20} /> : <Typography variant="body1" fontWeight={500}>{lastProject?.name ?? 'No projects found'}</Typography>}
                </Box>
            </Paper>
        </Grid>
      </Grid>
      
      {/* --- THIS IS THE CORRECTED SECTION --- */}
      {/* We remove the Grid container and just use Box components to ensure vertical stacking */}
      
      <Box mb={3} marginTop="50px"> {/* Add margin bottom to create space between cards */}
        <Card elevation={2}>
          <CardHeader title="Resume Management" avatar={<UploadFile />} />
          <CardContent component="form" onSubmit={onProcessResume}>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleActualFileChange}
              style={{ display: 'none' }}
              ref={fileInputRef}
              disabled={isProcessing}
            />
            <Box display="flex" alignItems="center" gap={2}>
              <Button variant="outlined" onClick={handleFileButtonClick} disabled={isProcessing}>
                  Choose File
              </Button>
              <Typography variant="body2" color="text.secondary" noWrap>
                {selectedFileName || "No file chosen"}
              </Typography>
            </Box>
            <Button
                type="submit"
                variant="contained"
                sx={{ mt: 2 }}
                disabled={isProcessing || !selectedFileName}
            >
                {isProcessing ? <CircularProgress size={24} color="inherit" /> : "Upload & Process"}
            </Button>
            {downloadFilename && (
              <Box mt={3}>
                <Typography fontWeight="bold" variant="subtitle2">Formatted Resume Ready:</Typography>
                <Button
                  href={`http://localhost:5000/api/resumes/download/${downloadFilename}`}
                  target="_blank"
                  variant="outlined"
                  color="secondary"
                  sx={{ mt: 1 }}
                >
                  Download PDF
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>
      
      <Box>
         <Card elevation={2}>
          <CardHeader title="Skills Management" avatar={<Psychology />} />
          <CardContent>
             {skillsLoading ? (
                  <CircularProgress size={20} />
                ) : employeeSkills.length > 0 ? (
                    <Box display="flex" flexWrap="wrap" gap={1} mb={3}>
                      {employeeSkills.map((skill, index) => (
                        <Chip key={index} label={skill.name} color="primary" variant="outlined" />
                      ))}
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>No skills have been added yet.</Typography>
                  )
                }
             <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Add a New Skill"
                  variant="outlined"
                  value={newSkillName}
                  onChange={(e) => onNewSkillNameChange(e.target.value)}
                  disabled={addSkillLoading || skillExists}
                  helperText={skillExists ? "This skill already exists." : " "}
                />
                <Button
                  variant="contained"
                  onClick={onAddSkill}
                  disabled={isAddButtonDisabled}
                >
                  {addSkillLoading ? <CircularProgress size={24} color="inherit" /> : 'Add'}
                </Button>
              </Box>
          </CardContent>
        </Card>
      </Box>

    </Box>
  );
};

export default UserDetailsPanel;