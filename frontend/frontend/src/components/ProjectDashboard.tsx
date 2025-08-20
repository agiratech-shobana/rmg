


// // frontend/src/components/ProjectDashboard.tsx
// import React, { useEffect, useState } from 'react';
// import { 
//   Container, Grid, Typography, Box, Tabs, Tab, CircularProgress, Alert,Button,
// } from '@mui/material';
// import AddIcon from '@mui/icons-material/Add';
// import axios from 'axios';
// import ProjectCard from './ProjectCard';
// import AddProjectModal from './AppProjectModal';
// interface Project {
//   id: number;
//   name: string;
//   accountName: string;
//   status: string;
//   progress: number;
//   loggedHours: number;
//   totalHours: number;
//   endDate: string;
// }

// const ProjectDashboard: React.FC = () => {
//   const [projects, setProjects] = useState<Project[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [tabValue, setTabValue] = useState(0);
//   const [isModalOpen, setIsModalOpen] = useState(false);

  
//   useEffect(() => {
//     const fetchProjects = async () => {
//       try {
//         const response = await axios.get('http://localhost:5000/api/projects', {
//           withCredentials: true 
//         });
//         setProjects(response.data);
//       } catch (err) {
//         setError('Failed to fetch projects. Please check the backend.');
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchProjects();
//   }, []);
// const handleAddProjectClick = () => {
//     setIsModalOpen(true);
//   };
 

//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//   };
//   const handleChange = (event: React.SyntheticEvent, newValue: number) => {
//     setTabValue(newValue);
//   };

//   const filteredProjects = projects.filter(project => {
//     if (tabValue === 0) return true;
//     if (tabValue === 1) return project.status.toLowerCase() === 'ongoing';
//     if (tabValue === 2) return project.status.toLowerCase() === 'finished';
//     if (tabValue === 3) return project.status.toLowerCase() === 'unfinished';
//     return true;
//   });
  
//   const ongoingCount = projects.filter(p => p.status.toLowerCase() === 'ongoing').length;
//   const finishedCount = projects.filter(p => p.status.toLowerCase() === 'finished').length;
//   const unfinishedCount = projects.filter(p => p.status.toLowerCase() === 'unfinished').length;
//   const totalCount = projects.length;

//   if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
//   if (error) return <Alert severity="error">{error}</Alert>;

//   return (
//     <Container maxWidth="xl" sx={{ mt: 4 }}>
//       {/* <Typography variant="h4" component="h1" gutterBottom>
//         Project Dashboard
//       </Typography> */}

// <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
//   <Typography variant="h4" component="h1" gutterBottom>
//     Project Dashboard
//   </Typography>
//   <Button 
//     variant="contained" 
//     startIcon={<AddIcon />}
//     onClick={handleAddProjectClick} // Use the new handler
//   >
//     Add Project
//   </Button>
// </Box>
      

//       {/* Corrected Grid for Summary Cards (no 'item' prop) */}
//       <Grid container spacing={4} sx={{ mt: 2 }}>
//         <Grid xs={12} sm={6} md={3}>
//           <Box p={2} border={1} borderColor="primary.main" borderRadius={2}>
//             <Typography variant="h5">Total Projects</Typography>
//             <Typography variant="h3" color="primary">{totalCount}</Typography>
//           </Box>
//         </Grid>
//         <Grid xs={12} sm={6} md={3}>
//           <Box p={2} border={1} borderColor="warning.main" borderRadius={2}>
//             <Typography variant="h5">Ongoing Projects</Typography>
//             <Typography variant="h3" color="warning">{ongoingCount}</Typography>
//           </Box>
//         </Grid>
//         <Grid xs={12} sm={6} md={3}>
//           <Box p={2} border={1} borderColor="success.main" borderRadius={2}>
//             <Typography variant="h5">Finished Projects</Typography>
//             <Typography variant="h3" color="success">{finishedCount}</Typography>
//           </Box>
//         </Grid>
//         <Grid xs={12} sm={6} md={3}>
//           <Box p={2} border={1} borderColor="error.main" borderRadius={2}>
//             <Typography variant="h5">Unfinished Projects</Typography>
//             <Typography variant="h3" color="error">{unfinishedCount}</Typography>
//           </Box>
//         </Grid>
//       </Grid>

