

  
// import React, { useState, useEffect } from 'react';
// import {
//   Dialog, DialogTitle, DialogContent, DialogActions, Button,
//   List, ListItem, ListItemIcon, Checkbox, ListItemText, CircularProgress, Box, Typography
// } from '@mui/material';
// import axios from 'axios';

// interface AddMembersModalProps {
//   open: boolean;
//   onClose: () => void;
//   projectData: any;
//   onProjectAdded: () => void;
// }

// interface UserWithRole {
//   id: number;
//   name: string;
//   role: string;
// }

// interface Role {
//   id: number;
//   name: string;
// }

// const AddMembersModal: React.FC<AddMembersModalProps> = ({ open, onClose, projectData, onProjectAdded }) => {
//   const [users, setUsers] = useState<UserWithRole[]>([]);
//   const [roles, setRoles] = useState<Role[]>([]);
//   const [selectedUserIds, setSelectedUserIds] = useState<Set<number>>(new Set());
//   const [loading, setLoading] = useState(false);
//   const [fetchLoading, setFetchLoading] = useState(true);

//   useEffect(() => {
//     if (open) {
//       setFetchLoading(true);
//       Promise.all([
//         // The only change needed is this URL
//         axios.get('http://localhost:5000/api/employees'),
//         axios.get('http://localhost:5000/api/roles')
//       ])
//         .then(([usersResponse, rolesResponse]) => {
//           setUsers(usersResponse.data.users);
//           setRoles(rolesResponse.data.roles);
//         })
//         .catch(error => {
//           console.error('Error fetching data:', error);
//           alert('Could not load employee list.');
//         })
//         .finally(() => {
//           setFetchLoading(false);
//         });
//     }
//   }, [open]);

//   const handleToggle = (userId: number) => {
//     setSelectedUserIds(prev => {
//       const newSet = new Set(prev);
//       if (newSet.has(userId)) {
//         newSet.delete(userId);
//       } else {
//         newSet.add(userId);
//       }
//       return newSet;
//     });
//   };


//   const handleSubmit = async () => {
//     if (!projectData) {
//       alert('Project data is missing.');
//       return;
//     }
//     if (selectedUserIds.size === 0) {
//       alert('Please select at least one member.');
//       return;
//     }
//     setLoading(true);
    
//     const developerRole = roles.find(r => r.name.toLowerCase() === 'developer');
//     const defaultRoleId = developerRole ? developerRole.id : 4;

//     const newProjectPayload = {
//       project: {
//         name: projectData.name,
//         identifier: projectData.identifier,
//         description: projectData.description,
//         status: 1,
//         is_public: false,
//         inherit_members: false,
//         custom_fields: [
//           { id: 37, value: projectData.projectCode },
//           { id: 38, value: projectData.startDate },
//           { id: 39, value: projectData.endDate },
//           { id: 40, value: projectData.techStack.join(',') },
//           { id: 42, value: projectData.projectType },
//           { id: 47, value: projectData.projectMode },
//           { id: 48, value: projectData.accountName },
//           { id: 52, value: projectData.proposalProject || '' },
//         ],
//       },
//       members: Array.from(selectedUserIds).map(userId => ({
//         user_id: userId,
//         role_ids: [defaultRoleId]
//       }))
//     };

//     try {
//       await axios.post('http://localhost:5000/api/projects', newProjectPayload);
//       alert('Project and members added successfully!');
//       onProjectAdded();
//       handleClose();
//     } catch (error:any) {
//       console.error('Error in two-step project creation:', error.response?.data || error);
//       alert('Failed to add project and members. Please check the backend.');
//     } finally {
//       setLoading(false);
//     }
//   };


//   const handleClose = () => {
//     setSelectedUserIds(new Set());
//     onClose();
//   };

//   return (
//     <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
//       <DialogTitle>Add Members</DialogTitle>
//       <DialogContent dividers>
//         {fetchLoading ? (
//           <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
//             <CircularProgress />
//             <Typography sx={{ ml: 2 }}>Loading Employees...</Typography>
//           </Box>
//         ) : (
//           <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
//             {users.map(user => {
//               const labelId = `checkbox-list-label-${user.id}`;
//               return (
//                 <ListItem
//                   key={user.id}
//                   secondaryAction={<Typography variant="body2" color="green">Available</Typography>}
//                   disablePadding
//                 >
//                   <Button onClick={() => handleToggle(user.id)} sx={{ width: '100%', justifyContent: 'flex-start', textTransform: 'none' }}>
//                     <ListItemIcon>
//                       <Checkbox
//                         edge="start"
//                         checked={selectedUserIds.has(user.id)}
//                         tabIndex={-1}
//                         disableRipple
//                         inputProps={{ 'aria-labelledby': labelId }}
//                       />
//                     </ListItemIcon>
//                     <ListItemText id={labelId} primary={user.name} secondary={user.role} />
//                   </Button>
//                 </ListItem>
//               );
//             })}
//           </List>
//         )}
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={handleClose}>Cancel</Button>
//         <Button onClick={handleSubmit} disabled={loading || selectedUserIds.size === 0} variant="contained">
//           {loading ? 'Adding...' : 'Add Project'}
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default AddMembersModal;




// import React, { useState, useEffect } from 'react';
// import {
//   Dialog, DialogTitle, DialogContent, DialogActions, Button,
//   List, ListItem, ListItemIcon, Checkbox, ListItemText, CircularProgress, Box, Typography, Divider, Grid
// } from '@mui/material';
// import axios from 'axios';

// interface AddMembersModalProps {
//   open: boolean;
//   onClose: () => void;
//   projectData: any;
//   onProjectAdded: () => void;
// }

// interface UserWithRole {
//   id: number;
//   name: string;
//   role: string;
// }

// interface Role {
//   id: number;
//   name: string;
// }

// const AddMembersModal: React.FC<AddMembersModalProps> = ({ open, onClose, projectData, onProjectAdded }) => {
//   const [users, setUsers] = useState<UserWithRole[]>([]);
//   const [roles, setRoles] = useState<Role[]>([]);
//   const [selectedUserIds, setSelectedUserIds] = useState<Set<number>>(new Set());
//   const [selectedRoleIds, setSelectedRoleIds] = useState<Set<number>>(new Set());
//   const [loading, setLoading] = useState(false);
//   const [fetchLoading, setFetchLoading] = useState(true);

//   useEffect(() => {
//     if (open) {
//       setFetchLoading(true);
//       Promise.all([
//         axios.get('http://localhost:5000/api/employees'),
//         axios.get('http://localhost:5000/api/roles')
//       ])
//         .then(([usersResponse, rolesResponse]) => {
//           // Remove the "Alyssa client" role as requested
//           const filteredRoles = rolesResponse.data.roles.filter((role: Role) => role.name.toLowerCase() !== 'alyssa client');
//           setUsers(usersResponse.data.users);
//           setRoles(filteredRoles);
//         })
//         .catch(error => {
//           console.error('Error fetching data:', error);
//           alert('Could not load employee and role lists.');
//         })
//         .finally(() => {
//           setFetchLoading(false);
//         });
//     }
//   }, [open]);

//   const handleUserToggle = (userId: number) => {
//     setSelectedUserIds(prev => {
//       const newSet = new Set(prev);
//       if (newSet.has(userId)) {
//         newSet.delete(userId);
//       } else {
//         newSet.add(userId);
//       }
//       return newSet;
//     });
//   };

//   const handleRoleToggle = (roleId: number) => {
//     setSelectedRoleIds(prev => {
//       const newSet = new Set(prev);
//       if (newSet.has(roleId)) {
//         newSet.delete(roleId);
//       } else {
//         newSet.add(roleId);
//       }
//       return newSet;
//     });
//   };

//   const handleSubmit = async () => {
//     if (!projectData) {
//       alert('Project data is missing.');
//       return;
//     }
//     if (selectedUserIds.size === 0) {
//       alert('Please select at least one member.');
//       return;
//     }
//     if (selectedRoleIds.size === 0) {
//       alert('Please select at least one role.');
//       return;
//     }
//     setLoading(true);
    
//     // Convert Set of role IDs to an array
//     const selectedRolesArray = Array.from(selectedRoleIds);

