export const INDEX_API_PATHS = {
  USER_PROFILES: "api/v1/web/user-profiles",
  MY_AGENT: "api/v1/web/user-profiles/my-agents",
  COUNTRIES_AND_USER_TYPES:
    "api/v1/web/user-subscriptions/prepare-data-for-store",
  Listing: `api/v1/web/user-profiles/my-properties`,
  ListingDelete: `api/v1/web/properties`,
  User: `api/v1/web/users/filter-by-country?limit=10&page=1&countryId=`,
  Country: `api/v1/web/countries/prepare`,
  Location: `api/v1/web/locations/?countryId=`,
  District: `api/v1/web/districts/?locationId=`,
  EnumData: `api/v1/web/properties/prepare-data-for-store`,
  Telegram_Sent_Api: `api/v1/web/properties/send-telegram/`,
  OneSignal_Sent_Api: `api/v1/web/properties/send-onesignal/`,
  USERS: "api/v1/web/users",
  ROLES: "api/v1/web/roles/get-all",
  COMPANIES: "api/v1/web/companies/options",
  ASSOCIATIONS: "api/v1/web/associations/options",
};

export const CREATE_API_PATHS = {
  Listing: `api/v1/web/properties`,
  User: `api/v1/web/users/filter-by-country?limit=10&page=1&countryId=`,
  Country: `api/v1/web/countries/prepare`,
  Location: `api/v1/web/locations/?countryId=`,
  District: `api/v1/web/districts/?locationId=`,
  EnumData: `api/v1/web/properties/prepare-data-for-store`,
  Plans: `api/v1/web/plans/get-by-country-and-usertype`,
  USER_PROFILES: "api/v1/web/user-profiles",
  OrderSave: "api/v1/web/user-subscriptions/create-order",
};

export const EXTRA_API_PATHS = {
  MY_AGENT_ADD_MEMBER: "api/v1/web/users/update-organization",
};
