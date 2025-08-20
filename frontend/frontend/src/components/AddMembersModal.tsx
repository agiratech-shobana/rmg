// // frontend/src/components/AddMembersModal.tsx
// import React, { useState, useEffect } from 'react';
// import {
//   Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid,
//   FormControl, InputLabel, Select, MenuItem, Checkbox, ListItemText, Typography
// } from '@mui/material';
// import axios from 'axios';

// interface AddMembersModalProps {
//   open: boolean;
//   onClose: () => void;
//   projectData: any;
//   onMembersAdded: () => void;
// }

// interface Employee {
//   id: number;
//   name: string;
// }

// interface Role {
//   id: number;
//   name: string;
// }

// const AddMembersModal: React.FC<AddMembersModalProps> = ({ open, onClose, projectData, onMembersAdded }) => {
//   const [employees, setEmployees] = useState<Employee[]>([]);
//   const [roles, setRoles] = useState<Role[]>([]);
//   const [selectedMembers, setSelectedMembers] = useState<Map<number, number>>(new Map());
//   const [loading, setLoading] = useState(false);
//   const [fetchLoading, setFetchLoading] = useState(true);

//   useEffect(() => {
//     if (open) {
//       setFetchLoading(true);
//       Promise.all([
//         axios.get('http://localhost:5000/api/users'),
//         axios.get('http://localhost:5000/api/roles')
//       ])
//         .then(([employeesResponse, rolesResponse]) => {
//           setEmployees(employeesResponse.data);
//           setRoles(rolesResponse.data.roles);
//         })
//         .catch(error => {
//           console.error('Error fetching data:', error);
//         })
//         .finally(() => {
//           setFetchLoading(false);
//         });
//     }
//   }, [open]);

//   const handleMemberChange = (employeeId: number, roleId: number) => {
//     setSelectedMembers(prev => {
//       const newMap = new Map(prev);
//       if (roleId === 0) {
//         newMap.delete(employeeId);
//       } else {
//         newMap.set(employeeId, roleId);
//       }
//       return newMap;
//     });
//   };

//   const handleSubmit = async () => {
//     if (!projectData) {
//       alert('Project data is missing.');
//       return;
//     }
//     if (selectedMembers.size === 0) {
//       alert('Please select at least one member with a role.');
//       return;
//     }
//     setLoading(true);
//     let newProjectId: number;

//     try {
//       // Step 1: Create the project
//       const newProjectPayload = {
//         project: {
//           name: projectData.name,
//           identifier: projectData.identifier,
//           description: projectData.description,
//           status: 1,
//           is_public: false,
//           inherit_members: false,
//           custom_fields: [
//             { id: 37, value: projectData.projectCode },
//             { id: 38, value: projectData.startDate },
//             { id: 39, value: projectData.endDate },
//             { id: 40, value: projectData.techStack.join(',') },
//             { id: 42, value: projectData.projectType },
//             { id: 47, value: projectData.projectMode },
//             { id: 48, value: projectData.accountName },
//             { id: 52, value: projectData.proposalProject || '' },
//           ],
//         },
//       };

//       const projectResponse = await axios.post('http://localhost:5000/api/projects', newProjectPayload);
//       newProjectId = projectResponse.data.project.id;

//       // Step 2: Add the selected members
//       const memberPromises = Array.from(selectedMembers.entries()).map(([userId, roleId]) => {
//         const payload = {
//           membership: {
//             user_id: userId,
//             role_ids: [roleId]
//           }
//         };
//         return axios.post(`http://localhost:5000/api/projects/${newProjectId}/memberships`, payload);
//       });
//       await Promise.all(memberPromises);

//       alert('Project and members added successfully!');
//       onMembersAdded();
//       handleClose();

//     } catch (error) {
//       console.error('Error in two-step project creation:', error);
//       alert('Failed to add project and members. Please check the backend.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleClose = () => {
//     setSelectedMembers(new Map());
//     onClose();
//   };

