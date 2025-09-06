// import React, { useState, useEffect } from 'react';
// import { Box, Typography, Paper, CircularProgress, Alert } from '@mui/material';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
// import axios from 'axios';

// interface SkillData {
//     name: string;
//     employeeCount: number;
// }

// const SkillDashboard: React.FC = () => {
//     const [skillData, setSkillData] = useState<SkillData[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);

//     const fetchSkillData = async () => {
//         try {
//             setLoading(true);
//             const response = await axios.get('http://localhost:5000/api/skills/employee-count');
//             setSkillData(response.data);
//             setLoading(false);
//         } catch (err) {
//             console.error('Failed to fetch skill data:', err);
//             setError('Failed to load skill data. Please check the backend.');
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchSkillData();
//     }, []);

//     if (loading) {
//         return (
//             <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
//                 <CircularProgress />
//             </Box>
//         );
//     }

//     if (error) {
//         return (
//             <Box sx={{ mt: 4 }}>
//                 <Alert severity="error">{error}</Alert>
//             </Box>
//         );
//     }

//     return (
//         <Box sx={{ p: 4, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
//             <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
//                 <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.dark' }}>
//                     Employee Count by Skill
//                 </Typography>
//                 <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
//                     A dynamic overview of your team's skills.
//                 </Typography>
//                 <Box sx={{ width: '100%', height: 400 }}>
//                     {skillData.length > 0 ? (
//                         <ResponsiveContainer>
//                             <BarChart
//                                 data={skillData}
//                                 margin={{
//                                     top: 5,
//                                     right: 30,
//                                     left: 20,
//                                     bottom: 5,
//                                 }}
//                             >
//                                 <CartesianGrid strokeDasharray="3 3" />
//                                 <XAxis dataKey="name" />
//                                 <YAxis />
//                                 <Tooltip />
//                                 <Bar dataKey="employeeCount" fill="#1976d2" />
//                             </BarChart>
//                         </ResponsiveContainer>
//                     ) : (
//                         <Typography variant="body1" color="text.secondary" sx={{ p: 4 }}>
//                             No skill data available to display.
//                         </Typography>
//                     )}
//                 </Box>
//             </Paper>
//         </Box>
//     );
// };

// export default SkillDashboard;


// import React, { useState, useEffect } from "react";
// import { Box, Typography, Paper, CircularProgress, Alert } from "@mui/material";
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
// import axios from "axios";

// interface SkillData {
//     name: string;
//     employeeCount: number;
// }

// const SkillDashboard: React.FC = () => {
// const [skillData, setSkillData] = useState<SkillData[]>([]);
// const [loading, setLoading] = useState(true);
// const [error, setError] = useState<string | null>(null);

// const fetchSkillData = async () => {
//  try {
//         setLoading(true);
//         const response = await axios.get('http://localhost:5000/api/skills/employee-count');
//         setSkillData(response.data);
//         setLoading(false);
//     } catch (err) {
//         console.error('Failed to fetch skill data:', err);
//         setError('Failed to load skill data. Please check the backend.');
//         setLoading(false);
//     }
// };

// useEffect(() => {
//     fetchSkillData();
// }, []);

//    if (loading) {
//     return (
//         <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, width: '100%' }}>
//         <CircularProgress />
//         </Box>
//     );
//    } 

//     if (error) {
//     return (
//         <Box sx={{ mt: 4, p: 4, width: '100%' }}>
//         <Alert severity="error">{error}</Alert>
//         </Box>
//     );
//    }

// return (
//     <Box sx={{ p: 4, width: '150vh', height: '70vh', display: 'flex', flexDirection: 'column' }}>
//     <Paper elevation={4} sx={{ p: 4, borderRadius: 2, flexGrow: 2 }}>
//     <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.dark' }}>
//     Employee Count by Skill
//     </Typography>
//     <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
//     A dynamic overview of your team's skills.
//     </Typography>
//     <Box sx={{ width: '100%', height: '60vh' }}>
//       {skillData.length > 0 ? (
//       <ResponsiveContainer>
//         <BarChart
//         data={skillData}
//         margin={{top: 5,right: 30,left: 20,bottom: 5,}}
//         barSize={40} >
//         <defs>
//             <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
//             <stop offset="5%" stopColor="#1976d2" stopOpacity={0.8} />
//             <stop offset="95%" stopColor="#1976d2" stopOpacity={0.3} />
//             </linearGradient>
//         </defs>
//         <CartesianGrid strokeDasharray="3 3" />
//         <XAxis dataKey="name" />
//         <YAxis />
//         <Tooltip />
//         <Bar dataKey="employeeCount" fill="url(#colorUv)" radius={[10, 10, 0, 0]} />
//         </BarChart>
//             </ResponsiveContainer>
//             ) : (
//                 <Typography variant="body1" color="text.secondary" sx={{ p: 4 }}>
//                     No skill data available to display.
//                 </Typography>
//                )}
//         </Box>
//     </Paper>
// </Box>
//     );
// };

