

import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  List, ListItem, ListItemIcon, Checkbox, ListItemText, CircularProgress, Box, Typography, Divider, Snackbar, Alert,TextField
} from '@mui/material';
import Grid from '@mui/material/Grid';
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
     const [searchTerm, setSearchTerm] = useState(""); // 🔍 Search input state
    // State for confirmation dialog
    const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState(false);
    
    // State for Snackbar notifications
    const [snackbarState, setSnackbarState] = useState({
        open: false,
        message: '',
        severity: 'info' as 'info' | 'success' | 'error' | 'warning',
    });

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

      const filteredUsers = useMemo(() => {
    return availableUsers.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [availableUsers, searchTerm]);


    





    // Get the names of selected users for the confirmation message
    const selectedUserNames = useMemo(() => {
        return availableUsers
            .filter(user => selectedUserIds.has(user.id))
            .map(user => user.name)
            .join(', ');
    }, [selectedUserIds, availableUsers]);

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

    // New function to handle initial submission and show confirmation dialog
    const handleConfirmSubmit = () => {
        if (selectedUserIds.size === 0) {
            setSnackbarState({ open: true, message: 'Please select at least one member to add.', severity: 'warning' });
            return;
        }
        if (selectedRoleIds.size === 0) {
            setSnackbarState({ open: true, message: 'Please select at least one role.', severity: 'warning' });
            return;
        }
        setIsConfirmationDialogOpen(true);
    };

    // The function that performs the actual API call
    const handleFinalSubmit = async () => {
        setIsConfirmationDialogOpen(false); // Close the confirmation dialog
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
            setSnackbarState({ open: true, message: 'Members added successfully!', severity: 'success' });
        } catch (error) {
            console.error('Failed to add members', error);
            setSnackbarState({ open: true, message: 'An error occurred while adding members.', severity: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setSelectedUserIds(new Set());
        setSelectedRoleIds(new Set());
         setSearchTerm("");
        onClose();
    };

    const handleSnackbarClose = () => {
        setSnackbarState({ ...snackbarState, open: false });
    };

    return (
        <>
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
                               <TextField
                label="Search by name"
                variant="outlined"
                size="small"
                fullWidth
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ mb: 2 }}
              />
                            <Box sx={{ maxHeight: 300, overflowY: 'auto' }}>
                                <List>
                                    {filteredUsers.map(user => (
                                        // FIX 1: Use secondaryAction for the checkbox
                                        <ListItem 
                                            key={user.id} 
                                            onClick={() => handleUserToggle(user.id)}
                                            secondaryAction={
                                                <Checkbox
                                                    edge="end"
                                                    checked={selectedUserIds.has(user.id)}
                                                    tabIndex={-1}
                                                    disableRipple
                                                />
                                            }
                                        >
                                            <ListItemText primary={user.name} />
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
                    {/* FIX 2: Call the confirmation handler instead of the submit handler */}
                    <Button onClick={handleConfirmSubmit} variant="contained" disabled={isSubmitting || loading || selectedUserIds.size === 0 || selectedRoleIds.size === 0}>
                        {isSubmitting ? 'Adding...' : 'Add Selected Members'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* FIX 3: Add a new Dialog for confirmation */}
            <Dialog open={isConfirmationDialogOpen} onClose={() => setIsConfirmationDialogOpen(false)}>
                <DialogTitle>Confirm Member Addition</DialogTitle>
                <DialogContent dividers>
                    <Typography gutterBottom>
                        Are you sure you want to add the following members and roles to this project?
                    </Typography>
                    <Typography variant="subtitle1" sx={{ mt: 2, fontWeight: 'bold' }}>
                        Members:
                    </Typography>
                    <Typography>{selectedUserNames}</Typography>
                    <Typography variant="subtitle1" sx={{ mt: 2, fontWeight: 'bold' }}>
                        Roles:
                    </Typography>
                    <Typography>{Array.from(selectedRoleIds).map(id => allRoles.find(r => r.id === id)?.name).join(', ')}</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsConfirmationDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleFinalSubmit} variant="contained" disabled={isSubmitting}>
                        Confirm Add
                    </Button>
                </DialogActions>
            </Dialog>
            
            {/* FIX 4: Add a Snackbar for user feedback */}
            <Snackbar
                open={snackbarState.open}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbarState.severity} sx={{ width: '100%',padding: 2, borderRadius: 2 }}>
                    {snackbarState.message}
                </Alert>
            </Snackbar>
        </>
    );
};

export default AddMemberToProjectModal;