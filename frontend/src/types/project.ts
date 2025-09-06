export interface Role {
    id: number;
    name: string;
}

export interface User {
    id: number;
    name: string;
    firstname?: string;
    lastname?: string;
}

export interface Membership {
    id: number; // membership ID
    project: { id: number; name: string };
    user: User;
    roles: Role[];
}

export interface CustomField {
    id: number;
    name: string;
    value: unknown;
    multiple?: boolean;
}

export interface ProjectDetails {
    id: number;
    name: string;
    identifier: string;
    description: string;
    status: number;
    custom_fields: CustomField[];
}

// This is the type your ProjectDashboard expects
export interface ProjectSummary {
  id: number;
  name: string;
  identifier: string;
  accountName: string;
  status: string;
  progress: number;
  loggedHours: number;
  totalHours: number;
  endDate: string;
}

export interface ProjectFormData {
  projectName: string;
  identifier: string;
  description: string;
  accountName: string;
  projectCode: string;
  projectType: string;
  projectMode: string;
  startDate: string;
  endDate: string;
  techStack: string[];
  proposalProject: string;
}