//     const newProjectPayload = {
//       project: {
//         name: projectData.name,
//         identifier: projectData.identifier,
//         description: projectData.description,
//         status: 1,
//         is_public: false,
//         inherit_members: false,
//         custom_fields: [
//           { id: 37, value: projectData.projectCode },
//           { id: 38, value: projectData.startDate },
//           { id: 39, value: projectData.endDate },
//           { id: 40, value: projectData.techStack.join(',') },
//           { id: 42, value: projectData.projectType },
//           { id: 47, value: projectData.projectMode },
//           { id: 48, value: projectData.accountName },
//           { id: 52, value: projectData.proposalProject || '' },
//         ],
//       },
//       // Assign all selected roles to each selected user
//       members: Array.from(selectedUserIds).map(userId => ({
//         user_id: userId,
//         role_ids: selectedRolesArray,
//       }))
//     };

//     try {
//       await axios.post('http://localhost:5000/api/projects', newProjectPayload);
//       alert('Project and members added successfully!');
//       onProjectAdded();
//       handleClose();
//     } catch (error:any) {
//       console.error('Error in two-step project creation:', error.response?.data || error);
//       alert('Failed to add project and members. Please check the backend.');
//     } finally {
//       setLoading(false);
//     }
//   };


//   const handleClose = () => {
//     setSelectedUserIds(new Set());
//     setSelectedRoleIds(new Set());
//     onClose();
//   };

//   return (
//     <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
//       <DialogTitle>Add Members and Roles</DialogTitle>
//       <DialogContent dividers>
//         {fetchLoading ? (
//           <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
//             <CircularProgress />
//             <Typography sx={{ ml: 2 }}>Loading Employees and Roles...</Typography>
//           </Box>
//         ) : (
//           <>
//             <Typography variant="h6" gutterBottom>Select Members</Typography>
//             <Box sx={{ maxHeight: 300, overflowY: 'auto' }}>
//               <List>
//                 {users.map(user => {
//                   const labelId = `checkbox-list-label-user-${user.id}`;
//                   return (
//                     <ListItem
//                       key={user.id}
//                       secondaryAction={<Typography variant="body2" color="green">Available</Typography>}
//                       disablePadding
//                     >
//                       <Button onClick={() => handleUserToggle(user.id)} sx={{ width: '100%', justifyContent: 'flex-start', textTransform: 'none' }}>
//                         <ListItemIcon>
//                           <Checkbox
//                             edge="start"
//                             checked={selectedUserIds.has(user.id)}
//                             tabIndex={-1}
//                             disableRipple
//                             inputProps={{ 'aria-labelledby': labelId }}
//                           />
//                         </ListItemIcon>
//                         <ListItemText id={labelId} primary={user.name} secondary={user.role} />
//                       </Button>
//                     </ListItem>
//                   );
//                 })}
//               </List>
//             </Box>
//             <Divider sx={{ my: 2 }} />
//             <Typography variant="h6" gutterBottom>Select Roles</Typography>
//             <Grid container spacing={1}>
//               {roles.map(role => {
//                 const labelId = `checkbox-list-label-role-${role.id}`;
//                 return (
//                   <Grid item xs={12} sm={6} md={4} key={role.id}>
//                     <ListItem disablePadding>
//                       <Button onClick={() => handleRoleToggle(role.id)} sx={{ width: '100%', justifyContent: 'flex-start', textTransform: 'none' }}>
//                         <ListItemIcon>
//                           <Checkbox
//                             edge="start"
//                             checked={selectedRoleIds.has(role.id)}
//                             tabIndex={-1}
//                             disableRipple
//                             inputProps={{ 'aria-labelledby': labelId }}
//                           />
//                         </ListItemIcon>
//                         <ListItemText id={labelId} primary={role.name} />
//                       </Button>
//                     </ListItem>
//                   </Grid>
//                 );
//               })}
//             </Grid>
//           </>
//         )}
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={handleClose}>Cancel</Button>
//         <Button onClick={handleSubmit} disabled={loading || selectedUserIds.size === 0 || selectedRoleIds.size === 0} variant="contained">
//           {loading ? 'Adding...' : 'Add Project'}
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default AddMembersModal;


import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  List, ListItem, ListItemIcon, Checkbox, ListItemText, CircularProgress, Box, Typography, Divider, Grid
} from '@mui/material';
import axios from 'axios';

interface AddMembersModalProps {
  open: boolean;
  onClose: () => void;
  projectData: any;
  onProjectAdded: () => void;
}

