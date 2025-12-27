export const Agent_CREATE_API_PATHS = {
  Agent: `api/v1/web/users`,
  ROLES: "api/v1/web/roles/get-all",
  COUNTRIES_AND_USER_TYPES: "api/v1/web/users/prepare-data-for-store",
};

export const Agent_INDEX_API_PATHS = {
  Agent: `api/v1/web/users`,
  Country: `api/v1/web/countries/prepare`,
  Location: `api/v1/web/locations/?countryId=`,
};
