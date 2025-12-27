export interface Company {
  id?: string;
  address?: string;
  associationId?: string;
  associationMemberCode?: string;
  certificate?: string;
  certificateNumber?: string;
  certificateType?: string;
  code?: string;
  countryId?: string;
  description?: string;
  email?: string;
  enShortName?: string;
  facebook?: string;
  isRenew?: string;
  isRequestToVerify?: boolean;
  locationId?: string;
  logo?: string;
  name?: string;
  phoneNumber?: string;
  requestedAt?: Date;
  startDate?: Date;
  status?: boolean;
  telegram?: string;
  type?: string[];
  verificationStatus?: string;
  youtubeLink?: string;
  imageFiles?: any;
}

export interface CompanyIndex {
  id?: string;
  logo?: string;
  name?: string;
  phoneNumber?: string;
  email?: string;
  code?: string;
  startDate?: Date;
  status?: boolean;
}
