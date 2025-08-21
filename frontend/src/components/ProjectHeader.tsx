// import { Paper, Card } from '@mui/material';
// import { CustomField } from '../types/project';

// const getCustomFieldValue = (fields: CustomField[], fieldName: string) => {
//     return fields.find(f => f.name === fieldName)?.value || 'N/A';
// };
// const InfoCard: React.FC<{ title: string; name?: string; color: string }> = ({ title, name, color }) => (
//     <Card sx={{ backgroundColor: color, color: 'white', height: '100%', borderRadius: 2 }}>
//         <CardContent>
//             <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>{title}</Typography>
//             <Typography variant="h6" component="div">{name || 'Not Assigned'}</Typography>
//         </CardContent>
//     </Card>
// );
// interface ProjectHeaderProps {
//     project: ProjectDetails;
//     owner?: Membership;
//     manager?: Membership;
// }
// const ProjectHeader: React.FC<ProjectHeaderProps> = ({ project, owner, manager }) => {
//     const projectCode = getCustomFieldValue(project.custom_fields, 'Project Code');
//     const projectType = getCustomFieldValue(project.custom_fields, 'Project type');
//     const projectMode = getCustomFieldValue(project.custom_fields, 'Project Mode');
//     const startDate = getCustomFieldValue(project.custom_fields, 'Start Date');
//     const endDate = getCustomFieldValue(project.custom_fields, 'End Date');
//     return (
//         <Paper elevation={3} sx={{ p: 3, borderRadius: 3, mb: 4 }}>
//             <Grid container spacing={3} alignItems="center">
//                 <Grid item xs={12} md={6}>
//                     <Typography variant="h4" component="h1" gutterBottom>{project.name}</Typography>
//                     <Box sx={{ display: 'flex', gap: 3, color: 'text.secondary', mb: 1 }}>
//                         <Typography>Code: {projectCode}</Typography>
//                         <Typography>Type: {projectType}</Typography>
//                         <Typography>Mode: {projectMode}</Typography>
//                     </Box>
//                      <Box sx={{ display: 'flex', gap: 3, color: 'text.secondary' }}>
//                         <Typography>Start: {startDate}</Typography>
//                         <Typography>End: {endDate}</Typography>
//                     </Box>
//                 </Grid>
//                 <Grid item xs={6} md={3}><InfoCard title="Project Owner" name={owner?.user.name} color="#1976d2" /></Grid>
//                 <Grid item xs={6} md={3}><InfoCard title="Project Manager" name={manager?.user.name} color="#d32f2f" /></Grid>
//             </Grid>
//         </Paper>
//     );
// };

// export default ProjectHeader;


import React from 'react';
import { Paper, Card, Grid, Typography, Box, CardContent } from '@mui/material';
import type { ProjectDetails, Membership, CustomField } from '../types/project';
const getCustomFieldValue = (fields: CustomField[], fieldName: string) => {
    return fields.find(f => f.name === fieldName)?.value || 'N/A';
};
const InfoCard: React.FC<{ title: string; name?: string; color: string }> = ({ title, name, color }) => (
    <Card sx={{ backgroundColor: color, color: 'white', height: '100%', borderRadius: 2 }}>
        <CardContent>
            <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>{title}</Typography>
            <Typography variant="h6" component="div">{name || 'Not Assigned'}</Typography>
        </CardContent>
    </Card>
);
interface ProjectHeaderProps {
    project: ProjectDetails;
    owner?: Membership;
    manager?: Membership;
}
const ProjectHeader: React.FC<ProjectHeaderProps> = ({ project, owner, manager }) => {
    const projectCode = getCustomFieldValue(project.custom_fields, 'Project Code');
    const projectType = getCustomFieldValue(project.custom_fields, 'Project type');
    const projectMode = getCustomFieldValue(project.custom_fields, 'Project Mode');
    const startDate = getCustomFieldValue(project.custom_fields, 'Start Date');
    const endDate = getCustomFieldValue(project.custom_fields, 'End Date');
    return (
        <Paper elevation={3} sx={{ p: 3, borderRadius: 3, mb: 4 }}>
            <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} md={6}>
                    <Typography variant="h4" component="h1" gutterBottom>{project.name}</Typography>
                    <Box sx={{ display: 'flex', gap: 3, color: 'text.secondary', mb: 1 }}>
                        <Typography>Code: {projectCode}</Typography>
                        <Typography>Type: {projectType}</Typography>
                        <Typography>Mode: {projectMode}</Typography>
                    </Box>
                     <Box sx={{ display: 'flex', gap: 3, color: 'text.secondary' }}>
                        <Typography>Start: {startDate}</Typography>
                        <Typography>End: {endDate}</Typography>
                    </Box>
                </Grid>
                <Grid item xs={6} md={3}><InfoCard title="Project Owner" name={owner?.user.name} color="#1976d2" /></Grid>
                <Grid item xs={6} md={3}><InfoCard title="Project Manager" name={manager?.user.name} color="#d32f2f" /></Grid>
            </Grid>
        </Paper>
    );
};

export default ProjectHeader;
