

// // -------------------------------------------------------------------
// import { Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
// import type { SelectChangeEvent } from '@mui/material/Select';
// import type { User, Role } from '../types/project';
// import React, { useState, useEffect, useMemo } from 'react';
// import type { Membership } from '../types/project';
// import axios from 'axios';
// import { CircularProgress, Button, Typography, Grid } from '@mui/material';




// interface AddMemberToProjectModalProps {
//     open: boolean;
//     onClose: () => void;
//     projectId: number;
//     currentMembers: Membership[];
//     onMembersAdded: (newMemberships: Membership[]) => void;
// }

// const AddMemberToProjectModal: React.FC<AddMemberToProjectModalProps> = ({ open, onClose, projectId, currentMembers, onMembersAdded }) => {
//     const [allUsers, setAllUsers] = useState<User[]>([]);
//     const [allRoles, setAllRoles] = useState<Role[]>([]);
//     const [loading, setLoading] = useState(false);
//     const [selectedUsers, setSelectedUsers] = useState<Map<number, number>>(new Map());
//     const [isSubmitting, setIsSubmitting] = useState(false);

//     useEffect(() => {
//         if (open) {
//             setLoading(true);
//             const usersPromise = axios.get('http://localhost:5000/api/users');
//             const rolesPromise = axios.get('http://localhost:5000/api/roles');
//             Promise.all([usersPromise, rolesPromise])
//                 .then(([usersResponse, rolesResponse]) => {
//                     // --- THIS IS THE FIX ---
//                     // The user data is the response itself, not nested under a 'users' key.
//                     setAllUsers(usersResponse.data); 
//                     setAllRoles(rolesResponse.data.roles);
//                 })
//                 .catch(err => console.error("Failed to load data for modal", err))
//                 .finally(() => setLoading(false));
//         }
//     }, [open]);
    
//     const availableUsers = useMemo(() => {
//         const currentMemberIds = new Set(currentMembers.map(m => m.user.id));
//         return (allUsers || []).filter(user => !currentMemberIds.has(user.id));
//     }, [allUsers, currentMembers]);

//     const handleRoleChange = (userId: number, roleId: number) => {
//         setSelectedUsers(prev => {
//             const newMap = new Map(prev);
//             if (roleId === 0) {
//                 newMap.delete(userId);
//             } else {
//                 newMap.set(userId, roleId);
//             }
//             return newMap;
//         });
//     };

//     const handleSubmit = async () => {
//         if (selectedUsers.size === 0) {
//             alert('Please select at least one user with a role.');
//             return;
//         }
//         setIsSubmitting(true);
        
//         const addMemberPromises = Array.from(selectedUsers.entries()).map(([userId, roleId]) => {
//             const payload = { user_id: userId, role_ids: [roleId] };
//             return axios.post(`http://localhost:5000/api/projects/${projectId}/members`, payload);
//         });

