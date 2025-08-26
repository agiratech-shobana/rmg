

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

// --- (No changes to the options arrays) ---
const techStackOptions = ['Node.js', 'Angular','Ruby','Python','Javascript','Java','Ruby On Rails','Nest.js','PHP','Django','Flask','Laravel','Express.js','jQuery','ASP.NET','Cake PHP','Symphony','Svelte','Next.js','React.js','sinatra','Vue.js','Spring Boot','Spring','MongoDB','MySql','Postgres','Testing'];
const proposalProjectOptions = ['Freshworks AMC', 'Tafe', 'Almozaini'];
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
  // --- (No changes to the form data states) ---
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

  // --- NEW: State to hold validation errors for each field ---
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // --- UPDATED: Validation logic now returns an object of errors ---
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!accountName) newErrors.accountName = 'Account Name is required.';
    if (!projectName.trim()) newErrors.projectName = 'Project Name is required.';
    if (!identifier.trim()) newErrors.identifier = 'Project Identifier is required.';
    if (!projectCode.trim()) {
      newErrors.projectCode = 'Project Code is required.';
    } else if (!projectCode.startsWith('ATPR')) {
      newErrors.projectCode = "Project Code must start with 'ATPR'.";
    }
    if (!description.trim()) newErrors.description = 'Description is required.';
    if (!projectType) newErrors.projectType = 'Project Type is required.';
    if (!projectMode) newErrors.projectMode = 'Project Mode is required.';
    if (!startDate) newErrors.startDate = 'Start Date is required.';
    if (!endDate) newErrors.endDate = 'End Date is required.';
    if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
      newErrors.endDate = 'End Date cannot be before Start Date.';
    }
    if (techStack.length === 0) newErrors.techStack = 'At least one Tech Stack must be selected.';
    if (!proposalProject) newErrors.proposalProject = 'Proposal Project is required.';
    
    return newErrors;
  };
  
  const handleNext = () => {
    const validationErrors = validateForm();
    setErrors(validationErrors); // Set errors to trigger UI updates

    // If the errors object is empty, the form is valid
    if (Object.keys(validationErrors).length === 0) {
      const projectData = {
        name: projectName,
        identifier,
        description,
        projectCode,
        startDate,
        endDate,
        techStack,
        projectType,
        projectMode,
        accountName,
        proposalProject,
      };
      onNext(projectData);
    }
  };

  const handleClose = () => {
    // Reset all states on close
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
    setErrors({}); // Clear errors as well
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add New Project</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          
          {/* --- UPDATED: All form groups now include a span to show the error message --- */}
          
          <Grid xs={12} sm={6}>
            <div className="form-group">
              <label htmlFor="account-name" className="required-label">Account Name</label>
              <select id="account-name" value={accountName} onChange={(e) => setAccountName(e.target.value)}>
                <option value="">--Select Account Name--</option>
                {accountNameOptions.map((option) => (<option key={option} value={option}>{option}</option>))}
              </select>
              {errors.accountName && <span className="error-message">{errors.accountName}</span>}
            </div>
          </Grid>
          <Grid xs={12} sm={6}>
            <div className="form-group">
              <label htmlFor="project-name" className="required-label">Project Name</label>
              <input type="text" id="project-name" value={projectName} onChange={(e) => setProjectName(e.target.value)} />
              {errors.projectName && <span className="error-message">{errors.projectName}</span>}
            </div>
          </Grid>
          <Grid xs={12} sm={6}>
            <div className="form-group">
              <label htmlFor="project-identifier" className="required-label">Project Identifier</label>
              <input type="text" id="project-identifier" value={identifier} onChange={(e) => setIdentifier(e.target.value)} />
              {errors.identifier && <span className="error-message">{errors.identifier}</span>}
            </div>
          </Grid>
          <Grid xs={12} sm={6}>
            <div className="form-group">
              <label htmlFor="project-code" className="required-label">Project Code</label>
              <input type="text" id="project-code" value={projectCode} onChange={(e) => setProjectCode(e.target.value)} />
              {errors.projectCode && <span className="error-message">{errors.projectCode}</span>}
            </div>
          </Grid>
          <Grid xs={12}>
            <div className="form-group">
              <label htmlFor="description" className="required-label">Description</label>
              <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={2}></textarea>
              {errors.description && <span className="error-message">{errors.description}</span>}
            </div>
          </Grid>
          <Grid xs={12} sm={6}>
            <div className="form-group">
              <label htmlFor="project-type" className="required-label">Project Type</label>
              <select id="project-type" value={projectType} onChange={(e) => setProjectType(e.target.value)}>
                <option value="">--Select Project Type--</option>
                {projectTypeOptions.map((option) => (<option key={option} value={option}>{option}</option>))}
              </select>
              {errors.projectType && <span className="error-message">{errors.projectType}</span>}
            </div>
          </Grid>
          <Grid xs={12} sm={6}>
            <div className="form-group">
              <label htmlFor="project-mode" className="required-label">Project Mode</label>
              <select id="project-mode" value={projectMode} onChange={(e) => setProjectMode(e.target.value)}>
                <option value="">--Select Project Mode--</option>
                {projectModeOptions.map((option) => (<option key={option} value={option}>{option}</option>))}
              </select>
              {errors.projectMode && <span className="error-message">{errors.projectMode}</span>}
            </div>
          </Grid>
          <Grid xs={12} sm={6}>
            <div className="form-group">
              <label htmlFor="start-date" className="required-label">Start Date</label>
              <input type="date" id="start-date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              {errors.startDate && <span className="error-message">{errors.startDate}</span>}
            </div>
          </Grid>
          <Grid xs={12} sm={6}>
            <div className="form-group">
              <label htmlFor="end-date" className="required-label">End Date</label>
              <input type="date" id="end-date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              {errors.endDate && <span className="error-message">{errors.endDate}</span>}
            </div>
          </Grid>
          <Grid xs={12}>
            <div className="form-group">
              <label htmlFor="tech-stack" className="required-label">Tech Stack</label>
              <select id="tech-stack" multiple value={techStack} onChange={(e) => {
                  const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
                  setTechStack(selectedOptions);
                }}>
                {techStackOptions.map((option) => (<option key={option} value={option}>{option}</option>))}
              </select>
              {errors.techStack && <span className="error-message">{errors.techStack}</span>}
            </div>
          </Grid>
          <Grid xs={12}>
            <div className="form-group">
              <label htmlFor="proposal-project" className="required-label">Proposal Project</label>
              <select id="proposal-project" value={proposalProject} onChange={(e) => setProposalProject(e.target.value)}>
                <option value="">--Select Proposal--</option>
                {proposalProjectOptions.map((option) => (<option key={option} value={option}>{option}</option>))}
              </select>
              {errors.proposalProject && <span className="error-message">{errors.proposalProject}</span>}
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