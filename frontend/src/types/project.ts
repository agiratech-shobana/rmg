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
    id: number;
    project: { id: number; name: string };
    user: User;
    roles: Role[];
}

export interface CustomField {
    id: number;
    name: string;
    value: any;
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