//         try {
//             const responses = await Promise.all(addMemberPromises);
//             const newMemberships = responses.map(res => res.data.membership);
//             onMembersAdded(newMemberships);
//             handleClose();
//         } catch (error) {
//             console.error('Failed to add members', error);
//             alert('An error occurred while adding members.');
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     const handleClose = () => {
//         setSelectedUsers(new Map());
//         onClose();
//     };

//     return (
//         <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
//             <DialogTitle>Add Members to Project</DialogTitle>
//             <DialogContent dividers>
//                 {loading ? <CircularProgress sx={{ display: 'block', margin: '20px auto' }}/> : (
//                     <Grid container spacing={2} sx={{ mt: 1 }}>
//                         {availableUsers.map(user => (
//                             <React.Fragment key={user.id}>
//                                 <Grid item xs={6} sx={{ display: 'flex', alignItems: 'center' }}>
//                                     <Typography>{user.firstname} {user.lastname}</Typography>
//                                 </Grid>
//                                 <Grid item xs={6}>
//                                     <FormControl fullWidth size="small">
//                                         <InputLabel>Role</InputLabel>
//                                         <Select
//                                             value={selectedUsers.get(user.id) || 0}
//                                             label="Role"
//                                             onChange={(e: SelectChangeEvent<number>) => handleRoleChange(user.id, e.target.value as number)}
//                                         >
//                                             <MenuItem value={0}><em>-- None --</em></MenuItem>
//                                             {allRoles.map((role) => (
//                                                 <MenuItem key={role.id} value={role.id}>{role.name}</MenuItem>
//                                             ))}
//                                         </Select>
//                                     </FormControl>
//                                 </Grid>
//                             </React.Fragment>
//                         ))}
//                     </Grid>
//                 )}
//             </DialogContent>
//             <DialogActions>
//                 <Button onClick={handleClose} disabled={isSubmitting}>Cancel</Button>
//                 <Button onClick={handleSubmit} variant="contained" disabled={isSubmitting || loading || selectedUsers.size === 0}>
//                     {isSubmitting ? 'Adding...' : 'Add Selected Members'}
//                 </Button>
//             </DialogActions>
//         </Dialog>
//     );
// };
// export default AddMemberToProjectModal;


// frontend/components/AddMemberToProjectModal.tsx

// import React, { useState, useEffect, useMemo } from 'react';
// import axios from 'axios';
// import {
//   Dialog, DialogTitle, DialogContent, DialogActions, Button,
//   List, ListItem, ListItemIcon, Checkbox, ListItemText, CircularProgress, Box, Typography
// } from '@mui/material';
// import type { Membership, Role } from '../types/project';

// // This is the shape of the user data from our fast /api/employees endpoint
// interface UserFromDB {
//   id: number;
//   name: string;
//   role: string;
// }

// interface AddMemberToProjectModalProps {
//     open: boolean;
//     onClose: () => void;
//     projectId: number;
//     currentMembers: Membership[];
//     onMembersAdded: (newMemberships: Membership[]) => void;
// }

// const AddMemberToProjectModal: React.FC<AddMemberToProjectModalProps> = ({ open, onClose, projectId, currentMembers, onMembersAdded }) => {
//     const [allUsers, setAllUsers] = useState<UserFromDB[]>([]);
//     const [allRoles, setAllRoles] = useState<Role[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [selectedUserIds, setSelectedUserIds] = useState<Set<number>>(new Set());
//     const [isSubmitting, setIsSubmitting] = useState(false);

//     useEffect(() => {
//         if (open) {
//             setLoading(true);
//             // --- UPGRADE 1: Fetching from your FAST local database endpoint ---
//             const usersPromise = axios.get('http://localhost:5000/api/employees');
//             const rolesPromise = axios.get('http://localhost:5000/api/roles');
            
//             Promise.all([usersPromise, rolesPromise])
//                 .then(([usersResponse, rolesResponse]) => {
//                     setAllUsers(usersResponse.data.users);
//                     setAllRoles(rolesResponse.data.roles);
//                 })
//                 .catch(err => console.error("Failed to load data for modal", err))
//                 .finally(() => setLoading(false));
//         }
//     }, [open]);
    
//     // --- UPGRADE 2: We keep this smart logic to filter out existing members ---
//     const availableUsers = useMemo(() => {
//         const currentMemberIds = new Set(currentMembers.map(m => m.user.id));
//         return (allUsers || []).filter(user => !currentMemberIds.has(user.id));
//     }, [allUsers, currentMembers]);

//     const handleToggle = (userId: number) => {
//         setSelectedUserIds(prev => {
//             const newSet = new Set(prev);
//             if (newSet.has(userId)) {
//                 newSet.delete(userId);
//             } else {
//                 newSet.add(userId);
//             }
//             return newSet;
//         });
//     };

//     // --- UPGRADE 3: The submission logic is now correct for this page ---
//     // const handleSubmit = async () => {
//     //     if (selectedUserIds.size === 0) {
//     //         alert('Please select at least one member to add.');
//     //         return;
//     //     }
//     //     setIsSubmitting(true);
        
//     //     // Let's assign a default role of "Developer" for simplicity.
//     //     // You can make this more advanced later if needed.
//     //     const developerRole = allRoles.find(r => r.name.toLowerCase() === 'developer');
//     //     const defaultRoleId = developerRole ? developerRole.id : 4; // Fallback to a hardcoded ID

//     //     const addMemberPromises = Array.from(selectedUserIds).map(userId => {
//     //         const payload = { user_id: userId, role_ids: [defaultRoleId] };
//     //         return axios.post(`http://localhost:5000/api/projects/${projectId}/members`, payload);
//     //     });

//     //     try {
//     //         const responses = await Promise.all(addMemberPromises);
//     //         const newMemberships = responses.map(res => res.data.membership);
//     //         onMembersAdded(newMemberships);
//     //         handleClose();
//     //     } catch (error) {
//     //         console.error('Failed to add members', error);
//     //         alert('An error occurred while adding members.');
//     //     } finally {
//     //         setIsSubmitting(false);
//     //     }
//     // };

//     // --- TEMPORARY TEST CODE ---
// const handleSubmit = async () => {
//     // We will use the old state 'selectedUserIds' for this test.
//     // Make sure you have this state defined:
//     // const [selectedUserIds, setSelectedUserIds] = useState<Set<number>>(new Set());
//     // And that your handleToggle updates it.

//     if (selectedUserIds.size === 0) {
//         alert('Please select at least one member to add.');
//         return;
//     }
//     setIsSubmitting(true);
    
//     console.log("🚀 STARTING EXPERIMENT: Sending member with NO role.");

//     const addMemberPromises = Array.from(selectedUserIds).map(userId => {
//         // The payload for our experiment: an empty role_ids array
//         const payload = { 
//             user_id: userId, 
//             role_ids: [] // <-- The key part of our test!
//         };
        
//         // This calls your backend route, which passes this payload along
//         return axios.post(`http://localhost:5000/api/projects/${projectId}/members`, payload);
//     });

//     try {
//         const responses = await Promise.all(addMemberPromises);
//         const newMemberships = responses.map(res => res.data.membership);
//         console.log("✅ EXPERIMENT SUCCESSFUL: The API accepted the request.", newMemberships);
//         alert("The API accepted the request. Check the project to see what role was assigned.");
//         onMembersAdded(newMemberships);
//         handleClose();
//     } catch (error) {
//         console.error("🔥 EXPERIMENT FAILED: The API threw an error.", error);
//         alert("The API rejected the request with an error. This is also a useful result!");
//     } finally {
//         setIsSubmitting(false);
//     }
// };

//     const handleClose = () => {
//         setSelectedUserIds(new Set());
//         onClose();
//     };

//     return (
//         <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
//             <DialogTitle>Add Members to Project</DialogTitle>
//             <DialogContent dividers>
//                 {loading ? <CircularProgress sx={{ display: 'block', margin: '20px auto' }}/> : (
//                     // --- UPGRADE 4: Using the better checkbox list UI ---
//                     <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
//                         {availableUsers.map(user => (
//                             <ListItem key={user.id} disablePadding>
//                                 <Button onClick={() => handleToggle(user.id)} sx={{ width: '100%', justifyContent: 'flex-start', textTransform: 'none' }}>
//                                     <ListItemIcon>
//                                         <Checkbox
//                                             edge="start"
//                                             checked={selectedUserIds.has(user.id)}
//                                             tabIndex={-1}
//                                             disableRipple
//                                         />
//                                     </ListItemIcon>
//                                     <ListItemText primary={user.name} secondary={user.role} />
//                                 </Button>
//                             </ListItem>
//                         ))}
//                     </List>
//                 )}
//             </DialogContent>
//             <DialogActions>
//                 <Button onClick={handleClose} disabled={isSubmitting}>Cancel</Button>
//                 <Button onClick={handleSubmit} variant="contained" disabled={isSubmitting || loading || selectedUserIds.size === 0}>
//                     {isSubmitting ? 'Adding...' : 'Add Selected Members'}
//                 </Button>
//             </DialogActions>
//         </Dialog>
//     );
// };
// export default AddMemberToProjectModal;





import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  List, ListItem, ListItemIcon, Checkbox, ListItemText, CircularProgress, Box, Typography, Divider, Grid
} from '@mui/material';
import type { Membership, Role } from '../types/project';