//       <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
//         <Tabs value={tabValue} onChange={handleChange} aria-label="project status tabs">
//           <Tab label={`All Projects (${totalCount})`} />
//           <Tab label={`Ongoing (${ongoingCount})`} />
//           <Tab label={`Finished (${finishedCount})`} />
//           <Tab label={`Unfinished (${unfinishedCount})`} />
//         </Tabs>
//       </Box>

//       {/* Corrected Grid for Project Cards (no 'item' prop) */}
//       <Grid container spacing={4} sx={{ mt: 2 }}>
//         {filteredProjects.length > 0 ? (
//           filteredProjects.map((project) => (
//             <Grid key={project.id} xs={12} sm={6} md={4} lg={3}>
//               <ProjectCard project={project} />
//             </Grid>

//           ))
          
//         ) : (
//           <Typography variant="subtitle1" sx={{ ml: 4 }}>No projects to display in this category.</Typography>
//         )}
//       </Grid>

//       <AddProjectModal 
//         open={isModalOpen} 
//         onClose={handleCloseModal} 
//         onProjectAdded={() => {
//           setIsModalOpen(false);
//           // Optionally, you can refetch projects here
//           window.location.reload();
//         }}
//       />


      
//     </Container>
//   );
// };

// export default ProjectDashboard;



// import React, { useEffect, useState } from 'react';
// import { 
//   Container, Grid, Typography, Box, Tabs, Tab, CircularProgress, Alert,Button,
// } from '@mui/material';
// import AddIcon from '@mui/icons-material/Add';
// import axios from 'axios';
// import ProjectCard from './ProjectCard';
// import AddProjectModal from './AppProjectModal';
// import AddMembersModal from './AddMembersModal';

// interface Project {
//   id: number;
//   name: string;
//   accountName: string;
//   status: string;
//   progress: number;
//   loggedHours: number;
//   totalHours: number;
//   endDate: string;
// }

// const ProjectDashboard: React.FC = () => {
//   const [projects, setProjects] = useState<Project[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [tabValue, setTabValue] = useState(0);

//   const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
//   const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);
//   const [projectDataForMembers, setProjectDataForMembers] = useState<any>(null);

//   const fetchProjects = async () => {
//     try {
//       const response = await axios.get('http://localhost:5000/api/projects', {
//         withCredentials: true 
//       });
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

//   const handleAddProjectClick = () => {
//     setIsProjectModalOpen(true);
//   };
 
//   const handleCloseProjectModal = () => {
//     setIsProjectModalOpen(false);
//   };

//   const handleNextInProjectModal = (projectData: any) => {
//     setIsProjectModalOpen(false); // Close the project form modal
//     setProjectDataForMembers(projectData); // Save the project data
//     setIsMembersModalOpen(true); // Open the members modal
//   };

//   const handleCloseMembersModal = () => {
//     setIsMembersModalOpen(false);
//     setProjectDataForMembers(null);
//     window.location.reload(); // Refresh the page to show the new project
//   };

//   const handleChange = (event: React.SyntheticEvent, newValue: number) => {
//     setTabValue(newValue);
//   };

//   const filteredProjects = projects.filter(project => {
//     if (tabValue === 0) return true;
//     if (tabValue === 1) return project.status.toLowerCase() === 'ongoing';
//     if (tabValue === 2) return project.status.toLowerCase() === 'finished';
//     if (tabValue === 3) return project.status.toLowerCase() === 'unfinished';
//     return true;
//   });
  
//   const ongoingCount = projects.filter(p => p.status.toLowerCase() === 'ongoing').length;
//   const finishedCount = projects.filter(p => p.status.toLowerCase() === 'finished').length;
//   const unfinishedCount = projects.filter(p => p.status.toLowerCase() === 'unfinished').length;
//   const totalCount = projects.length;

//   if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
//   if (error) return <Alert severity="error">{error}</Alert>;

//   return (
//     <Container maxWidth="xl" sx={{ mt: 4 }}>
//       <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
//         <Typography variant="h4" component="h1" gutterBottom>
//           Project Dashboard
//         </Typography>
//         <Button 
//           variant="contained" 
//           startIcon={<AddIcon />}
//           onClick={handleAddProjectClick}
//         >
//           Add Project
//         </Button>
//       </Box>

