



// frontend/src/components/ProjectCard.tsx
import React, { useState } from 'react';
import { Card, CardContent, Typography, LinearProgress,  Chip, IconButton, Menu, MenuItem, Box ,Grid} from '@mui/material';

import { Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import type { ProjectSummary } from '../types/project';

const StyledCard = styled(Card)(({ theme }) => ({
  minWidth: 400,
  maxWidth:'100%',
  minHeight:220,
  margin: theme.spacing(1),
  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'translateY(-5px)',
  },
}));

interface ProjectCardProps {
  project: ProjectSummary;
  onDeleteClick: (project: ProjectSummary) => void;
  onEditClick: (project: ProjectSummary) => void; 
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'ongoing': return 'primary';
    case 'finished': return 'success';
    // case 'unfinished': return 'error';
    default: return 'default';
  }
};

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onDeleteClick,onEditClick }) => {
  const statusColor = getStatusColor(project.status);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleDeleteClick = () => {
    handleMenuClose();
    // FIX: Add a defensive check to ensure onDeleteClick is a function
    if (typeof onDeleteClick === 'function') {
      onDeleteClick(project);
    } else {
      console.error("onDeleteClick is not a function:", onDeleteClick);
    }
  };
        // const progressColor = project.status.toLowerCase() === 'finished' ? 'success' : 'warning';




        const handleEditClick = () => {
    handleMenuClose();
    if (typeof onEditClick === 'function') {
      onEditClick(project);
    } else {
      console.error("onEditClick is not a function:", onEditClick);
    }
  };
  return (
    <StyledCard>
      <CardContent>
        <Grid container justifyContent="space-between" alignItems="center" size={{xs:12,sm:6,md:4,lg:3}}>
          <Typography variant="h6" component="div">
            <Link to={`/projects/${project.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              {project.name}
            </Link>
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Chip label={project.status} color={statusColor} size="small" />
            <IconButton
              aria-label="more"
              aria-controls="long-menu"
              aria-haspopup="true"
              onClick={handleMenuClick}
              size="small"
              sx={{ ml: 1 }}
            >
              <MoreVertIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenuClose}
            >
               <MenuItem onClick={handleEditClick}>Edit Project</MenuItem>
              <MenuItem onClick={handleDeleteClick}>Delete Project</MenuItem>
            </Menu>
          </Box>
        </Grid>
        <Typography color="text.secondary" gutterBottom>
          {project.accountName}
        </Typography>
        <Grid container alignItems="center" spacing={1} sx={{ mt: 2 }}>
         
          <Grid size={2}>
            <Typography variant="body2">{project.progress}%</Typography>
          </Grid>
        </Grid>
        <LinearProgress
  variant="determinate"
  value={project.progress}
  sx={{
    height: 8,
    borderRadius: 5,
    backgroundColor: '#ddd',
    '& .MuiLinearProgress-bar': {
      backgroundColor: project.status.toLowerCase() === 'finished' ? 'green' : 'orange',
    },
  }}
/>


        
        <Grid container sx={{ mt: 2 }}>
         
          <Grid size={11} textAlign="right">
            <Typography variant="body2" color="text.secondary">End Date</Typography>
            <Typography variant="body1">{project.endDate}</Typography>
          </Grid>
        </Grid>
      </CardContent>
    </StyledCard>
  );
};

export default ProjectCard;
