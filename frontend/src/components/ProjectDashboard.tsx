



// frontend/src/components/ProjectDashboard.tsx
import React, { useEffect, useState } from 'react';
import { 
  Container, Grid, Typography, Box, Tabs, Tab, CircularProgress, Alert,Button,TextField,Snackbar
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import ProjectCard from './ProjectCard';
import AddProjectModal from './AppProjectModal'; // Now handles both Add and Edit
import AddMembersModal from './AddMembersModal';
import DeleteProjectModal from './DeleteProjectModal';
import type { ProjectSummary ,ProjectFormData} from '../types/project';

const ProjectDashboard: React.FC = () => {
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);

  // Modal states for the two-step "Add" flow
  const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false);
  const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);
  // const [projectDataForMembers, setProjectDataForMembers] = useState<any>(null);
  const [projectDataForMembers, setProjectDataForMembers] = useState<ProjectFormData | null>(null);

    // const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);


  // States for other modals remain the same
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<ProjectSummary | null>(null);
  // const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState<ProjectSummary | null>(null);

   const [searchQuery, setSearchQuery] = useState('');

     const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info' | 'warning',
  }); 

  // --- END OF CORRECTED CODE ---

  // State for the one-step "Edit" flow


  const fetchProjects = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/projects', { withCredentials: true });
      setProjects(response.data);
    } catch (err) {
      setError('Failed to fetch projects. Please check the backend.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchProjects();
  }, []);

  // Handler for the first modal's 'Next' button (Add flow)
  const handleNextInProjectModal = (projectData: ProjectFormData) => {
    setIsAddProjectModalOpen(false); // Close the first modal
    setProjectDataForMembers(projectData); // Store the project data
    setIsMembersModalOpen(true); // Open the second modal
  };

  // Handler for a successful save from the edit modal
  const handleProjectSaved = () => {
      setIsAddProjectModalOpen(false); // Close the modal
      setProjectToEdit(null); // Clear the project to edit
      fetchProjects(); // Re-fetch to see the updated project
      setSnackbar({ 
    open: true, 
    message: 'Changes updated successfully!', 
    severity: 'success' 
  });
  };


  // Handler for opening the 'Add' modal
  const handleAddProjectClick = () => {
    setProjectToEdit(null); // Ensure no project data is passed (so it's 'add' mode)
    setIsAddProjectModalOpen(true);
  };
 
  // Handler for closing the main modal
  const handleCloseProjectModal = () => {
    setIsAddProjectModalOpen(false);
    setProjectToEdit(null); // Clear the project to edit
  };

  // Handler for closing the members modal
  const handleCloseMembersModal = () => {
    setIsMembersModalOpen(false);
    setProjectDataForMembers(null); // Clear the temporary data
    fetchProjects(); // Re-fetch projects to update dashboard
  };
  
  // Handler for the edit button
  const handleEditClick = (project: ProjectSummary) => {
    setProjectToEdit(project); // Set the project to edit
    setIsAddProjectModalOpen(true); // Open the modal
  };

  const handleDeleteClick = (project: ProjectSummary) => {
    setProjectToDelete(project);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setProjectToDelete(null);
  };

  const handleProjectDeleted = (deletedProjectId: number) => {
    setProjects(prevProjects => prevProjects.filter(p => p.id !== deletedProjectId));
    handleCloseDeleteModal();


      setSnackbar({ 
        open: true, 
        message: 'Project deleted successfully!', 
        severity: 'success' 
    });
  };

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // const filteredProjects = projects.filter(project => {
  //   if (tabValue === 0) return true;
  //   if (tabValue === 1) return project.status.toLowerCase() === 'ongoing';
  //   if (tabValue === 2) return project.status.toLowerCase() === 'finished';
  //   return true;
  // });

 const filteredProjects = projects.filter(project => {
    const statusMatch = (tabValue === 0) || 
                        (tabValue === 1 && project.status.toLowerCase() === 'ongoing') ||
                        (tabValue === 2 && project.status.toLowerCase() === 'finished');
    
    // Add a defensive check for accountName before calling toLowerCase()
    const accountName = project.accountName || ''; // Use an empty string if it's null
    const searchMatch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        accountName.toLowerCase().includes(searchQuery.toLowerCase());

    return statusMatch && searchMatch;
  });
  
  const ongoingCount = projects.filter(p => p.status.toLowerCase() === 'ongoing').length;
  const finishedCount = projects.filter(p => p.status.toLowerCase() === 'finished').length;
  const totalCount = projects.length;

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;



   const handleSnackbarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Project Dashboard
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={handleAddProjectClick}
        >
          Add Project
        </Button>
      </Box>
     

      <Grid container spacing={4} sx={{ mt: 2 }}>
        <Grid size={2}>
          <Box p={2} border={1} borderColor="primary.main" borderRadius={2}>
            <Typography variant="h5">Total Projects</Typography>
            <Typography variant="h3" color="primary">{totalCount}</Typography>
          </Box>
        </Grid>
        <Grid  size={2.3}>
          <Box p={2} border={1} borderColor="warning.main" borderRadius={2}>
            <Typography variant="h5">Ongoing Projects</Typography>
            <Typography variant="h3" color="warning">{ongoingCount}</Typography>
          </Box>
        </Grid>
        <Grid  size={2.3}>
          <Box p={2} border={1} borderColor="success.main" borderRadius={2}>
            <Typography variant="h5">Finished Projects</Typography>
            <Typography variant="h3" color="success">{finishedCount}</Typography>
          </Box>
        </Grid>
        
          <Grid>
             <Box sx={{ mb: 4, mt: 2 }}>
        <TextField
          // fullWidth
          style={{ width: '300px', marginLeft: '300px' ,marginTop:'40px', top: '70px'}}
          label="Search Projects by Name or Account Name"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Box>
          </Grid>
      </Grid>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={tabValue} onChange={handleChange} aria-label="project status tabs">
          <Tab label={`All Projects (${totalCount})`} />
          <Tab label={`Ongoing (${ongoingCount})`} />
          <Tab label={`Finished (${finishedCount})`} />
        </Tabs>
      </Box>

      <Grid container spacing={4} sx={{ mt: 2, justifyContent: 'flex-start' }}>
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project) => (
            <Grid  key={project.id} size={4}>
              <ProjectCard project={project}
               onDeleteClick={handleDeleteClick} 
               onEditClick={handleEditClick} />
            </Grid>
          ))
        ) : (
          <Typography variant="subtitle1" sx={{ ml: 4 }}>No projects to display in this category.</Typography>
        )}
      </Grid>
      
      {/* The single modal handles both add and edit */}
      <AddProjectModal 
        open={isAddProjectModalOpen} 
        onClose={handleCloseProjectModal} 
        onNext={handleNextInProjectModal} // Used for 'Add' flow only
        project={projectToEdit} // Passed for 'Edit' flow
        onProjectSaved={handleProjectSaved} // Used for 'Edit' flow only
      />
      
      <AddMembersModal
        open={isMembersModalOpen}
        onClose={handleCloseMembersModal}
        projectData={projectDataForMembers}
      />

       {projectToDelete && (
          <DeleteProjectModal
              open={isDeleteModalOpen}
              onClose={handleCloseDeleteModal}
              project={projectToDelete}
              onProjectDeleted={handleProjectDeleted}
          />
      )}

      <Snackbar
            open={snackbar.open}
            autoHideDuration={6000} // 6 seconds
            onClose={handleSnackbarClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
            <Alert 
                onClose={handleSnackbarClose} 
                severity={snackbar.severity} 
                   variant="filled" 
                sx={{ width: '100%',minWidth: '350px', boxShadow: 3 }}
            >   
                {snackbar.message}
            </Alert>
        </Snackbar>

    </Container>    
  );
};

export default ProjectDashboard;