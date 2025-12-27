export interface Buyer {
  id?: string;
  contactNumber?: string;
  type?: string;
  groupType?: string;
  minPrice?: number;
  maxPrice?: number;
  countryId?: string;
  locationId?: string;
  districtId?: string;
  status?: boolean;
  description?: string;
}

export interface BuyerIndex {
  id?: string;
  contactNumber?: string;
  type?: string;
  groupType?: string;
  minPrice?: number;
  maxPrice?: number;
  countryId?: string;
  locationId?: string;
  districtId?: string;
  status?: boolean;
  description?: string;
}
