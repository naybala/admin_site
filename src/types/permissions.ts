export interface PermissionsResponse {
  success: boolean;
  code: number;
  message: string;
  data: {
    id: number;
    name: string;
    description: string;
    permissions: string[];
  };
}

export interface PermissionsData {
  [entity: string]: {
    [permissionKey: string]: any;
  };
}
