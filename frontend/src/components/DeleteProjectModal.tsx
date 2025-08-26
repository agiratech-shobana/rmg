// // frontend/src/components/DeleteProjectModal.tsx
// import React, { useState } from 'react';
// import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, Typography, CircularProgress, Alert } from '@mui/material';
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
//         } catch (err: any) {
//             console.error('Failed to delete project:', err.response?.data || err);
//             setError(err.response?.data?.message || 'An error occurred during deletion.');
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
//                 <Typography variant="subtitle2" sx={{ mb: 2 }}>
//                     Project Identifier: **{project?.identifier}**
//                 </Typography>
//                 <TextField
//                     fullWidth
//                     label="Enter Project Identifier"
//                     variant="outlined"
//                     value={identifierInput}
//                     onChange={(e) => setIdentifierInput(e.target.value)}
//                     disabled={loading}
//                     error={Boolean(error)}
//                     helperText={error}
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
import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, Typography, CircularProgress, Alert } from '@mui/material';
import axios from 'axios';
import type { ProjectSummary } from '../types/project';

interface DeleteProjectModalProps {
    open: boolean;
    onClose: () => void;
    project: ProjectSummary | null;
    onProjectDeleted: (projectId: number) => void;
}

const DeleteProjectModal: React.FC<DeleteProjectModalProps> = ({ open, onClose, project, onProjectDeleted }) => {
    const [identifierInput, setIdentifierInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleConfirm = async () => {
        if (!project || !identifierInput) {
            setError('Please enter the project identifier.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await axios.delete(`http://localhost:5000/api/projects/${project.id}`, {
                data: { identifier: identifierInput }
            });
            alert('Project deleted successfully!');
            onProjectDeleted(project.id);
        } catch (err: any) {
            console.error('Failed to delete project:', err.response?.data || err);
            setError(err.response?.data?.message || 'An error occurred during deletion.');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setIdentifierInput('');
        setError(null);
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>Confirm Project Deletion</DialogTitle>
            <DialogContent>
                <Typography variant="body1" sx={{ mb: 2 }}>
                    To confirm deletion of the project **{project?.name}**, please type its unique identifier below.
                </Typography>
                {/* FIX: Use a regular Typography to display the identifier clearly */}
                <Typography variant="subtitle2" sx={{ mb: 2 }}>
                    Project Identifier: <Box component="span" fontWeight="bold">{project?.identifier}</Box>
                </Typography>
                <TextField
                    fullWidth
                    label="Enter Project Identifier"
                    variant="outlined"
                    value={identifierInput}
                    onChange={(e) => {
                        setIdentifierInput(e.target.value);
                        // FIX: Added console.log to debug value not being stored
                        console.log("Input value:", e.target.value);
                    }}
                    disabled={loading}
                    error={Boolean(error)}
                    helperText={error}
                    // FIX: Ensure the type is text to prevent masking
                    type="text"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} disabled={loading}>Cancel</Button>
                <Button onClick={handleConfirm} color="error" variant="contained" disabled={loading || !identifierInput}>
                    {loading ? <CircularProgress size={24} /> : 'Delete Project'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteProjectModal;