// This is the shape of the user data from our fast /api/employees endpoint
interface UserFromDB {
  id: number;
  name: string;
  role: string;
}

interface AddMemberToProjectModalProps {
    open: boolean;
    onClose: () => void;
    projectId: number;
    currentMembers: Membership[];
    onMembersAdded: (newMemberships: Membership[]) => void;
}

const AddMemberToProjectModal: React.FC<AddMemberToProjectModalProps> = ({ open, onClose, projectId, currentMembers, onMembersAdded }) => {
    const [allUsers, setAllUsers] = useState<UserFromDB[]>([]);
    const [allRoles, setAllRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedUserIds, setSelectedUserIds] = useState<Set<number>>(new Set());
    const [selectedRoleIds, setSelectedRoleIds] = useState<Set<number>>(new Set());
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (open) {
            setLoading(true);
            const usersPromise = axios.get('http://localhost:5000/api/employees');
            const rolesPromise = axios.get('http://localhost:5000/api/roles');
            
            Promise.all([usersPromise, rolesPromise])
                .then(([usersResponse, rolesResponse]) => {
                    const filteredRoles = rolesResponse.data.roles.filter((role: Role) => role.name.toLowerCase() !== 'alyssa client');
                    setAllUsers(usersResponse.data.users);
                    setAllRoles(filteredRoles);
                })
                .catch(err => console.error("Failed to load data for modal", err))
                .finally(() => setLoading(false));
        }
    }, [open]);
    
    const availableUsers = useMemo(() => {
        const currentMemberIds = new Set(currentMembers.map(m => m.user.id));
        return (allUsers || []).filter(user => !currentMemberIds.has(user.id));
    }, [allUsers, currentMembers]);

    const handleUserToggle = (userId: number) => {
        setSelectedUserIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(userId)) {
                newSet.delete(userId);
            } else {
                newSet.add(userId);
            }
            return newSet;
        });
    };

    const handleRoleToggle = (roleId: number) => {
      setSelectedRoleIds(prev => {
        const newSet = new Set(prev);
        if (newSet.has(roleId)) {
          newSet.delete(roleId);
        } else {
          newSet.add(roleId);
        }
        return newSet;
      });
    };

    const handleSubmit = async () => {
        if (selectedUserIds.size === 0) {
            alert('Please select at least one member to add.');
            return;
        }
        if (selectedRoleIds.size === 0) {
            alert('Please select at least one role.');
            return;
        }

        setIsSubmitting(true);
        
        const addMemberPromises = Array.from(selectedUserIds).map(userId => {
            const payload = { 
                user_id: userId, 
                role_ids: Array.from(selectedRoleIds) 
            };
            return axios.post(`http://localhost:5000/api/projects/${projectId}/members`, payload);
        });

        try {
            const responses = await Promise.all(addMemberPromises);
            const newMemberships = responses.map(res => res.data.membership);
            onMembersAdded(newMemberships);
            handleClose();
        } catch (error) {
            console.error('Failed to add members', error);
            alert('An error occurred while adding members.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setSelectedUserIds(new Set());
        setSelectedRoleIds(new Set());
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
            <DialogTitle>Add Members and Roles to Project</DialogTitle>
            <DialogContent dividers>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                        <CircularProgress />
                        <Typography sx={{ ml: 2 }}>Loading Employees and Roles...</Typography>
                    </Box>
                ) : (
                    <>
                        <Typography variant="h6" gutterBottom>Select Members</Typography>
                        <Box sx={{ maxHeight: 300, overflowY: 'auto' }}>
                            <List>
                                {availableUsers.map(user => (
                                    <ListItem key={user.id} disablePadding>
                                        <Button onClick={() => handleUserToggle(user.id)} sx={{ width: '100%', justifyContent: 'flex-start', textTransform: 'none' }}>
                                            <ListItemIcon>
                                                <Checkbox
                                                    edge="start"
                                                    checked={selectedUserIds.has(user.id)}
                                                    tabIndex={-1}
                                                    disableRipple
                                                />
                                            </ListItemIcon>
                                            <ListItemText primary={user.name} />
                                        </Button>
                                    </ListItem>
                                ))}
                            </List>
                        </Box>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="h6" gutterBottom>Select Roles</Typography>
                        <Grid container spacing={1}>
                            {allRoles.map(role => {
                                const labelId = `checkbox-list-label-role-${role.id}`;
                                return (
                                <Grid item xs={12} sm={6} md={4} key={role.id}>
                                    <ListItem disablePadding>
                                        <Button onClick={() => handleRoleToggle(role.id)} sx={{ width: '100%', justifyContent: 'flex-start', textTransform: 'none' }}>
                                            <ListItemIcon>
                                                <Checkbox
                                                    edge="start"
                                                    checked={selectedRoleIds.has(role.id)}
                                                    tabIndex={-1}
                                                    disableRipple
                                                    inputProps={{ 'aria-labelledby': labelId }}
                                                />
                                            </ListItemIcon>
                                            <ListItemText id={labelId} primary={role.name} />
                                        </Button>
                                    </ListItem>
                                </Grid>
                                );
                            })}
                        </Grid>
                    </>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} disabled={isSubmitting}>Cancel</Button>
                <Button onClick={handleSubmit} variant="contained" disabled={isSubmitting || loading || selectedUserIds.size === 0 || selectedRoleIds.size === 0}>
                    {isSubmitting ? 'Adding...' : 'Add Selected Members'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
export default AddMemberToProjectModal;