//       <Grid container spacing={4} sx={{ mt: 2 }}>
//         <Grid xs={12} sm={6} md={3}>
//           <Box p={2} border={1} borderColor="primary.main" borderRadius={2}>
//             <Typography variant="h5">Total Projects</Typography>
//             <Typography variant="h3" color="primary">{totalCount}</Typography>
//           </Box>
//         </Grid>
//         <Grid xs={12} sm={6} md={3}>
//           <Box p={2} border={1} borderColor="warning.main" borderRadius={2}>
//             <Typography variant="h5">Ongoing Projects</Typography>
//             <Typography variant="h3" color="warning">{ongoingCount}</Typography>
//           </Box>
//         </Grid>
//         <Grid xs={12} sm={6} md={3}>
//           <Box p={2} border={1} borderColor="success.main" borderRadius={2}>
//             <Typography variant="h5">Finished Projects</Typography>
//             <Typography variant="h3" color="success">{finishedCount}</Typography>
//           </Box>
//         </Grid>
//         <Grid xs={12} sm={6} md={3}>
//           <Box p={2} border={1} borderColor="error.main" borderRadius={2}>
//             <Typography variant="h5">Unfinished Projects</Typography>
//             <Typography variant="h3" color="error">{unfinishedCount}</Typography>
//           </Box>
//         </Grid>
//       </Grid>

//       <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
//         <Tabs value={tabValue} onChange={handleChange} aria-label="project status tabs">
//           <Tab label={`All Projects (${totalCount})`} />
//           <Tab label={`Ongoing (${ongoingCount})`} />
//           <Tab label={`Finished (${finishedCount})`} />
//           <Tab label={`Unfinished (${unfinishedCount})`} />
//         </Tabs>
//       </Box>

//       <Grid container spacing={4} sx={{ mt: 2 }}>
//         {filteredProjects.length > 0 ? (
//           filteredProjects.map((project) => (
//             <Grid key={project.id} xs={12} sm={6} md={4} lg={3}>
//               <ProjectCard project={project} />
//             </Grid>
//           ))
//         ) : (
//           <Typography variant="subtitle1" sx={{ ml: 4 }}>No projects to display in this category.</Typography>
//         )}
//       </Grid>

//       <AddProjectModal 
//         open={isProjectModalOpen} 
//         onClose={handleCloseProjectModal} 
//         onNext={handleNextInProjectModal}
//       />
      
//       <AddMembersModal
//         open={isMembersModalOpen}
//         onClose={handleCloseMembersModal}
//         projectData={projectDataForMembers}
//       />

//     </Container>
//   );
// };

// export default ProjectDashboard;




// import React, { useEffect, useState } from 'react';
// import { 
//   Container, Grid, Typography, Box, Tabs, Tab, CircularProgress, Alert,Button,
// } from '@mui/material';
// import AddIcon from '@mui/icons-material/Add';
// import axios from 'axios';
// import ProjectCard from './ProjectCard';
// import AddProjectModal from './AppProjectModal';
// import AddMembersModal from './AddMembersModal';

// interface Project {
//   id: number;
//   name: string;
//   accountName: string;
//   status: string;
//   progress: number;
//   loggedHours: number;
//   totalHours: number;
//   endDate: string;
// }

// const ProjectDashboard: React.FC = () => {
//   const [projects, setProjects] = useState<Project[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [tabValue, setTabValue] = useState(0);

//   const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
//   const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);
//   const [projectDataForMembers, setProjectDataForMembers] = useState<any>(null);

//   const fetchProjects = async () => {
//     try {
//       const response = await axios.get('http://localhost:5000/api/projects', {
//         withCredentials: true 
//       });
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

//   const handleAddProjectClick = () => {
//     setIsProjectModalOpen(true);
//   };
 
//   const handleCloseProjectModal = () => {
//     setIsProjectModalOpen(false);
//   };

//   const handleNextInProjectModal = (projectData: any) => {
//     setIsProjectModalOpen(false);
//     setProjectDataForMembers(projectData);
//     setIsMembersModalOpen(true);
//   };

