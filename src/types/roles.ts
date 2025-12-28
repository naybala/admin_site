export interface Role {
  id?: string;
  name: string;
  description: string | null;
  permissions: any[];
}

export interface RoleIndex {
  id?: number;
  name: string;
  description: string | null;
  permissions: string[];
}
