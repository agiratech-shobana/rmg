

// import React, { useState } from 'react';
// import {
//   Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid
// } from '@mui/material';
// import '../styles/AppProjectModal.css';

// interface AddProjectModalProps {
//   open: boolean;
//   onClose: () => void;
//   onNext: (projectData: any) => void;
// }

// const techStackOptions = ['Node.js', 'React', 'TypeScript', 'Java', 'Python', 'Angular'];
// const projectTypeOptions = ['Client', 'Internal'];
// const projectModeOptions = ['T&M', 'Retainer', 'Fixed', 'Support'];
// const accountNameOptions = [
//   'AgiraDigital', 'AgiraSure', 'AgiraData', '10DeCoders', 'AMN', 'APA', 'ATIC',
//   'Curiokids', 'Deltion', 'Ekaa', 'EKAM', 'Field Dynamics', 'Freshworks', 'LibertyChurch',
//   'Logrythmic', 'Masar', 'Motionworks', 'Panasonic', 'Pumex', 'TalaiaSaudia',
//   'Vayu Group', 'Yexle', 'Zencode', 'Avanttec', 'Mustafah KSA', 'SARC', 'Trinity',
//   'Hastraa', 'Trillium', 'AME Chain', 'Securenext'
// ];

// const AddProjectModal: React.FC<AddProjectModalProps> = ({ open, onClose, onNext }) => {
//   const [projectName, setProjectName] = useState('');
//   const [identifier, setIdentifier] = useState('');
//   const [description, setDescription] = useState('');
//   const [projectCode, setProjectCode] = useState('');
//   const [startDate, setStartDate] = useState('');
//   const [endDate, setEndDate] = useState('');
//   const [techStack, setTechStack] = useState<string[]>([]);
//   const [projectType, setProjectType] = useState('');
//   const [projectMode, setProjectMode] = useState('');
//   const [accountName, setAccountName] = useState('');
//   const [proposalProject, setProposalProject] = useState('');

//   const handleNext = () => {
//     // Basic validation
//     if (!projectName || !identifier || !projectType || !projectMode || !accountName) {
//         alert('Please fill in all required fields.');
//         return;
//     }

//     const projectData = {
//       name: projectName,
//       identifier: identifier,
//       description: description,
//       projectCode: projectCode,
//       startDate: startDate,
//       endDate: endDate,
//       techStack: techStack,
//       projectType: projectType,
//       projectMode: projectMode,
//       accountName: accountName,
//       proposalProject: proposalProject,
//     };
//     onNext(projectData);
//   };

//   const handleClose = () => {
//     // Reset state on close
//     setProjectName('');
//     setIdentifier('');
//     setDescription('');
//     setProjectCode('');
//     setStartDate('');
//     setEndDate('');
//     setTechStack([]);
//     setProjectType('');
//     setProjectMode('');
//     setAccountName('');
//     setProposalProject('');
//     onClose();
//   };

