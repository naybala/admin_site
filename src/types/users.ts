export interface User {
  id?: number;
  username: string;
  email: string | null;
  phoneNumberPrefix: string;
  phoneNumber: string;
  roleId: string | null;
  companyId: string | null;
  userType: string | null;
  logo: any;
  facebook: string | null;
  telegram: string | null;
  imageFiles: any;
  fullName: string;
}

export interface UserIndex {
  id?: number;
  name: string;
  email: string | null;
  fullName: string;
}
