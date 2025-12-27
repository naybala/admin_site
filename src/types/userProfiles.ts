export interface UserProfile {
  id?: number;
  username: string;
  email: string | null;
  phoneNumberPrefix: string;
  phoneNumber: string;
  roleId: string | null;
  userType: string | null;
  coverUrl: any;
  url: any;
  imageFileProfilePhoto: any;
  imageFileCoverPhoto: any;
  facebook: string | null;
  telegram: string | null;
  password: string | null;
  locationId: string;
}

export interface UserProfileIndex {
  id?: number;
  name: string;
  email: string | null;
}