interface UserWithRole {
  id: number;
  name: string;
  role: string;
}

interface Role {
  id: number;
  name: string;
}

const AddMembersModal: React.FC<AddMembersModalProps> = ({ open, onClose, projectData, onProjectAdded }) => {
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<Set<number>>(new Set());
  const [selectedRoleIds, setSelectedRoleIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  useEffect(() => {
    if (open) {
      setFetchLoading(true);
      Promise.all([
        axios.get('http://localhost:5000/api/employees'),
        axios.get('http://localhost:5000/api/roles')
      ])
        .then(([usersResponse, rolesResponse]) => {
          // Remove the "Alyssa client" role as requested
          const filteredRoles = rolesResponse.data.roles.filter((role: Role) => role.name.toLowerCase() !== 'alyssa client');
          setUsers(usersResponse.data.users);
          setRoles(filteredRoles);
        })
        .catch(error => {
          console.error('Error fetching data:', error);
          alert('Could not load employee and role lists.');
        })
        .finally(() => {
          setFetchLoading(false);
        });
    }
  }, [open]);

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
    if (!projectData) {
      alert('Project data is missing.');
      return;
    }
    if (selectedUserIds.size === 0) {
      alert('Please select at least one member.');
      return;
    }
    if (selectedRoleIds.size === 0) {
      alert('Please select at least one role.');
      return;
    }
    setLoading(true);
    
    // Convert Set of role IDs to an array
    const selectedRolesArray = Array.from(selectedRoleIds);

    const newProjectPayload = {
      project: {
        name: projectData.name,
        identifier: projectData.identifier,
        description: projectData.description,
        status: 1,
        is_public: false,
        inherit_members: false,
        custom_fields: [
          { id: 37, value: projectData.projectCode },
          { id: 38, value: projectData.startDate },
          { id: 39, value: projectData.endDate },
          { id: 40, value: projectData.techStack.join(',') },
          { id: 42, value: projectData.projectType },
          { id: 47, value: projectData.projectMode },
          { id: 48, value: projectData.accountName },
          { id: 52, value: projectData.proposalProject || '' },
        ],
      },
      // Assign all selected roles to each selected user
      members: Array.from(selectedUserIds).map(userId => ({
        user_id: userId,
        role_ids: selectedRolesArray,
      }))
    };

    try {
      await axios.post('http://localhost:5000/api/projects', newProjectPayload);
      alert('Project and members added successfully!');
      onProjectAdded();
      handleClose();
    } catch (error:any) {
      console.error('Error in two-step project creation:', error.response?.data || error);
      alert('Failed to add project and members. Please check the backend.');
    } finally {
      setLoading(false);
    }
  };


  const handleClose = () => {
    setSelectedUserIds(new Set());
    setSelectedRoleIds(new Set());
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>Add Members and Roles</DialogTitle>
      <DialogContent dividers>
        {fetchLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
            <Typography sx={{ ml: 2 }}>Loading Employees and Roles...</Typography>
          </Box>
        ) : (
          <>
            <Typography variant="h6" gutterBottom>Select Members</Typography>
            <Box sx={{ maxHeight: 300, overflowY: 'auto' }}>
              <List>
                {users.map(user => {
                  const labelId = `checkbox-list-label-user-${user.id}`;
                  return (
                    <ListItem
                      key={user.id}
                      disablePadding
                    >
                      <Button onClick={() => handleUserToggle(user.id)} sx={{ width: '100%', justifyContent: 'flex-start', textTransform: 'none' }}>
                        <ListItemIcon>
                          <Checkbox
                            edge="start"
                            checked={selectedUserIds.has(user.id)}
                            tabIndex={-1}
                            disableRipple
                            inputProps={{ 'aria-labelledby': labelId }}
                          />
                        </ListItemIcon>
                        <ListItemText id={labelId} primary={user.name} />
                      </Button>
                    </ListItem>
                  );
                })}
              </List>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>Select Roles</Typography>
            <Grid container spacing={1}>
              {roles.map(role => {
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
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit} disabled={loading || selectedUserIds.size === 0 || selectedRoleIds.size === 0} variant="contained">
          {loading ? 'Adding...' : 'Add Project'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddMembersModal;