


// // frontend/src/components/DeleteProjectModal.tsx
// import React, { useState } from 'react';
// import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, Typography, CircularProgress } from '@mui/material';
// import axios from 'axios';
// import type { ProjectSummary } from '../types/project';

// interface DeleteProjectModalProps {
//     open: boolean;
//     onClose: () => void;
//     project: ProjectSummary | null;
//     onProjectDeleted: (projectId: number) => void;
// }

// const DeleteProjectModal: React.FC<DeleteProjectModalProps> = ({ open, onClose, project, onProjectDeleted }) => {
//     const [identifierInput, setIdentifierInput] = useState('');
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState<string | null>(null);

//     const handleConfirm = async () => {
//         if (!project || !identifierInput) {
//             setError('Please enter the project identifier.');
//             return;
//         }

//         setLoading(true);
//         setError(null);

//         try {
//             await axios.delete(`http://localhost:5000/api/projects/${project.id}`, {
//                 data: { identifier: identifierInput }
//             });
//             alert('Project deleted successfully!');
//             onProjectDeleted(project.id);
//         } catch (error) {
//             // console.error('Failed to delete project:', err.response?.data || err);
//             // setError(err.response?.data?.message || 'An error occurred during deletion.');
//              if (axios.isAxiosError(error)) {
//             console.error('Failed to delete project:', error.response?.data || error.message);
//             setError(error.response?.data?.message || 'An error occurred during deletion.');
//         } else {
//             console.error('Unexpected error:', error);
//             setError('An unexpected error occurred.');
//         }
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleClose = () => {
//         setIdentifierInput('');
//         setError(null);
//         onClose();
//     };

//     return (
//         <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
//             <DialogTitle>Confirm Project Deletion</DialogTitle>
//             <DialogContent>
//                 <Typography variant="body1" sx={{ mb: 2 }}>
//                     To confirm deletion of the project **{project?.name}**, please type its unique identifier below.
//                 </Typography>
//                 {/* FIX: Use a regular Typography to display the identifier clearly */}
//                 <Typography variant="subtitle2" sx={{ mb: 2 }}>
//                     Project Identifier: <Box component="span" fontWeight="bold">{project?.identifier}</Box>
//                 </Typography>
//                 <TextField
//                     fullWidth
//                     label="Enter Project Identifier"
//                     variant="outlined"
//                     value={identifierInput}
//                     onChange={(e) => {
//                         setIdentifierInput(e.target.value);
//                         // FIX: Added console.log to debug value not being stored
//                         console.log("Input value:", e.target.value);
//                     }}
//                     disabled={loading}
//                     error={Boolean(error)}
//                     helperText={error}
//                     // FIX: Ensure the type is text to prevent masking
//                     type="text"
//                 />
//             </DialogContent>
//             <DialogActions>
//                 <Button onClick={handleClose} disabled={loading}>Cancel</Button>
//                 <Button onClick={handleConfirm} color="error" variant="contained" disabled={loading || !identifierInput}>
//                     {loading ? <CircularProgress size={24} /> : 'Delete Project'}
//                 </Button>
//             </DialogActions>
//         </Dialog>
//     );
// };

// export default DeleteProjectModal;


// frontend/src/components/DeleteProjectModal.tsx
// import React, { useState } from 'react';
// import { 
//     Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, 
//     Box, Typography, CircularProgress, Snackbar, Alert 
// } from '@mui/material';
// import axios from 'axios';
// import type { ProjectSummary } from '../types/project';

// interface DeleteProjectModalProps {
//     open: boolean;
//     onClose: () => void;
//     project: ProjectSummary | null;
//     onProjectDeleted: (projectId: number) => void;
// }

// const DeleteProjectModal: React.FC<DeleteProjectModalProps> = ({ open, onClose, project, onProjectDeleted }) => {
//     const [identifierInput, setIdentifierInput] = useState('');
//     const [loading, setLoading] = useState(false);
    
//     // State for Snackbar notifications
//     const [snackbarState, setSnackbarState] = useState({
//         open: false,
//         message: '',
//         severity: 'info' as 'info' | 'success' | 'error' | 'warning',
//     });

//     const handleConfirm = async () => {
//         if (!project) return; // Should not happen if modal is open

//         // Validation check
//         if (identifierInput !== project.identifier) {
//             setSnackbarState({ open: true, message: 'The identifier does not match. Please try again.', severity: 'error' });
//             return;
//         }

//         setLoading(true);

//         try {
//             await axios.delete(`http://localhost:5000/api/projects/${project.id}`, {
//                 // The identifier is sent in the body for backend validation
//                 data: { identifier: identifierInput }
//             });
            
//             // Show success message
//             setSnackbarState({ open: true, message: 'Project deleted successfully!', severity: 'success' });
            
//             // Notify parent component and close the modal
//             onProjectDeleted(project.id);
//             handleClose();

//         } catch (error) {
//             let errorMessage = 'An unexpected error occurred during deletion.';
//             if (axios.isAxiosError(error) && error.response?.data?.message) {
//                 errorMessage = error.response.data.message;
//             }
//             console.error('Failed to delete project:', error);
//             setSnackbarState({ open: true, message: errorMessage, severity: 'error' });
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleClose = () => {
//         setIdentifierInput('');
//         onClose(); // Call the parent's onClose handler
//     };

//     const handleSnackbarClose = () => {
//         setSnackbarState({ ...snackbarState, open: false });
//     };

//     return (
//         <>
//             <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
//                 <DialogTitle sx={{ color: 'error.main', fontWeight: 'bold' }}>
//                     Are you sure you want to delete this project?
//                 </DialogTitle>
//                 <DialogContent>
//                     {/* Explicit warning box for better confirmation */}
//                     <Box sx={{ p: 2, border: 1, borderColor: 'error.light', borderRadius: 1, mb: 3, backgroundColor: 'rgba(211, 47, 47, 0.05)' }}>
//                         <Typography variant="h6" component="p" color="error.dark" gutterBottom>
//                            This action is irreversible.
//                         </Typography>
//                         <Typography variant="body2">
//                             You are about to permanently delete the project{' '}
//                             <strong>{project?.name}</strong>. All associated data, including tasks and memberships, will be lost forever.
//                         </Typography>
//                     </Box>

//                     <Typography variant="body1" sx={{ mb: 1 }}>
//                         To confirm, please type the project's unique identifier:
//                     </Typography>
                    
//                     <Typography variant="subtitle1" sx={{ mb: 2 }}>
//                         Identifier: <Box component="span" fontWeight="bold" sx={{ userSelect: 'all', color: 'primary.main' }}>{project?.identifier}</Box>
//                     </Typography>
                    
//                     <TextField
//                         autoFocus
//                         fullWidth
//                         label="Enter Project Identifier"
//                         variant="outlined"
//                         value={identifierInput}
//                         onChange={(e) => setIdentifierInput(e.target.value)}
//                         disabled={loading}
//                         placeholder={project?.identifier}
//                     />
//                 </DialogContent>
//                 <DialogActions sx={{ px: 3, pb: 2 }}>
//                     <Button onClick={handleClose} disabled={loading} variant="outlined">Cancel</Button>
//                     <Button 
//                         onClick={handleConfirm} 
//                         color="error" 
//                         variant="contained" 
//                         disabled={loading || identifierInput !== project?.identifier}
//                     >
//                         {loading ? <CircularProgress size={24} color="inherit" /> : 'Permanently Delete'}
//                     </Button>
//                 </DialogActions>
//             </Dialog>

//             {/* Snackbar for all user feedback */}
//             <Snackbar
//                 open={snackbarState.open}
//                 autoHideDuration={6000}
//                 onClose={handleSnackbarClose}
//                 anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
//             >
//                 <Alert onClose={handleSnackbarClose} severity={snackbarState.severity} sx={{ width: '100%' }} variant="filled">
//                     {snackbarState.message}
//                 </Alert>
//             </Snackbar>
//         </>
//     );
// };

// export default DeleteProjectModal;


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