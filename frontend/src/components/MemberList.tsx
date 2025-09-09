


import React, { useState } from 'react';
import { Box, Typography, Button, Paper, List, ListItem, ListItemText, ListItemAvatar, Avatar, IconButton, CircularProgress, Snackbar, Alert } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
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
type SnackbarSeverity = 'info' | 'success' | 'error' | 'warning';
const [snackbarState, setSnackbarState] = useState({
    open: false,
    message: '',
    severity: 'info' as SnackbarSeverity,
    isConfirmation: false,
    actionId: null as number | null,
});

    // Function to show any type of Snackbar
const showSnackbar = (message: string, severity: 'info' | 'success' | 'error' | 'warning', isConfirmation = false, actionId: number | null = null) => {
    setSnackbarState({
    open: true,
    message,
    severity,
    isConfirmation,
    actionId,
});
    };

    // This function shows the confirmation Snackbar
const handleConfirmation = (membershipId: number, memberName: string) => {
    showSnackbar(
        `Are you sure you want to remove ${memberName}?`,
        'warning',
        true,
        membershipId
        );
    };

const handleSnackbarClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway' && snackbarState.isConfirmation) {
        return;
    }
        setSnackbarState(prevState => ({ ...prevState, open: false }));
    };

    // This function handles the actual deletion
    const handleFinalDelete = async () => {
    if (snackbarState.actionId === null) return;
        
        // Hide the confirmation snackbar
    setSnackbarState(prevState => ({ ...prevState, open: false }));
    setDeletingId(snackbarState.actionId); // Show the loading spinner

        try {
            await axios.delete(`http://localhost:5000/api/projects/${projectId}/memberships/${snackbarState.actionId}`);

            onMemberDeleted(snackbarState.actionId);
            
            // Show a success snackbar instead of an alert
            showSnackbar('Member removed successfully!', 'success');

        } 
        // catch (error: any) {
        //     console.error('Failed to delete member:', error.response?.data || error);
        //     // Show an error snackbar instead of an alert
        //     showSnackbar('An error occurred while removing the member.', 'error');
        // } 
        catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Failed to delete member:', error.response?.data || error.message);
            } else {
                console.error('An unexpected error occurred:', error);
            }
            // Show an error snackbar instead of an alert
            showSnackbar('An error occurred while removing the member.', 'error');
        }
        
        finally {
            setDeletingId(null);
            setSnackbarState(prevState => ({ ...prevState, actionId: null }));
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
               <ListItem key={member.id} divider secondaryAction={
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        {deletingId === member.id ? (
                        <CircularProgress size={24} sx={{ ml: 1.5 }} />
                            ) : (
                        <IconButton edge="end" aria-label="delete" onClick={() => handleConfirmation(member.id, member.user.name)} disabled={deletingId !== null}>
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
            
            {/* The single, consolidated Snackbar */}
            <Snackbar
                open={snackbarState.open}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                {snackbarState.isConfirmation ? (
                    <Alert
                        onClose={handleSnackbarClose}
                        severity={snackbarState.severity } // Cast needed for MUI type
                        variant="filled"
                        action={
                            <>
                                <Button color="inherit" size="small" onClick={handleFinalDelete} sx={{fontWeight: 'bold'}}>
                                    Confirm
                                </Button>
                                <Button color="inherit" size="small" onClick={handleSnackbarClose}>
                                    Cancel
                                </Button>
                            </>
                        }
                    >
                        {snackbarState.message}
                    </Alert>
                ) : (
                    <Alert
                        onClose={handleSnackbarClose}
                        severity={snackbarState.severity }
                        variant="filled"
                        sx={{ width: '100%' }}
                    >
                        {snackbarState.message}
                    </Alert>
                )}
            </Snackbar>
        </Paper>
    );  
};

export default MemberList;