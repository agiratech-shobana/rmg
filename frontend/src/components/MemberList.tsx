// import { List, ListItem, ListItemText, ListItemAvatar, Avatar, IconButton } from '@mui/material';
// import EditIcon from '@mui/icons-material/Edit';

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
//             <List>
//                 {members.map(member => (
//                     <ListItem key={member.id} divider secondaryAction={<IconButton edge="end"><EditIcon /></IconButton>}>
//                         <ListItemAvatar><Avatar>{member.user.name.charAt(0)}</Avatar></ListItemAvatar>
//                         <ListItemText primary={member.user.name} secondary={member.roles.map(r => r.name).join(', ')} />
//                     </ListItem>
//                 ))}
//             </List>
//         </Paper>
//     );
// };

// export default MemberList;


import React from 'react';
import { Box, Typography, Button, Paper, List, ListItem, ListItemText, ListItemAvatar, Avatar, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import type { Membership } from '../types/project';

interface MemberListProps {
    members: Membership[];
    onAddMemberClick: () => void;
}
const MemberList: React.FC<MemberListProps> = ({ members, onAddMemberClick }) => {
    return (
        <Paper elevation={3} sx={{ p: 2, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, px: 1 }}>
                <Typography variant="h6">Team Members</Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={onAddMemberClick}>Add Members</Button>
            </Box>
            {/* <List>
                {members.map(member => (
                    <ListItem key={member.id} divider secondaryAction={<IconButton edge="end"><EditIcon /></IconButton>}>
                        <ListItemAvatar><Avatar>{member.user.name.charAt(0)}</Avatar></ListItemAvatar>
                        <ListItemText primary={member.user.name} secondary={member.roles.map(r => r.name).join(', ')} />
                    </ListItem>
                ))}
            </List> */}
             {members.length > 0 ? (
                <List>
                    {members.map(member => (
                        <ListItem key={member.id} divider secondaryAction={<IconButton edge="end"><EditIcon /></IconButton>}>
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
