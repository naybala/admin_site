export interface Listing {
  id?: number;
  urlList?: string[];
  imageFiles: File[];
  name?: string;
  phoneNumberPrefix?: any;
  locationId?: any;
  createdUser?: any;
  districtId: string;
  type: any;
  status: any;
  propertyStatus: any;
  groupType: any;
  currencySymbol: any;
  titleType: any;
  additional: any;
  desc: string;
  position: any;
  price: number;
  lastPrice: number;
  dimension: any;
  size: number;
  linkYoutube: string;
  numBed: number;
  numBathroom: number;
  nearBy: any;
  is_private: boolean;
}

export interface ListingIndex {
  id?: number | null;
  type?: string;
  groupType?: string;
  price?: number;
  location?: string;
  createdAt?: string;
}