// export default SkillDashboard;



import React, { useState, useEffect } from "react";
import { 
    Box, 
    Typography, 
    Paper, 
    CircularProgress, 
    Alert,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Snackbar
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import axios from "axios";

interface SkillData {
    name: string;
    employeeCount: number;
}

const SkillDashboard: React.FC = () => {
    const [skillData, setSkillData] = useState<SkillData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // New state for the add skill dialog
    const [addSkillOpen, setAddSkillOpen] = useState(false);
    const [newSkillName, setNewSkillName] = useState('');
    const [submitting, setSubmitting] = useState(false);

    // New state for Snackbar
    // const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    type SnackbarSeverity = 'success' | 'error' | 'warning' | 'info';
const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: SnackbarSeverity }>({
    open: false,
    message: '',
    severity: 'success',
})

    const fetchSkillData = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:5000/api/skills/employee-count');
            setSkillData(response.data);
            setLoading(false);
        } catch (err) {
            console.error('Failed to fetch skill data:', err);
            setError('Failed to load skill data. Please check the backend.');
            setLoading(false);
        }
    };

    const handleAddSkill = async () => {
        if (!newSkillName.trim()) {
            setSnackbar({ open: true, message: 'Skill name cannot be empty.', severity: 'warning' });
            return;
        }
        setSubmitting(true);
        try {
            // FIX: The backend route must be handled by you. We are creating it now.
            const response = await axios.post('http://localhost:5000/api/skills', { name: newSkillName.trim() });
            setSnackbar({ open: true, message: response.data.message, severity: 'success' });
            setAddSkillOpen(false); // Close the dialog
            setNewSkillName(''); // Clear the input
            fetchSkillData(); // Refresh the data to show the new skill
        } 
        // catch (err: any) {
        //     console.error('Failed to add skill:', err.response?.data?.error || err.message);
        //     setSnackbar({ open: true, message: err.response?.data?.error || 'Failed to add skill.', severity: 'error' });
        // } 
        catch (err: unknown) {
    const message = axios.isAxiosError(err)
        ? err.response?.data?.error || err.message
        : err instanceof Error
        ? err.message
        : String(err);

    console.error('Failed to add skill:', message);
    setSnackbar({ open: true, message, severity: 'error' });
}

        finally {
            setSubmitting(false);
        }
    };

    const handleSnackbarClose = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    useEffect(() => {
        fetchSkillData();
    }, []);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, width: '100%' }}>
                <CircularProgress />
            </Box>
        );
    } 

    if (error) {
        return (
            <Box sx={{ mt: 4, p: 4, width: '100%' }}>
                <Alert severity="error">{error}</Alert>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 4, width: '150vh', height: '70vh', display: 'flex', flexDirection: 'column' }}>
            <Paper elevation={4} sx={{ p: 4, borderRadius: 2, flexGrow: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                    <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.dark', mb: 0 }}>
                        Employee Count by Skill
                    </Typography>
                    <Button 
                        variant="contained" 
                        startIcon={<AddIcon />}
                        onClick={() => setAddSkillOpen(true)}
                    >
                        Add Skill
                    </Button>
                </Box>
                <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
                    A dynamic overview of your team's skills.
                </Typography>
                <Box sx={{ width: '100%', height: '60vh' }}>
                    {skillData.length > 0 ? (
                        <ResponsiveContainer>
                            <BarChart
                                data={skillData}
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                barSize={40}
                            >
                                <defs>
                                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#1976d2" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#1976d2" stopOpacity={0.3} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="employeeCount" fill="url(#colorUv)" radius={[10, 10, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <Typography variant="body1" color="text.secondary" sx={{ p: 4 }}>
                            No skill data available to display.
                        </Typography>
                    )}
                </Box>
            </Paper>

            {/* Dialog for adding a new skill */}
            <Dialog open={addSkillOpen} onClose={() => setAddSkillOpen(false)}>
                <DialogTitle>Add New Skill</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Skill Name"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={newSkillName}
                        onChange={(e) => setNewSkillName(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setAddSkillOpen(false)} disabled={submitting}>
                        Cancel
                    </Button>
                    <Button onClick={handleAddSkill} disabled={submitting}>
                        {submitting ? <CircularProgress size={24} /> : 'Add'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar for feedback */}
            <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity={snackbar.severity } sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default SkillDashboard;