//   return (
//     <Dialog open={open} onClose={handleClose}>
//       <DialogTitle>Add New Project</DialogTitle>
//       <DialogContent>
//         <Grid container spacing={2} sx={{ mt: 1 }}>
//           <Grid xs={12} sm={6}>
//             <div className="form-group">
//               <label htmlFor="account-name">Account Name</label>
//               <select
//                 id="account-name"
//                 required
//                 value={accountName}
//                 onChange={(e) => setAccountName(e.target.value)}
//               >
//                 <option value="">--Select Account Name--</option>
//                 {accountNameOptions.map((option) => (
//                   <option key={option} value={option}>{option}</option>
//                 ))}
//               </select>
//             </div>
//           </Grid>
//           <Grid xs={12} sm={6}>
//             <div className="form-group">
//               <label htmlFor="project-name">Project Name</label>
//               <input
//                 type="text"
//                 id="project-name"
//                 required
//                 value={projectName}
//                 onChange={(e) => setProjectName(e.target.value)}
//               />
//             </div>
//           </Grid>
//           <Grid xs={12} sm={6}>
//             <div className="form-group">
//               <label htmlFor="project-identifier">Project Identifier</label>
//               <input
//                 type="text"
//                 id="project-identifier"
//                 required
//                 value={identifier}
//                 onChange={(e) => setIdentifier(e.target.value)}
//               />
//             </div>
//           </Grid>
//           <Grid xs={12} sm={6}>
//             <div className="form-group">
//               <label htmlFor="project-code">Project Code</label>
//               <input
//                 type="text"
//                 id="project-code"
//                 value={projectCode}
//                 onChange={(e) => setProjectCode(e.target.value)}
//               />
//             </div>
//           </Grid>
//           <Grid xs={12}>
//             <div className="form-group">
//               <label htmlFor="description">Description</label>
//               <textarea
//                 id="description"
//                 value={description}
//                 onChange={(e) => setDescription(e.target.value)}
//                 rows={2}
//               ></textarea>
//             </div>
//           </Grid>
//           <Grid xs={12} sm={6}>
//             <div className="form-group">
//               <label htmlFor="project-type">Project Type</label>
//               <select
//                 id="project-type"
//                 value={projectType}
//                 onChange={(e) => setProjectType(e.target.value)}
//               >
//                 <option value="">--Select Project Type--</option>
//                 {projectTypeOptions.map((option) => (
//                   <option key={option} value={option}>{option}</option>
//                 ))}
//               </select>
//             </div>
//           </Grid>
//           <Grid xs={12} sm={6}>
//             <div className="form-group">
//               <label htmlFor="project-mode">Project Mode</label>
//               <select
//                 id="project-mode"
//                 value={projectMode}
//                 onChange={(e) => setProjectMode(e.target.value)}
//               >
//                 <option value="">--Select Project Mode--</option>
//                 {projectModeOptions.map((option) => (
//                   <option key={option} value={option}>{option}</option>
//                 ))}
//               </select>
//             </div>
//           </Grid>
//           <Grid xs={12} sm={6}>
//             <div className="form-group">
//               <label htmlFor="start-date">Start Date</label>
//               <input
//                 type="date"
//                 id="start-date"
//                 value={startDate}
//                 onChange={(e) => setStartDate(e.target.value)}
//               />
//             </div>
//           </Grid>
//           <Grid xs={12} sm={6}>
//             <div className="form-group">
//               <label htmlFor="end-date">End Date</label>
//               <input
//                 type="date"
//                 id="end-date"
//                 value={endDate}
//                 onChange={(e) => setEndDate(e.target.value)}
//               />
//             </div>
//           </Grid>
//           <Grid xs={12}>
//             <div className="form-group">
//               <label htmlFor="tech-stack">Tech Stack</label>
//               <select
//                 id="tech-stack"
//                 multiple
//                 value={techStack}
//                 onChange={(e) => {
//                   const options = Array.from(e.target.options);
//                   const selectedOptions = options
//                     .filter(o => o.selected)
//                     .map(o => o.value);
//                   setTechStack(selectedOptions);
//                 }}
//               >
//                 {techStackOptions.map((option) => (
//                   <option key={option} value={option}>{option}</option>
//                 ))}
//               </select>
//             </div>
//           </Grid>
//           <Grid xs={12}>
//             <div className="form-group">
//               <label htmlFor="proposal-project">Proposal Project</label>
//               <input
//                 type="text"
//                 id="proposal-project"
//                 value={proposalProject}
//                 onChange={(e) => setProposalProject(e.target.value)}
//               />
//             </div>
//           </Grid>
//         </Grid>
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={handleClose}>Cancel</Button>
//         <Button onClick={handleNext} variant="contained">Next</Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default AddProjectModal;


import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid
} from '@mui/material';
import '../styles/AppProjectModal.css';

interface AddProjectModalProps {
  open: boolean;
  onClose: () => void;
  onNext: (projectData: any) => void;
}

const techStackOptions = ['Node.js', 'React', 'TypeScript', 'Java', 'Python', 'Angular'];
const projectTypeOptions = ['Client', 'Internal'];
const projectModeOptions = ['T&M', 'Retainer', 'Fixed', 'Support'];
const accountNameOptions = [
  'AgiraDigital', 'AgiraSure', 'AgiraData', '10DeCoders', 'AMN', 'APA', 'ATIC',
  'Curiokids', 'Deltion', 'Ekaa', 'EKAM', 'Field Dynamics', 'Freshworks', 'LibertyChurch',
  'Logrythmic', 'Masar', 'Motionworks', 'Panasonic', 'Pumex', 'TalaiaSaudia',
  'Vayu Group', 'Yexle', 'Zencode', 'Avanttec', 'Mustafah KSA', 'SARC', 'Trinity',
  'Hastraa', 'Trillium', 'AME Chain', 'Securenext'
];

const AddProjectModal: React.FC<AddProjectModalProps> = ({ open, onClose, onNext }) => {
  const [projectName, setProjectName] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [description, setDescription] = useState('');
  const [projectCode, setProjectCode] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [techStack, setTechStack] = useState<string[]>([]);
  const [projectType, setProjectType] = useState('');
  const [projectMode, setProjectMode] = useState('');
  const [accountName, setAccountName] = useState('');
  const [proposalProject, setProposalProject] = useState('');

  const handleNext = () => {
    if (!projectName || !identifier) {
        alert('Project Name and Identifier are required.');
        return;
    }

    const projectData = {
      name: projectName,
      identifier: identifier,
      description: description,
      projectCode: projectCode,
      startDate: startDate,
      endDate: endDate,
      techStack: techStack,
      projectType: projectType,
      projectMode: projectMode,
      accountName: accountName,
      proposalProject: proposalProject,
    };
    onNext(projectData);
  };

  const handleClose = () => {
    setProjectName('');
    setIdentifier('');
    setDescription('');
    setProjectCode('');
    setStartDate('');
    setEndDate('');
    setTechStack([]);
    setProjectType('');
    setProjectMode('');
    setAccountName('');
    setProposalProject('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add New Project</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid xs={12} sm={6}>
            <div className="form-group">
              <label htmlFor="account-name">Account Name</label>
              <select
                id="account-name"
                required
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
              >
                <option value="">--Select Account Name--</option>
                {accountNameOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          </Grid>
          <Grid xs={12} sm={6}>
            <div className="form-group">
              <label htmlFor="project-name">Project Name</label>
              <input
                type="text"
                id="project-name"
                required
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />
            </div>
          </Grid>
          <Grid xs={12} sm={6}>
            <div className="form-group">
              <label htmlFor="project-identifier">Project Identifier</label>
              <input
                type="text"
                id="project-identifier"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
              />
            </div>
          </Grid>
          <Grid xs={12} sm={6}>
            <div className="form-group">
              <label htmlFor="project-code">Project Code</label>
              <input
                type="text"
                id="project-code"
                value={projectCode}
                onChange={(e) => setProjectCode(e.target.value)}
              />
            </div>
          </Grid>
          <Grid xs={12}>
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
              ></textarea>
            </div>
          </Grid>
          <Grid xs={12} sm={6}>
            <div className="form-group">
              <label htmlFor="project-type">Project Type</label>
              <select
                id="project-type"
                value={projectType}
                onChange={(e) => setProjectType(e.target.value)}
              >
                <option value="">--Select Project Type--</option>
                {projectTypeOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          </Grid>
          <Grid xs={12} sm={6}>
            <div className="form-group">
              <label htmlFor="project-mode">Project Mode</label>
              <select
                id="project-mode"
                value={projectMode}
                onChange={(e) => setProjectMode(e.target.value)}
              >
                <option value="">--Select Project Mode--</option>
                {projectModeOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          </Grid>
          <Grid xs={12} sm={6}>
            <div className="form-group">
              <label htmlFor="start-date">Start Date</label>
              <input
                type="date"
                id="start-date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
          </Grid>
          <Grid xs={12} sm={6}>
            <div className="form-group">
              <label htmlFor="end-date">End Date</label>
              <input
                type="date"
                id="end-date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </Grid>
          <Grid xs={12}>
            <div className="form-group">
              <label htmlFor="tech-stack">Tech Stack</label>
              <select
                id="tech-stack"
                multiple
                value={techStack}
                onChange={(e) => {
                  const options = Array.from(e.target.options);
                  const selectedOptions = options
                    .filter(o => o.selected)
                    .map(o => o.value);
                  setTechStack(selectedOptions);
                }}
              >
                {techStackOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          </Grid>
          <Grid xs={12}>
            <div className="form-group">
              <label htmlFor="proposal-project">Proposal Project</label>
              <input
                type="text"
                id="proposal-project"
                value={proposalProject}
                onChange={(e) => setProposalProject(e.target.value)}
              />
            </div>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleNext} variant="contained">Next</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddProjectModal;