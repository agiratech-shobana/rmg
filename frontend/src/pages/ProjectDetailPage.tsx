
import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Box, CircularProgress, Alert } from '@mui/material';



import type { ProjectDetails, Membership } from '../types/project';
import ProjectHeader from '../components/ProjectHeader';
import MemberList from '../components/MemberList';
// Other imports are already in the ProjectDashboard file

const ProjectDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [project, setProject] = useState<ProjectDetails | null>(null);
    const [memberships, setMemberships] = useState<Membership[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    

    useEffect(() => {
        const fetchDetails = async () => {
            if (!id) return;
            try {
                setLoading(true);
                const projectPromise = axios.get(`http://localhost:5000/api/projects/${id}`);
                const membersPromise = axios.get(`http://localhost:5000/api/projects/${id}/members`);
                const [projectResponse, membersResponse] = await Promise.all([projectPromise, membersPromise]);


                                console.log("API Response for Members:", membersResponse.data);
                                if (membersResponse.data && membersResponse.data.memberships) {
                    console.log("SUCCESS: Found 'memberships' array in the response.");
                    setMemberships(membersResponse.data.memberships);
                } else {
                    console.error("ERROR: The API response for members is missing the 'memberships' key. The data received was:", membersResponse.data);
                    // Set to an empty array so the app doesn't crash
                    setMemberships([]);
                }


                setProject(projectResponse.data.project);
                setMemberships(membersResponse.data.memberships);
            } catch (err) {
                setError('Failed to fetch project details.');
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

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>;
    if (error) return <Alert severity="error">{error}</Alert>;
    if (!project) return null;

    return (
        <Container maxWidth="lg">
            <ProjectHeader project={project} owner={projectOwner} manager={projectManager} />
            <MemberList members={teamMembers} onAddMemberClick={() => { /* TODO */ }} />
        </Container>
    );
};

export default ProjectDetailPage;