// frontend/src/components/ProjectCard.tsx
import React from 'react';
import { Card, CardContent, Typography, LinearProgress, Grid, Chip } from '@mui/material';
import {Link} from 'react-router-dom';
import { styled } from '@mui/material/styles';
import type { ProjectSummary } from '../types/project';

const StyledCard = styled(Card)(({ theme }) => ({
  minWidth: 300,
  maxWidth: '100%',
  margin: theme.spacing(1),
  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'translateY(-5px)',
  },
}));

interface ProjectCardProps {
  // project: {
  //   name: string;
  //   accountName: string;
  //   status: string;
  //   progress: number;
  //   loggedHours: number;
  //   totalHours: number;
  //   endDate: string;
  // };
  project: ProjectSummary
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'ongoing': return 'primary';
    case 'finished': return 'success';
    case 'unfinished': return 'error';
    default: return 'default';
  }
};

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const statusColor = getStatusColor(project.status);
  
  return (
        <Link to={`/projects/${project.id}`} style={{ textDecoration: 'none' }}>

    <StyledCard>
      <CardContent>
        <Grid container justifyContent="space-between" alignItems="center">
          <Typography variant="h6" component="div">
            {project.name}
          </Typography>
          <Chip label={project.status} color={statusColor} size="small" />
        </Grid>
        <Typography color="text.secondary" gutterBottom>
          {project.accountName}
        </Typography>

        <Grid container alignItems="center" spacing={1} sx={{ mt: 2 }}>
          <Grid item xs={10}>
            <LinearProgress variant="determinate" value={project.progress} />
          </Grid>
          <Grid item xs={2}>
            <Typography variant="body2">{project.progress}%</Typography>
          </Grid>
        </Grid>

        <Grid container sx={{ mt: 2 }}>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">Logged Hours</Typography>
            <Typography variant="body1">{project.loggedHours}/{project.totalHours}hrs</Typography>
          </Grid>
          <Grid item xs={6} textAlign="right">
            <Typography variant="body2" color="text.secondary">End Date</Typography>
            <Typography variant="body1">{project.endDate}</Typography>
          </Grid>
        </Grid>
      </CardContent>
    </StyledCard>
        </Link>

  );
};

export default ProjectCard;