//   const handleCloseMembersModal = () => {
//     setIsMembersModalOpen(false);
//     setProjectDataForMembers(null);
//     window.location.reload();
//   };


  

//   const handleChange = (event: React.SyntheticEvent, newValue: number) => {
//     setTabValue(newValue);
//   };

//   const filteredProjects = projects.filter(project => {
//     if (tabValue === 0) return true;
//     if (tabValue === 1) return project.status.toLowerCase() === 'ongoing';
//     if (tabValue === 2) return project.status.toLowerCase() === 'finished';
//     if (tabValue === 3) return project.status.toLowerCase() === 'unfinished';
//     return true;
//   });
  
//   const ongoingCount = projects.filter(p => p.status.toLowerCase() === 'ongoing').length;
//   const finishedCount = projects.filter(p => p.status.toLowerCase() === 'finished').length;
//   const unfinishedCount = projects.filter(p => p.status.toLowerCase() === 'unfinished').length;
//   const totalCount = projects.length;

//   if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
//   if (error) return <Alert severity="error">{error}</Alert>;

//   return (
//     <Container maxWidth="xl" sx={{ mt: 4 }}>
//       <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
//         <Typography variant="h4" component="h1" gutterBottom>
//           Project Dashboard
//         </Typography>
//         <Button 
//           variant="contained" 
//           startIcon={<AddIcon />}
//           onClick={handleAddProjectClick}
//         >
//           Add Project
//         </Button>
//       </Box>

//       <Grid container spacing={4} sx={{ mt: 2 }}>
//         <Grid xs={12} sm={6} md={3}>
//           <Box p={2} border={1} borderColor="primary.main" borderRadius={2}>
//             <Typography variant="h5">Total Projects</Typography>
//             <Typography variant="h3" color="primary">{totalCount}</Typography>
//           </Box>
//         </Grid>
//         <Grid xs={12} sm={6} md={3}>
//           <Box p={2} border={1} borderColor="warning.main" borderRadius={2}>
//             <Typography variant="h5">Ongoing Projects</Typography>
//             <Typography variant="h3" color="warning">{ongoingCount}</Typography>
//           </Box>
//         </Grid>
//         <Grid xs={12} sm={6} md={3}>
//           <Box p={2} border={1} borderColor="success.main" borderRadius={2}>
//             <Typography variant="h5">Finished Projects</Typography>
//             <Typography variant="h3" color="success">{finishedCount}</Typography>
//           </Box>
//         </Grid>
//         <Grid xs={12} sm={6} md={3}>
//           <Box p={2} border={1} borderColor="error.main" borderRadius={2}>
//             <Typography variant="h5">Unfinished Projects</Typography>
//             <Typography variant="h3" color="error">{unfinishedCount}</Typography>
//           </Box>
//         </Grid>
//       </Grid>

//       <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
//         <Tabs value={tabValue} onChange={handleChange} aria-label="project status tabs">
//           <Tab label={`All Projects (${totalCount})`} />
//           <Tab label={`Ongoing (${ongoingCount})`} />
//           <Tab label={`Finished (${finishedCount})`} />
//           <Tab label={`Unfinished (${unfinishedCount})`} />
//         </Tabs>
//       </Box>

//       <Grid container spacing={4} sx={{ mt: 2 }}>
//         {filteredProjects.length > 0 ? (
//           filteredProjects.map((project) => (
//             <Grid key={project.id} xs={12} sm={6} md={4} lg={3}>
//               <ProjectCard project={project} />
//             </Grid>
//           ))
//         ) : (
//           <Typography variant="subtitle1" sx={{ ml: 4 }}>No projects to display in this category.</Typography>
//         )}
//       </Grid>

//       <AddProjectModal 
//         open={isProjectModalOpen} 
//         onClose={handleCloseProjectModal} 
//         onNext={handleNextInProjectModal}
//       />
      
//       <AddMembersModal
//         open={isMembersModalOpen}
//         onClose={handleCloseMembersModal}
//         projectData={projectDataForMembers}
//       />

//     </Container>
//   );
// };

// export default ProjectDashboard;




