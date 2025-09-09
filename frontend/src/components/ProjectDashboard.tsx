


// import React, { useEffect, useState } from 'react';
// import { 
//   Container, Grid, Typography, Box, Tabs, Tab, CircularProgress, Alert,Button,TextField,Snackbar, Card, CardContent, CardActions, LinearProgress, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions
// } from '@mui/material';
// import AddIcon from '@mui/icons-material/Add';
// import EditIcon from '@mui/icons-material/Edit';
// import DeleteIcon from '@mui/icons-material/Delete';
// import axios from 'axios';

// import type { ProjectSummary ,ProjectFormData} from '../types/project';

// // --- MOCK/PLACEHOLDER COMPONENTS to resolve import errors ---

// // Placeholder for ProjectCard component
// const ProjectCard: React.FC<{ project: ProjectSummary; onDeleteClick: (p: ProjectSummary) => void; onEditClick: (p: ProjectSummary) => void; }> = ({ project, onDeleteClick, onEditClick }) => {
//   return (
//     <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
//       <CardContent sx={{ flexGrow: 1 }}>
//         <Typography gutterBottom variant="h5" component="h2">{project.name}</Typography>
//         <Typography variant="body2" color="text.secondary">{project.accountName}</Typography>
//         <Box sx={{ display: 'flex', alignItems: 'center', my: 2 }}>
//           <Box sx={{ width: '100%', mr: 1 }}>
//             <LinearProgress variant="determinate" value={project.progress} />
//           </Box>
//           <Box sx={{ minWidth: 35 }}>
//             <Typography variant="body2" color="text.secondary">{`${Math.round(project.progress)}%`}</Typography>
//           </Box>
//         </Box>
//         <Typography variant="caption" display="block">Status: {project.status}</Typography>
//         <Typography variant="caption" display="block">End Date: {project.endDate}</Typography>
//       </CardContent>
//       <CardActions>
//         <Button size="small" startIcon={<EditIcon />} onClick={() => onEditClick(project)}>Edit</Button>
//         <Button size="small" startIcon={<DeleteIcon />} color="error" onClick={() => onDeleteClick(project)}>Delete</Button>
//       </CardActions>
//     </Card>
//   );
// };

// // Placeholder for AddProjectModal component
// const AddProjectModal: React.FC<{ open: boolean; onClose: () => void; onNext: (data: any) => void; project: ProjectSummary | null; onProjectSaved: () => void; }> = ({ open, onClose, onNext, project, onProjectSaved }) => {
//   const isEditMode = !!project;
//   return (
//     <Dialog open={open} onClose={onClose}>
//       <DialogTitle>{isEditMode ? 'Edit Project' : 'Add New Project'}</DialogTitle>
//       <DialogContent>
//         <DialogContentText>
//           {isEditMode ? `You are editing "${project?.name}". Make your changes here.` : 'Please fill in the project details below.'}
//         </DialogContentText>
//         {/* In a real app, this would be a form */}
//         <TextField autoFocus margin="dense" label="Project Name" type="text" fullWidth variant="standard" defaultValue={project?.name || ''} />
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={onClose}>Cancel</Button>
//         {isEditMode ? (
//           <Button onClick={onProjectSaved}>Save</Button>
//         ) : (
//           <Button onClick={() => onNext({ project: { name: 'New Project' } })}>Next</Button>
//         )}
//       </DialogActions>
//     </Dialog>
//   );
// };

// // Placeholder for AddMembersModal component
// const AddMembersModal: React.FC<{ open: boolean; onClose: () => void; projectData: any | null; }> = ({ open, onClose, projectData }) => {
//   return (
//     <Dialog open={open} onClose={onClose}>
//       <DialogTitle>Add Members to Project</DialogTitle>
//       <DialogContent>
//         <DialogContentText>
//           Add members to the project "{projectData?.project?.name}". In a real application, you would see a list of users to select from.
//         </DialogContentText>
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={onClose}>Done</Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// // Placeholder for DeleteProjectModal component
// const DeleteProjectModal: React.FC<{ open: boolean; onClose: () => void; project: ProjectSummary; onProjectDeleted: (id: number) => void; }> = ({ open, onClose, project, onProjectDeleted }) => {
//   return (
//     <Dialog open={open} onClose={onClose}>
//       <DialogTitle>Delete Project?</DialogTitle>
//       <DialogContent>
//         <DialogContentText>
//           Are you sure you want to delete the project "{project.name}"? This action cannot be undone.
//         </DialogContentText>
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={onClose}>Cancel</Button>
//         <Button onClick={() => onProjectDeleted(project.id)} color="error">Delete</Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// // --- END OF MOCK/PLACEHOLDER COMPONENTS ---