//   return (
//     <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
//       <DialogTitle>Add Members</DialogTitle>
//       <DialogContent dividers>
//         {fetchLoading ? (
//           <p>Loading employees and roles...</p>
//         ) : (
//           <Grid container spacing={2}>
//             {employees.map(employee => (
//               <Grid item xs={12} key={employee.id}>
//                 <Grid container alignItems="center">
//                   <Grid item xs={6}>
//                     <p>{employee.name}</p>
//                   </Grid>
//                   <Grid item xs={6}>
//                     <FormControl fullWidth>
//                       <InputLabel>Select Role</InputLabel>
//                       <Select
//                         value={selectedMembers.get(employee.id) || 0}
//                         label="Select Role"
//                         onChange={(e) => handleMemberChange(employee.id, e.target.value as number)}
//                       >
//                         <MenuItem value={0}>-- None --</MenuItem>
//                         {roles.map(role => (
//                           <MenuItem key={role.id} value={role.id}>{role.name}</MenuItem>
//                         ))}
//                       </Select>
//                     </FormControl>
//                   </Grid>
//                 </Grid>
//               </Grid>
//             ))}
//           </Grid>
//         )}
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={handleClose}>Cancel</Button>
//         <Button onClick={handleSubmit} disabled={loading || selectedMembers.size === 0} variant="contained">
//           {loading ? 'Adding...' : 'Add Project'}
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default AddMembersModal;

import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid,
  FormControl, InputLabel, Select, MenuItem, Checkbox, FormControlLabel, Typography
} from '@mui/material';
import axios from 'axios';

interface AddMembersModalProps {
  open: boolean;
  onClose: () => void;
  projectData: any;
  onProjectAdded: () => void;
}

interface Employee {
  id: number;
  name: string;
}

interface Role {
  id: number;
  name: string;
}

const AddMembersModal: React.FC<AddMembersModalProps> = ({ open, onClose, projectData, onProjectAdded }) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<Map<number, number>>(new Map());
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  useEffect(() => {
    if (open) {
      setFetchLoading(true);
      Promise.all([
        axios.get('http://localhost:5000/api/users'),
        axios.get('http://localhost:5000/api/roles')
      ])
        .then(([employeesResponse, rolesResponse]) => {
          setEmployees(employeesResponse.data);
          setRoles(rolesResponse.data.roles);
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        })
        .finally(() => {
          setFetchLoading(false);
        });
    }
  }, [open]);

  const handleMemberChange = (employeeId: number, roleId: number) => {
    setSelectedMembers(prev => {
      const newMap = new Map(prev);
      if (roleId === 0) {
        newMap.delete(employeeId);
      } else {
        newMap.set(employeeId, roleId);
      }
      return newMap;
    });
  };

  const handleSubmit = async () => {
    if (!projectData) {
      alert('Project data is missing.');
      return;
    }
    if (selectedMembers.size === 0) {
      alert('Please select at least one member with a role.');
      return;
    }
    setLoading(true);

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
      members: Array.from(selectedMembers.entries()).map(([userId, roleId]) => ({
        user_id: userId,
        role_ids: [roleId]
      }))
    };

    try {
      await axios.post('http://localhost:5000/api/projects', newProjectPayload);
      alert('Project and members added successfully!');
      onProjectAdded();
      handleClose();
      // onProjectAdded();
      // handleClose();
    } catch (error:any) {
      console.error('Error in two-step project creation:', error.response?.data || error);
      alert('Failed to add project and members. Please check the   backend.');
    } finally {
      setLoading(false);
    }
  };


  const handleClose = () => {
    setSelectedMembers(new Map());
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Add Members</DialogTitle>
      <DialogContent dividers>
        {fetchLoading ? (
          <p>Loading employees and roles...</p>
        ) : (
          <Grid container spacing={2}>
            {employees.map(employee => (
              <Grid item xs={12} key={employee.id}>
                <Grid container alignItems="center">
                  <Grid item xs={6}>
                    <p>{employee.name}</p>
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl fullWidth>
                      <InputLabel>Select Role</InputLabel>
                      <Select
                        value={selectedMembers.get(employee.id) || 0}
                        label="Select Role"
                        onChange={(e) => handleMemberChange(employee.id, e.target.value as number)}
                      >
                        <MenuItem value={0}>-- None --</MenuItem>
                        {roles.map(role => (
                          <MenuItem key={role.id} value={role.id}>{role.name}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
            ))}
          </Grid>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit} disabled={loading || selectedMembers.size === 0} variant="contained">
          {loading ? 'Adding...' : 'Add Project'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddMembersModal;


