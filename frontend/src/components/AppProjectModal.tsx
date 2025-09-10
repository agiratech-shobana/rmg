

// frontend/src/components/AppProjectModal.tsx
import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, Box, CircularProgress, Alert
} from '@mui/material';
import axios from 'axios';
import '../styles/AppProjectModal.css';
import type { ProjectSummary, ProjectDetails,ProjectFormData } from '../types/project';




const getCustomFieldValue = (project: ProjectDetails, fieldName: string): string | string[] | undefined => {
  const field = project.custom_fields.find(
    cf => cf.name.toLowerCase() === fieldName.toLowerCase()
  );
  const value = field?.value;

  if (typeof value === 'string' || Array.isArray(value)) return value;
  return undefined;
};




interface AddProjectModalProps {
  open: boolean;
  onClose: () => void;
  // This prop is for the "Add" flow
  onNext: (projectData: ProjectFormData) => void;
  // This prop is for the "Edit" flow
  onProjectSaved?: () => void;
  // This prop will determine if we are adding or editing
  project?: ProjectSummary | null;
}

// All the options arrays remain the same
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

const AddProjectModal: React.FC<AddProjectModalProps> = ({ open, onClose, onNext, project, onProjectSaved }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

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
  
  useEffect(() => {
    if (project && open) {
      setLoading(true);
      const fetchDetails = async () => {
        try {
          const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/projects/${project.id}`, { withCredentials: true });
          console.log("RECEIVED PROJECT DATA:", JSON.stringify(response.data, null, 2));
          const fullProject: ProjectDetails = response.data.project;

          setProjectName(fullProject.name || '');
setIdentifier(fullProject.identifier || '');
setDescription(fullProject.description || '');

// Set custom fields using our new robust helper and providing safe defaults
// setAccountName(getCustomFieldValue(fullProject, 'Account Name') || '');
// setProjectCode(getCustomFieldValue(fullProject, 'Project Code') || '');
// setStartDate(getCustomFieldValue(fullProject, 'Start Date') || '');
// setEndDate(getCustomFieldValue(fullProject, 'End Date') || '');
// setProjectType(getCustomFieldValue(fullProject, 'Project type') || '');
// setProjectMode(getCustomFieldValue(fullProject, 'Project Mode') || '');
// setProposalProject(getCustomFieldValue(fullProject, 'Proposal Project') || '');

setAccountName((getCustomFieldValue(fullProject, 'Account Name') as string) || '');
setProjectCode((getCustomFieldValue(fullProject, 'Project Code') as string) || '');
setStartDate((getCustomFieldValue(fullProject, 'Start Date') as string) || '');
setEndDate((getCustomFieldValue(fullProject, 'End Date') as string) || '');
setProjectType((getCustomFieldValue(fullProject, 'Project Type') as string) || '');
setProjectMode((getCustomFieldValue(fullProject, 'Project Mode') as string) || '');
setProposalProject((getCustomFieldValue(fullProject, 'Proposal Project') as string) || '');


// Special, safe handling for Tech Stack, which is an array
// const techStackValue = getCustomFieldValue(fullProject, 'Tech Stack');
// setTechStack(Array.isArray(techStackValue) ? techStackValue : []);
const techStackValue = getCustomFieldValue(fullProject, 'Tech Stack');
setTechStack(Array.isArray(techStackValue) ? techStackValue : []);





        } 
        // catch (err) {
        //   setError('Failed to load project details for editing.');
        // }
        catch (err: unknown) {
  console.error(err);
  setError('Failed to load project details for editing.');
}
         finally {
          setLoading(false);
        }
      };
      fetchDetails();
    } else if (!project && open) {
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
      setLoading(false);
    }
    setValidationErrors({});
    setError(null);
  }, [project, open]);

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

  const handleSaveOrNext = async () => {
    const errors = validateForm();
    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    if (project) {
      // --- EDIT MODE: Make a PUT request and then close ---
      setLoading(true);
      setError(null);
      const payload = {
        project: {
          name: projectName,
          identifier,
          description,
          custom_fields: [
            { id: 48, value: accountName },
            { id: 37, value: projectCode },
            { id: 42, value: projectType },
            { id: 47, value: projectMode },
            { id: 38, value: startDate },
            { id: 39, value: endDate },
            { id: 40, value: techStack   },
            { id: 52, value: proposalProject },
          ],
        },
      };

      try {
        await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/projects/${project.id}`, payload, { withCredentials: true });
        onProjectSaved?.(); // Call the parent handler to re-fetch
        onClose();
      } 
      // catch (err: any) {
      //   console.error('API Error:', err.response?.data?.message || err.message);
      //   setError(err.response?.data?.message || 'An unexpected error occurred.');
      // }
       catch (err) {
  if (axios.isAxiosError(err)) {
    console.error('API Error:', err.response?.data?.message || err.message);
    setError(err.response?.data?.message || 'An unexpected error occurred.');
  } else if (err instanceof Error) {
    console.error('Unexpected Error:', err.message);
    setError(err.message);
  } else {
    setError('An unexpected error occurred.');
  }
}
       finally {
        setLoading(false);
      }
    } else {
      // --- ADD MODE: Pass data to the next modal ---
      const projectData = {
        projectName,
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
    setValidationErrors({});
    onClose();
  };

  if (loading) {
    return (
      <Dialog open={open}>
        <DialogContent>
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{project ? 'Edit Project' : 'Add New Project'}</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error">{error}</Alert>}
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid size={5}>
            <div className="form-group">
              <label htmlFor="account-name" className="required-label">Account Name</label>
              <select id="account-name" value={accountName} onChange={(e) => setAccountName(e.target.value)}>
                <option value="">--Select Account Name--</option>
                {accountNameOptions.map((option) => (<option key={option} value={option}>{option}</option>))}
              </select>
              {validationErrors.accountName && <span className="error-message">{validationErrors.accountName}</span>}
            </div>
          </Grid>
          <Grid size={5}>
            <div className="form-group">
              <label htmlFor="project-name" className="required-label">Project Name</label>
              <input type="text" id="project-name" value={projectName} onChange={(e) => setProjectName(e.target.value)} />
              {validationErrors.projectName && <span className="error-message">{validationErrors.projectName}</span>}
            </div>
          </Grid>
          <Grid size={5}>
            <div className="form-group">
              <label htmlFor="project-identifier" className="required-label">Project Identifier</label>
              <input type="text" id="project-identifier" value={identifier} onChange={(e) => setIdentifier(e.target.value)} />
              {validationErrors.identifier && <span className="error-message">{validationErrors.identifier}</span>}
            </div>
          </Grid>
          <Grid size={5}>
            <div className="form-group">
              <label htmlFor="project-code" className="required-label">Project Code</label>
              <input type="text" id="project-code" value={projectCode} onChange={(e) => setProjectCode(e.target.value)} placeholder='ATPR###' />
              {validationErrors.projectCode && <span className="error-message">{validationErrors.projectCode}</span>}
            </div>
          </Grid>
          <Grid size={5}>
            <div className="form-group">
              <label htmlFor="description" className="required-label">Description</label>
              <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={2}></textarea>
              {validationErrors.description && <span className="error-message">{validationErrors.description}</span>}
            </div>
          </Grid>
          <Grid size={5}>
            <div className="form-group">
              <label htmlFor="project-type" className="required-label">Project Type</label>
              <select id="project-type" value={projectType} onChange={(e) => setProjectType(e.target.value)}>
                <option value="">--Select Project Type--</option>
                {projectTypeOptions.map((option) => (<option key={option} value={option}>{option}</option>))}
              </select>
              {validationErrors.projectType && <span className="error-message">{validationErrors.projectType}</span>}
            </div>
          </Grid>
          <Grid size={5}>
            <div className="form-group">
              <label htmlFor="project-mode" className="required-label">Project Mode</label>
              <select id="project-mode" value={projectMode} onChange={(e) => setProjectMode(e.target.value)}>
                <option value="">--Select Project Mode--</option>
                {projectModeOptions.map((option) => (<option key={option} value={option}>{option}</option>))}
              </select>
              {validationErrors.projectMode && <span className="error-message">{validationErrors.projectMode}</span>}
            </div>
          </Grid>
          <Grid size={5}>
            <div className="form-group">
              <label htmlFor="start-date" className="required-label">Start Date</label>
              <input type="date" id="start-date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              {validationErrors.startDate && <span className="error-message">{validationErrors.startDate}</span>}
            </div>
          </Grid>
          <Grid size={4}>
            <div className="form-group">
              <label htmlFor="end-date" className="required-label">End Date</label>
              <input type="date" id="end-date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              {validationErrors.endDate && <span className="error-message">{validationErrors.endDate}</span>}
            </div>
          </Grid>
          <Grid size={3}>
            <div className="form-group">
              <label htmlFor="tech-stack" className="required-label">Tech Stack</label>
              <select id="tech-stack" multiple value={techStack} onChange={(e) => {
                  const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
                  setTechStack(selectedOptions);
                }}>
                {techStackOptions.map((option) => (<option key={option} value={option}>{option}</option>))}
              </select>
              {validationErrors.techStack && <span className="error-message">{validationErrors.techStack}</span>}
            </div>
          </Grid>
          <Grid size={4}>
            <div className="form-group">
              <label htmlFor="proposal-project" className="required-label">Proposal Project</label>
              <select id="proposal-project" value={proposalProject} onChange={(e) => setProposalProject(e.target.value)}>
                <option value="">--Select Proposal--</option>
                {proposalProjectOptions.map((option) => (<option key={option} value={option}>{option}</option>))}
              </select>
              {validationErrors.proposalProject && <span className="error-message">{validationErrors.proposalProject}</span>}
            </div>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSaveOrNext} variant="contained" disabled={loading}>
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            project ? 'Save Changes' : 'Next'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddProjectModal;