export interface AuthResponse {
  success: boolean;
  data: {
    user: {
      id: number;
      name: string;
      fullName: string;
      email: string;
      phoneNumberPrefix: string;
      phoneNumber: string;
      roleId: number;
      permissions: string[];
    };
    token: string;
    refreshToken: string;
  };
}