// const ProjectDashboard: React.FC = () => {
//   const [projects, setProjects] = useState<ProjectSummary[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [tabValue, setTabValue] = useState(0);

//   // Modal states for the two-step "Add" flow
//   const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false);
//   const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);
//   const [projectDataForMembers, setProjectDataForMembers] = useState<ProjectFormData | null>(null);

//   // States for other modals remain the same
//   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
//   const [projectToDelete, setProjectToDelete] = useState<ProjectSummary | null>(null);
//   const [projectToEdit, setProjectToEdit] = useState<ProjectSummary | null>(null);

//   const [searchQuery, setSearchQuery] = useState('');

//   const [snackbar, setSnackbar] = useState({
//     open: false,
//     message: '',
//     severity: 'success' as 'success' | 'error' | 'info' | 'warning',
//   }); 

//   const fetchProjects = async () => {
//     try {
//       const response = await axios.get('http://localhost:5000/api/projects', { withCredentials: true });
//     //    const response = await axios.get(
//     //   `${import.meta.env.VITE_API_URL}/projects`,   
//     //   { withCredentials: true }
//     // );
//       setProjects(response.data);
//     } catch (err) {
//       setError('Failed to fetch projects. Please check the backend.');
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };
  
//   useEffect(() => {
//     fetchProjects();
//   }, []);

//   // Handler for the first modal's 'Next' button (Add flow)
//   const handleNextInProjectModal = (projectData: ProjectFormData) => {
//     setIsAddProjectModalOpen(false); // Close the first modal
//     setProjectDataForMembers(projectData); // Store the project data
//     setIsMembersModalOpen(true); // Open the second modal
//   };

//   // Handler for a successful save from the edit modal
//   const handleProjectSaved = () => {
//       setIsAddProjectModalOpen(false); // Close the modal
//       setProjectToEdit(null); // Clear the project to edit
//       fetchProjects(); // Re-fetch to see the updated project
//       setSnackbar({ 
//         open: true, 
//         message: 'Changes updated successfully!', 
//         severity: 'success' 
//       });
//   };

//   // Handler for opening the 'Add' modal
//   const handleAddProjectClick = () => {
//     setProjectToEdit(null); // Ensure no project data is passed (so it's 'add' mode)
//     setIsAddProjectModalOpen(true);
//   };
 
//   // Handler for closing the main modal
//   const handleCloseProjectModal = () => {
//     setIsAddProjectModalOpen(false);
//     setProjectToEdit(null); // Clear the project to edit
//   };

//   // Handler for closing the members modal
//   const handleCloseMembersModal = () => {
//     setIsMembersModalOpen(false);
//     setProjectDataForMembers(null); // Clear the temporary data
//     fetchProjects(); // Re-fetch projects to update dashboard
//   };
  
//   // Handler for the edit button
//   const handleEditClick = (project: ProjectSummary) => {
//     setProjectToEdit(project); // Set the project to edit
//     setIsAddProjectModalOpen(true); // Open the modal
//   };

//   const handleDeleteClick = (project: ProjectSummary) => {
//     setProjectToDelete(project);
//     setIsDeleteModalOpen(true);
//   };

//   const handleCloseDeleteModal = () => {
//     setIsDeleteModalOpen(false);
//     setProjectToDelete(null);
//   };

//   const handleProjectDeleted = (deletedProjectId: number) => {
//     setProjects(prevProjects => prevProjects.filter(p => p.id !== deletedProjectId));
//     handleCloseDeleteModal();
//     setSnackbar({ 
//         open: true, 
//         message: 'Project deleted successfully!', 
//         severity: 'success' 
//     });
//   };

//   const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
//     setTabValue(newValue);
//   };

//   const filteredProjects = projects.filter(project => {
//     const statusMatch = (tabValue === 0) || 
//                         (tabValue === 1 && project.status.toLowerCase() === 'ongoing') ||
//                         (tabValue === 2 && project.status.toLowerCase() === 'finished');
    
//     const accountName = project.accountName || ''; 
//     const searchMatch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//                         accountName.toLowerCase().includes(searchQuery.toLowerCase());

//     return statusMatch && searchMatch;
//   });
  
//   const ongoingCount = projects.filter(p => p.status.toLowerCase() === 'ongoing').length;
//   const finishedCount = projects.filter(p => p.status.toLowerCase() === 'finished').length;
//   const totalCount = projects.length;

//   if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
//   if (error) return <Alert severity="error">{error}</Alert>;

//   const handleSnackbarClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
//     if (reason === 'clickaway') {
//       return;
//     }
//     setSnackbar(prev => ({ ...prev, open: false }));
//   };

