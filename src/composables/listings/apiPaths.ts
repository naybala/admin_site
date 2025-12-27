export const LISTING_CREATE_API_PATHS = {
  Listing: `api/v1/web/properties`,
  User: `api/v1/web/users/filter-by-country?limit=10&page=1&countryId=`,
  Country: `api/v1/web/countries/prepare`,
  Location: `api/v1/web/locations/?countryId=`,
  District: `api/v1/web/districts/?locationId=`,
  EnumData: `api/v1/web/properties/prepare-data-for-store`,
};

export const LISTING_INDEX_API_PATHS = {
  Listing: `api/v1/web/properties`,
  User: `api/v1/web/users/filter-by-country?limit=10&page=1&countryId=`,
  Country: `api/v1/web/countries/prepare`,
  Location: `api/v1/web/locations/?countryId=`,
  District: `api/v1/web/districts/?locationId=`,
  EnumData: `api/v1/web/properties/prepare-data-for-store`,
  Telegram_Sent_Api: `api/v1/web/properties/send-telegram/`,
  OneSignal_Sent_Api: `api/v1/web/properties/send-onesignal/`,
  ListingBoostOrder: `api/v1/web/properties/orders`,
};
