export interface Association {
  id: string;
  name: string;
  countryId: string;
  logo: any;
  description?: string;
  country?: {
    id: string;
    name: string;
  };
  createdAt?: string;
  __optimistic?: boolean;
}

export interface AssociationIndex {
  data: Association[];
  total: number;
}

export interface AssociationListParams {
  page: number;
  limit: number;
  search?: string;
}