//   return (
//     <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
//       {/* --- RESPONSIVE HEADER --- */}
//       <Box sx={{ 
//         display: 'flex', 
//         justifyContent: 'space-between', 
//         alignItems: { xs: 'flex-start', sm: 'center' }, // Align items differently on small screens
//         mb: 4,
//         flexDirection: { xs: 'column', sm: 'row' }, // Stack vertically on small screens
//         gap: 2 // Add space between items when stacked
//       }}>
//         <Typography variant="h4" component="h1">
//           Project Dashboard
//         </Typography>
//         <Button 
//           variant="contained" 
//           startIcon={<AddIcon />}
//           onClick={handleAddProjectClick}
//           sx={{ width: { xs: '100%', sm: 'auto' } }} // Full width on mobile
//         >
//           Add Project
//         </Button>
//       </Box>
     
//       {/* --- RESPONSIVE STATS & SEARCH GRID --- */}
//       <Grid container spacing={2} sx={{ mb: 4 }} alignItems="center">
//         {/* Stat Cards */}
//         <Grid size={3}>
//           <Box p={2} border={1} borderColor="grey.300" borderRadius={2} textAlign="center">
//             <Typography variant="h6">Total Projects</Typography>
//             <Typography variant="h3" color="primary">{totalCount}</Typography>
//           </Box>
//         </Grid>
//         <Grid size={3}>
//           <Box p={2} border={1} borderColor="grey.300" borderRadius={2} textAlign="center">
//             <Typography variant="h6">Ongoing</Typography>
//             <Typography variant="h3" color="warning.main">{ongoingCount}</Typography>
//           </Box>
//         </Grid>
//         <Grid size={3}>
//           <Box p={2} border={1} borderColor="grey.300" borderRadius={2} textAlign="center">
//             <Typography variant="h6">Finished</Typography>
//             <Typography variant="h3" color="success.main">{finishedCount}</Typography>
//           </Box>
//         </Grid>

//         {/* Search Field */}
//         <Grid size={3}>
//             <TextField
//               fullWidth
//               label="Search Projects"
//               variant="outlined"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//             />
//         </Grid>
//       </Grid>
      
//       {/* --- TABS --- */}
//       <Box sx={{ borderBottom: 1, borderColor: 'divider', width: '100%' }}>
//         <Tabs 
//           value={tabValue} 
//           onChange={handleChange} 
//           aria-label="project status tabs"
//           variant="scrollable" // Allows tabs to scroll on small screens
//           scrollButtons="auto" // Shows scroll buttons if needed
//         >
//           <Tab label={`All Projects (${totalCount})`} />
//           <Tab label={`Ongoing (${ongoingCount})`} />
//           <Tab label={`Finished (${finishedCount})`} />
//         </Tabs>
//       </Box>

//       {/* --- RESPONSIVE PROJECT CARDS GRID --- */}
//       <Grid container spacing={3} sx={{ mt: 2 }}>
//         {filteredProjects.length > 0 ? (
//           filteredProjects.map((project) => (
//             // Full width on mobile, 2 per row on tablet, 3 per row on desktop
//             <Grid size={4}>
//               <ProjectCard 
//                 project={project}
//                 onDeleteClick={handleDeleteClick} 
//                 onEditClick={handleEditClick} />
//             </Grid>
//           ))
//         ) : (
//           <Container sx={{ textAlign: 'center', mt: 5 }}>
//             <Typography variant="h6" color="text.secondary">No projects to display.</Typography>
//           </Container>
//         )}
//       </Grid>
      
//       {/* --- MODALS & SNACKBAR (No changes needed here) --- */}
//       <AddProjectModal 
//         open={isAddProjectModalOpen} 
//         onClose={handleCloseProjectModal} 
//         onNext={handleNextInProjectModal}
//         project={projectToEdit}
//         onProjectSaved={handleProjectSaved}
//       />
      
//       <AddMembersModal
//         open={isMembersModalOpen}
//         onClose={handleCloseMembersModal}
//         projectData={projectDataForMembers}
//       />

//        {projectToDelete && (
//           <DeleteProjectModal
//               open={isDeleteModalOpen}
//               onClose={handleCloseDeleteModal}
//               project={projectToDelete}
//               onProjectDeleted={handleProjectDeleted}
//           />
//       )}

//       <Snackbar
//             open={snackbar.open}
//             autoHideDuration={6000}
//             onClose={handleSnackbarClose}
//             anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
//         >
//             <Alert 
//                 onClose={handleSnackbarClose} 
//                 severity={snackbar.severity} 
//                 variant="filled" 
//                 sx={{ width: '100%', minWidth: '350px', boxShadow: 3 }}
//             >   
//                 {snackbar.message}
//             </Alert>
//         </Snackbar>

//     </Container>    
//   );
// };

// export default ProjectDashboard;






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