


// import React from 'react';
// import { Box, Typography, Button, Paper, List, ListItem, ListItemText, ListItemAvatar, Avatar, IconButton } from '@mui/material';
// import AddIcon from '@mui/icons-material/Add';
// import EditIcon from '@mui/icons-material/Edit';
// import type { Membership } from '../types/project';

// interface MemberListProps {
//     members: Membership[];
//     onAddMemberClick: () => void;
// }
// const MemberList: React.FC<MemberListProps> = ({ members, onAddMemberClick }) => {
//     return (
//         <Paper elevation={3} sx={{ p: 2, borderRadius: 3 }}>
//             <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, px: 1 }}>
//                 <Typography variant="h6">Team Members</Typography>
//                 <Button variant="contained" startIcon={<AddIcon />} onClick={onAddMemberClick}>Add Members</Button>
//             </Box>
//             {/* <List>
//                 {members.map(member => (
//                     <ListItem key={member.id} divider secondaryAction={<IconButton edge="end"><EditIcon /></IconButton>}>
//                         <ListItemAvatar><Avatar>{member.user.name.charAt(0)}</Avatar></ListItemAvatar>
//                         <ListItemText primary={member.user.name} secondary={member.roles.map(r => r.name).join(', ')} />
//                     </ListItem>
//                 ))}
//             </List> */}
//              {members.length > 0 ? (
//                 <List>
//                     {members.map(member => (
//                         <ListItem key={member.id} divider secondaryAction={<IconButton edge="end"><EditIcon /></IconButton>}>
//                             <ListItemAvatar><Avatar>{member.user.name.charAt(0)}</Avatar></ListItemAvatar>
//                             <ListItemText primary={member.user.name} secondary={member.roles.map(r => r.name).join(', ')} />
//                         </ListItem>
//                     ))}
//                 </List>
//             ) : (
//                 <Box sx={{ textAlign: 'center', my: 4, color: 'text.secondary' }}>
//                     <Typography>No team members have been assigned to this project yet.</Typography>
//                 </Box>
//             )}
//         </Paper>
//     );  
// };

// export default MemberList;



import React, { useState } from 'react';
import { Box, Typography, Button, Paper, List, ListItem, ListItemText, ListItemAvatar, Avatar, IconButton, CircularProgress } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import type { Membership } from '../types/project';

interface MemberListProps { 
    projectId: number;
    members: Membership[];
    onAddMemberClick: () => void;
    onMemberDeleted: (membershipId: number) => void;
}

const MemberList: React.FC<MemberListProps> = ({ projectId, members, onAddMemberClick, onMemberDeleted }) => {
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const handleDelete = async (membershipId: number) => {
        if (!window.confirm("Are you sure you want to remove this member?")) {
            return;
        }

        setDeletingId(membershipId);

        try {
            // Send the DELETE request to the backend
            await axios.delete(`http://localhost:5000/api/projects/${projectId}/memberships/${membershipId}`);

            // Call the parent's callback to update the state
            onMemberDeleted(membershipId);
            
            alert('Member removed successfully!');

        } catch (error: any) {
            console.error('Failed to delete member:', error.response?.data || error);
            alert('An error occurred while removing the member.');
        } finally {
            setDeletingId(null);
        }
    };
    
    return (
        <Paper elevation={3} sx={{ p: 2, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, px: 1 }}>
                <Typography variant="h6">Team Members</Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={onAddMemberClick}>Add Members</Button>
            </Box>
            {members.length > 0 ? (
                <List>
                    {members.map(member => (
                        <ListItem 
                            key={member.id} 
                            divider 
                            secondaryAction={
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <IconButton edge="end"><EditIcon /></IconButton>
                                    {deletingId === member.id ? (
                                        <CircularProgress size={24} sx={{ ml: 1.5 }} />
                                    ) : (
                                        <IconButton 
                                            edge="end" 
                                            aria-label="delete" 
                                            onClick={() => handleDelete(member.id)}
                                            disabled={deletingId !== null}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    )}
                                </Box>
                            }
                        >
                            <ListItemAvatar><Avatar>{member.user.name.charAt(0)}</Avatar></ListItemAvatar>
                            <ListItemText primary={member.user.name} secondary={member.roles.map(r => r.name).join(', ')} />
                        </ListItem>
                    ))}
                </List>
            ) : (
                <Box sx={{ textAlign: 'center', my: 4, color: 'text.secondary' }}>
                    <Typography>No team members have been assigned to this project yet.</Typography>
                </Box>
            )}
        </Paper>
    );  
};

export default MemberList;
