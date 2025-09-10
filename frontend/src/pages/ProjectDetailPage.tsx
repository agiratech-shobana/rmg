
import React, { useState, useEffect, useMemo } from 'react';
import { useParams,useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Box, CircularProgress, Alert,Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';



import type { ProjectDetails, Membership } from '../types/project';
import ProjectHeader from '../components/ProjectHeader';
import MemberList from '../components/MemberList';
import AddMemberToProjectModal from '../components/AddMemberToProjectModal';
// Other imports are already in the ProjectDashboard file

const ProjectDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [project, setProject] = useState<ProjectDetails | null>(null);
    const [memberships, setMemberships] = useState<Membership[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
        const [isModalOpen, setIsModalOpen] = useState(false);
        const [totalHours, setTotalHours] = useState<number | null>(null);


        function getErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    return err.response?.data?.error || err.message;
  }
  if (err instanceof Error) {
    return err.message;
  }
  return String(err);
}


    

    useEffect(() => {
  const fetchDetails = async () => {
    if (!id) return;
    try {
      setLoading(true);

      const projectPromise = axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/projects/${id}`);
      const membersPromise = axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/projects/${id}/members`);
      const hoursPromise = axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/projects/${id}/logged-hours`);

      const [projectResponse, membersResponse, hoursResponse] = await Promise.all([
        projectPromise,
        membersPromise,
        hoursPromise
      ]);

      setProject(projectResponse.data.project);

      if (membersResponse.data && membersResponse.data.memberships) {
        setMemberships(membersResponse.data.memberships);
      } else {
        setMemberships([]);
      }

      setTotalHours(hoursResponse.data.loggedHours);

    } catch (err:unknown) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  fetchDetails();
}, [id]);

    const { projectOwner, projectManager, teamMembers } = useMemo(() => {
        const owner = memberships.find(m => m.roles.some(r => r.name === 'Project Owner'));
        const manager = memberships.find(m => m.roles.some(r => r.name === 'Project Manager'));
        const remainingMembers = memberships.filter(m => m.id !== owner?.id && m.id !== manager?.id);

         console.log("Processed Members:", {
            projectOwner: owner,
            projectManager: manager,
            teamMembers: remainingMembers
        });
        
        return { projectOwner: owner, projectManager: manager, teamMembers: remainingMembers };
    }, [memberships]);



     const handleMembersAdded = (newlyAddedMemberships: Membership[]) => {
        // Add the new members to our list to update the UI instantly
        setMemberships(prev => [...prev, ...newlyAddedMemberships]);
        // Close the modal
        setIsModalOpen(false);
    };



    const handleMemberDeleted = (deletedMembershipId: number) => {
        setMemberships(prevMemberships => prevMemberships.filter(m => m.id !== deletedMembershipId));
    };
    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>;
    if (error) return <Alert severity="error">{error}</Alert>;
    if (!project) return null;

    return (
        <Container maxWidth="lg">
                 {/* --- 4. ADD THE BUTTON TO THE UI --- */}
            <Button
                variant="outlined"
                style={{ marginTop: '20px',marginLeft:'850px' }}
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate(-1)} // This takes the user to the previous page
                sx={{ mb: 3 }} // Adds some margin at the bottom
            >
                Back to Project Dashboard
            </Button>
            <ProjectHeader project={project} owner={projectOwner} manager={projectManager} />
            {totalHours !== null && (
  <Box sx={{ mt: 2, fontWeight: "bold" }}>
    Total Logged Hours: {totalHours}
  </Box>
)}
            {/* <MemberList members={teamMembers} onAddMemberClick={() => setIsModalOpen(true)} /> */}
            <MemberList members={teamMembers} onAddMemberClick={() => setIsModalOpen(true)}     projectId={Number(id)}   onMemberDeleted={handleMemberDeleted}/>

                <AddMemberToProjectModal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                projectId={Number(id)}
                currentMembers={memberships}
                onMembersAdded={handleMembersAdded}
            />
        </Container>
    );
};

export default ProjectDetailPage;