// frontend/src/components/ProjectDashboard.tsx
import React, { useEffect, useState } from 'react';
import { 
  Container, Grid, Typography, Box, Tabs, Tab, CircularProgress, Alert,Button,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import ProjectCard from './ProjectCard';
import AddProjectModal from './AppProjectModal';
import AddMembersModal from './AddMembersModal';

interface Project {
  id: number;
  name: string;
  accountName: string;
  status: string;
  progress: number;
  loggedHours: number;
  totalHours: number;
  endDate: string;
}

const ProjectDashboard: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);

  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);
  const [projectDataForMembers, setProjectDataForMembers] = useState<any>(null);

  const fetchProjects = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/projects', {
        withCredentials: true 
      });
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

  const handleAddProjectClick = () => {
    setIsProjectModalOpen(true);
  };
 
  const handleCloseProjectModal = () => {
    setIsProjectModalOpen(false);
  };

  const handleNextInProjectModal = (projectData: any) => {
    setIsProjectModalOpen(false);
    setProjectDataForMembers(projectData);
    setIsMembersModalOpen(true);
  };

  const handleCloseMembersModal = () => {
    setIsMembersModalOpen(false);
    setProjectDataForMembers(null);
    window.location.reload();
  };
  
  // --- CORRECTED THIS FUNCTION ---
  const handleProjectAndMembersAdded = () => {
    setIsMembersModalOpen(false);
    setProjectDataForMembers(null);
    window.location.reload();
  };
  // -----------------------------

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const filteredProjects = projects.filter(project => {
    if (tabValue === 0) return true;
    if (tabValue === 1) return project.status.toLowerCase() === 'ongoing';
    if (tabValue === 2) return project.status.toLowerCase() === 'finished';
    if (tabValue === 3) return project.status.toLowerCase() === 'unfinished';
    return true;
  });
  
  const ongoingCount = projects.filter(p => p.status.toLowerCase() === 'ongoing').length;
  const finishedCount = projects.filter(p => p.status.toLowerCase() === 'finished').length;
  const unfinishedCount = projects.filter(p => p.status.toLowerCase() === 'unfinished').length;
  const totalCount = projects.length;

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;

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
        <Grid xs={12} sm={6} md={3}>
          <Box p={2} border={1} borderColor="primary.main" borderRadius={2}>
            <Typography variant="h5">Total Projects</Typography>
            <Typography variant="h3" color="primary">{totalCount}</Typography>
          </Box>
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <Box p={2} border={1} borderColor="warning.main" borderRadius={2}>
            <Typography variant="h5">Ongoing Projects</Typography>
            <Typography variant="h3" color="warning">{ongoingCount}</Typography>
          </Box>
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <Box p={2} border={1} borderColor="success.main" borderRadius={2}>
            <Typography variant="h5">Finished Projects</Typography>
            <Typography variant="h3" color="success">{finishedCount}</Typography>
          </Box>
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <Box p={2} border={1} borderColor="error.main" borderRadius={2}>
            <Typography variant="h5">Unfinished Projects</Typography>
            <Typography variant="h3" color="error">{unfinishedCount}</Typography>
          </Box>
        </Grid>
      </Grid>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={tabValue} onChange={handleChange} aria-label="project status tabs">
          <Tab label={`All Projects (${totalCount})`} />
          <Tab label={`Ongoing (${ongoingCount})`} />
          <Tab label={`Finished (${finishedCount})`} />
          <Tab label={`Unfinished (${unfinishedCount})`} />
        </Tabs>
      </Box>

      <Grid container spacing={4} sx={{ mt: 2 }}>
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project) => (
            <Grid key={project.id} xs={12} sm={6} md={4} lg={3}>
              <ProjectCard project={project} />
            </Grid>
          ))
        ) : (
          <Typography variant="subtitle1" sx={{ ml: 4 }}>No projects to display in this category.</Typography>
        )}
      </Grid>

      <AddProjectModal 
        open={isProjectModalOpen} 
        onClose={handleCloseProjectModal} 
        onNext={handleNextInProjectModal}
      />
      
      <AddMembersModal
        open={isMembersModalOpen}
        onClose={handleCloseMembersModal}
        projectData={projectDataForMembers}
        onProjectAdded={handleProjectAndMembersAdded}
      />

    </Container>
  );
};

export default ProjectDashboard;