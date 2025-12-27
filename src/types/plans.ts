export interface PlanDetail {
  id?: number | null;
  duration: number;
  discountPercent: number;
  vatPercent: number;
  numAgent: number;
  numProperty: number;
  numAuto: number;
  numDocument: number;
  numMeasurement: number;
  pricePerAdvertise: number;
  pricePerValuation: number;
}

export interface Plan {
  id?: number;
  name: string;
  deletedPlans: any;
  userType: string;
  countryCode: string;
  price: number;
  currency: any;
  plans: PlanDetail[];
}

export interface PlanIndex {
  id?: number;
  name: string;
  userType: string;
  userTypeName: string;
  countryCode: string;
  price: number;
  currency: any;
}
