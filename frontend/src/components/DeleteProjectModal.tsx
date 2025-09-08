

// frontend/src/components/DeleteProjectModal.tsx
import React, { useState, useEffect } from 'react';
import { 
    Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, 
    Box, Typography, CircularProgress, 
} from '@mui/material';
import axios from 'axios';
import type { ProjectSummary } from '../types/project';

interface DeleteProjectModalProps {
    open: boolean;
    onClose: () => void;
    project: ProjectSummary | null;
    // This prop now triggers the success logic in the parent
    onProjectDeleted: (projectId: number) => void; 
}

// NOTE: We've removed the Snackbar state and logic from this component
const DeleteProjectModal: React.FC<DeleteProjectModalProps> = ({ open, onClose, project, onProjectDeleted }) => {
    const [identifierInput, setIdentifierInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null); // Keep local error for the text field helperText

    // Reset input when the project changes (e.g., opening modal for a new project)
    useEffect(() => {
        if (open) {
            setIdentifierInput('');
            setError(null);
        }
    }, [open, project]);

    const handleConfirm = async () => {
        if (!project || identifierInput !== project.identifier) {
            setError('The identifier does not match.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await axios.delete(`http://localhost:5000/api/projects/${project.id}`, {
                data: { identifier: identifierInput }
            });
            
            // 1. Tell the parent component it was successful.
            // The parent will handle the snackbar and data refresh.
            onProjectDeleted(project.id);
            
            // 2. Close the modal immediately. No timeout needed.
            onClose();

        } catch (err) {
            let errorMessage = 'An error occurred during deletion.';
            if (axios.isAxiosError(err) && err.response?.data?.message) {
                errorMessage = err.response.data.message;
            }
            console.error('Failed to delete project:', err);
            setError(errorMessage); // Show error in the text field helperText
        } finally {
            setLoading(false);
        }
    };
    
    return (
        // The Dialog component remains the same, but the Snackbar is gone
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ color: 'error.main', fontWeight: 'bold' }}>
                Are you sure you want to delete this project?
            </DialogTitle>
            <DialogContent>
                <Box sx={{ p: 2, border: 1, borderColor: 'error.light', borderRadius: 1, mb: 3, backgroundColor: 'rgba(211, 47, 47, 0.05)' }}>
                    <Typography variant="h6" component="p" color="error.dark" gutterBottom>
                       This action is irreversible.
                    </Typography>
                    <Typography variant="body2">
                        You are about to permanently delete the project{' '}
                        <strong>{project?.name}</strong>. All associated data will be lost.
                    </Typography>
                </Box>

                <Typography variant="body1" sx={{ mb: 2 }}>
                    To confirm, type the identifier:{' '}
                    <Box component="span" fontWeight="bold" sx={{ userSelect: 'all', color: 'primary.main' }}>
                        {project?.identifier}
                    </Box>
                </Typography>
                
                <TextField
                    autoFocus
                    fullWidth
                    label="Enter Project Identifier"
                    variant="outlined"
                    value={identifierInput}
                    onChange={(e) => {
                        setIdentifierInput(e.target.value);
                        if (error) setError(null); // Clear error on new input
                    }}
                    disabled={loading}
                    error={Boolean(error)}
                    helperText={error}
                />
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button onClick={onClose} disabled={loading} variant="outlined">Cancel</Button>
                <Button 
                    onClick={handleConfirm} 
                    color="error" 
                    variant="contained" 
                    disabled={loading || identifierInput !== project?.identifier}
                >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Permanently Delete'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteProjectModal;