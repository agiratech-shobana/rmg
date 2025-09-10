



// frontend/src/components/AddMembersModal.tsx
import React, { useState, useEffect, useMemo } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  List, ListItem, ListItemIcon, Checkbox, ListItemText, CircularProgress, Box, Typography, Divider, Grid, Snackbar, Alert, TextField
} from '@mui/material';
import axios from 'axios';
import type { User, Role,ProjectFormData} from '../types/project';

interface AddMembersModalProps {
  open: boolean;
  onClose: () => void;
  projectData: ProjectFormData |null;
}

const AddMembersModal: React.FC<AddMembersModalProps> = ({ open, onClose, projectData }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<Set<number>>(new Set());
  const [selectedRoleIds, setSelectedRoleIds] = useState<Set<number>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [userSearch, setUserSearch] = useState("");
  
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
      setFetchLoading(true);
      Promise.all([
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/users`), 
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/roles`)
      ])
      .then(([usersResponse, rolesResponse]) => {
        setUsers(Array.isArray(usersResponse.data) ? usersResponse.data : usersResponse.data.users);
        
        const filteredRoles = (Array.isArray(rolesResponse.data) ? rolesResponse.data : rolesResponse.data.roles)
          .filter((role: Role) => role.name.toLowerCase() !== 'alyssa client');
        
        setRoles(filteredRoles);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setSnackbarState({ open: true, message: 'Could not load employee and role lists.', severity: 'error' });
      })
      .finally(() => {
        setFetchLoading(false);
      });
    }
  }, [open]);

  // Memoize filtered users for performance
  const filteredUsers = useMemo(() => {
    return users.filter(user =>
      user.name.toLowerCase().includes(userSearch.toLowerCase())
    );
  }, [users, userSearch]);

  // Memoize selected names for the confirmation dialog
  const selectedUserNames = useMemo(() => {
      return users
          .filter(user => selectedUserIds.has(user.id))
          .map(user => user.name)
          .join(', ');
  }, [selectedUserIds, users]);

  const selectedRoleNames = useMemo(() => {
      return roles
          .filter(role => selectedRoleIds.has(role.id))
          .map(role => role.name)
          .join(', ');
  }, [selectedRoleIds, roles]);


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

  // Step 1: Validate and open confirmation dialog
  const handleConfirmSubmit = () => {
    if (selectedUserIds.size === 0) {
      setSnackbarState({ open: true, message: 'Please select at least one member.', severity: 'warning' });
      return;
    }
    if (selectedRoleIds.size === 0) {
      setSnackbarState({ open: true, message: 'Please select at least one role.', severity: 'warning' });
      return;
    }
    setIsConfirmationDialogOpen(true);
  };

  // Step 2: Final submission after user confirms
  const handleFinalSubmit = async () => {
    setIsConfirmationDialogOpen(false);
    if (!projectData) {
      setSnackbarState({ open: true, message: 'Project data is missing. Please go back and try again.', severity: 'error' });
      return;
    }
    
    setIsSubmitting(true);
    
    const payload = {
      project: {
        name: projectData.projectName,
        identifier: projectData.identifier,
        description: projectData.description,
        status: 1,
        is_public: false,
        inherit_members: false,
        custom_fields: [
          { id: 48, value: projectData.accountName },
          { id: 37, value: projectData.projectCode },
          { id: 42, value: projectData.projectType },
          { id: 47, value: projectData.projectMode },
          { id: 38, value: projectData.startDate },
          { id: 39, value: projectData.endDate },
          { id: 40, value: (projectData.techStack || []).join(',') },
          { id: 52, value: projectData.proposalProject || '' },
        ],
      },
      members: Array.from(selectedUserIds).map(userId => ({
        user_id: userId,
        role_ids: Array.from(selectedRoleIds),
      }))
    };

    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/projects`, payload);
      setSnackbarState({ open: true, message: 'Project and members added successfully!', severity: 'success' });
      handleClose(); // Close all modals and trigger re-fetch
    }
    //  catch (err: any) {
    //   console.error('Error in two-step project creation:', err.response?.data?.errors || err);
    //   const errorMessage = err.response?.data?.message || 'Failed to add project and members.';
    //   setSnackbarState({ open: true, message: errorMessage, severity: 'error' });
    // } 
    catch (err: unknown) {
  if (axios.isAxiosError(err)) {
    console.error('Error in two-step project creation:', err.response?.data?.errors || err);
    const errorMessage = err.response?.data?.message || 'Failed to add project and members.';
    setSnackbarState({ open: true, message: errorMessage, severity: 'error' });
  } else {
    console.error('Unexpected error:', err);
    setSnackbarState({ open: true, message: 'Unexpected error occurred.', severity: 'error' });
  }
}
    finally {
      setIsSubmitting(false);
    }
  };

  // const handleClose = (isSuccess: boolean = false) => {
  const handleClose = () => {
    setSelectedUserIds(new Set());
    setSelectedRoleIds(new Set());
    setUserSearch("");
    // The `onClose` from props likely closes both modals.
    // If it only closes one, you might need a more complex state management solution.
    onClose();
  };
  
  const handleSnackbarClose = () => {
      setSnackbarState({ ...snackbarState, open: false });
  };

  return (
    <>
      <Dialog open={open} onClose={() => handleClose()} fullWidth maxWidth="md">
        <DialogTitle>Add Members and Roles to New Project</DialogTitle>
        <DialogContent dividers>
          {fetchLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
              <Typography sx={{ ml: 2 }}>Loading Employees and Roles...</Typography>
            </Box>
          ) : (
            <>
              <Typography variant="h6" gutterBottom>Select Members</Typography>
              <TextField
                fullWidth
                variant="outlined"
                label="Search members by name"
                size="small"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                sx={{ mb: 2 }}
              />
              <Box sx={{ maxHeight: 300, overflowY: 'auto', border: '1px solid #ddd', borderRadius: 1 }}>
                <List dense>
                  {filteredUsers.map((user: User) => (
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
                      sx={{ cursor: 'pointer' }}
                    >
                      <ListItemText primary={user.name} />
                    </ListItem>
                  ))}
                </List>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>Select Roles for All New Members</Typography>
              <Grid container spacing={1}>
                {roles.map((role: Role) => {
                  const labelId = `checkbox-list-label-role-${role.id}`;
                  return (
                    <Grid size={2.5} key={role.id}>
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
          <Button onClick={() => handleClose()} disabled={isSubmitting}>Cancel</Button>
          <Button onClick={handleConfirmSubmit} disabled={isSubmitting || fetchLoading || selectedUserIds.size === 0 || selectedRoleIds.size === 0} variant="contained">
            {isSubmitting ? 'Creating...' : 'Create Project'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={isConfirmationDialogOpen} onClose={() => setIsConfirmationDialogOpen(false)}>
          <DialogTitle>Confirm Project Creation</DialogTitle>
          <DialogContent dividers>
              <Typography gutterBottom>
                  You are about to create the project "<strong>{projectData?.projectName}</strong>" with the following members and roles.
              </Typography>
              <Typography variant="subtitle1" sx={{ mt: 2, fontWeight: 'bold' }}>
                  Members:
              </Typography>
              <Typography>{selectedUserNames || 'None selected'}</Typography>
              <Typography variant="subtitle1" sx={{ mt: 2, fontWeight: 'bold' }}>
                  Roles to be Assigned:
              </Typography>
              <Typography>{selectedRoleNames || 'None selected'}</Typography>
          </DialogContent>
          <DialogActions>
              <Button onClick={() => setIsConfirmationDialogOpen(false)} disabled={isSubmitting}>Cancel</Button>
              <Button onClick={handleFinalSubmit} variant="contained" disabled={isSubmitting}>
                  Confirm & Create
              </Button>
          </DialogActions>
      </Dialog>
      
      {/* Snackbar for User Feedback */}
      <Snackbar
          open={snackbarState.open}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
          <Alert onClose={handleSnackbarClose} severity={snackbarState.severity} sx={{ width: '100%', padding: 2, borderRadius: 2 }}>
              {snackbarState.message}
          </Alert>
      </Snackbar>
    </>
  );
};

export default AddMembersModal;