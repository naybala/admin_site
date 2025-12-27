import OwnLicenseFormView from "@/views/ownLicenses/OwnLicenseFormView.vue";
import OwnLicenseListView from "@/views/ownLicenses/OwnLicenseListView.vue";
import PlanFormView from "@/views/plans/PlanFormView.vue";
import PlanListView from "@/views/plans/PlanListView.vue";
import RoleFormView from "@/views/roles/RoleFormView.vue";
import RoleListView from "@/views/roles/RoleListView.vue";
import MapPriceOrderListView from "@views/mapPriceOrders/MapPriceOrderListView.vue";
import MapPriceOrderFormView from "@views/mapPriceOrders/MapPriceOrderFormView.vue";
import UserSubscriptionOrderListView from "@/views/userSubScriptions/UserSubscriptionOrderListView.vue";
import ListingBoostOrderView from "@/views/listings/ListingBoostOrderView.vue";

const featureOne = "ownLicenses";
const featureTwo = "plans";
const featureFour = "roles";
const featureFive = "mapPriceOrders";
const featureSix = "userSubscriptionOrders";
const featureSeven = "propertyBoostOrders";

export const settingRoutes = [
  {
    path: "/setting",
    name: "settings",
    meta: {
      requiresAuth: true,
      sidebar: true,
      label: "sidebar.settings",
      icon: "pi pi-cog",
    },

    children: [
      {
        path: "own-licenses",
        name: "ownLicenses",
        component: OwnLicenseListView,
        meta: {
          requiresAuth: true,
          permission: `${featureOne}.index`,
          sidebar: false,
          label: "sidebar.ownLicenses",
          icon: "pi pi-microchip",
        },
      },
      {
        path: "plans",
        name: "plans",
        component: PlanListView,
        meta: {
          requiresAuth: true,
          permission: `${featureTwo}.index`,
          sidebar: false,
          label: "sidebar.plans",
          icon: "pi pi-sitemap",
        },
      },
      {
        path: "roles",
        name: "roles",
        component: RoleListView,
        meta: {
          requiresAuth: true,
          permission: `${featureFour}.index`,
          sidebar: false,
          label: "sidebar.roles",
          icon: "pi pi-barcode",
        },
      },

      {
        path: "map-price-orders",
        name: "mapPriceOrders",
        component: MapPriceOrderListView,
        meta: {
          requiresAuth: true,
          permission: `${featureFive}.index`,
          sidebar: false,
          label: "sidebar.mapPriceOrders",
          icon: "pi pi-briefcase",
        },
      },
      {
        path: "user-subscription-orders",
        name: "userSubscriptionOrders",
        component: UserSubscriptionOrderListView,
        meta: {
          requiresAuth: true,
          permission: `${featureSix}.index`,
          sidebar: false,
          label: "sidebar.userSubscriptionOrders",
          icon: "pi pi-briefcase",
        },
      },
      {
        path: "property-boost-orders",
        name: "propertyBoostOrders",
        component: ListingBoostOrderView,
        meta: {
          requiresAuth: true,
          permission: `${featureSeven}.index`,
          sidebar: false,
          label: "sidebar.propertyBoostOrders",
          icon: "pi pi-briefcase",
        },
      },
    ],
  },
  //Own Licenses
  {
    path: "/setting/own-licenses/new",
    name: "ownLicense-new",
    component: OwnLicenseFormView,
    meta: {
      requiresAuth: true,
      permission: `${featureOne}.store`,
    },
  },
  {
    path: "/setting/own-licenses/edit/:id",
    name: "ownLicense-edit",
    component: OwnLicenseFormView,
    props: true,
    meta: {
      requiresAuth: true,
      permission: `${featureOne}.edit`,
    },
  },
  {
    path: "/setting/own-licenses/view/:id",
    name: "ownLicense-view",
    component: OwnLicenseFormView,
    props: true,
    meta: {
      requiresAuth: true,
      permission: `${featureOne}.show`,
    },
  },

  //Roles
  {
    path: "/setting/roles/new",
    name: "role-new",
    component: RoleFormView,
    meta: {
      requiresAuth: true,
      permission: `${featureFour}.store`,
    },
  },
  {
    path: "/setting/roles/edit/:id",
    name: "role-edit",
    component: RoleFormView,
    props: true,
    meta: {
      requiresAuth: true,
      permission: `${featureFour}.edit`,
    },
  },
  {
    path: "/setting/roles/view/:id",
    name: "role-view",
    component: RoleFormView,
    props: true,
    meta: {
      requiresAuth: true,
      permission: `${featureFour}.show`,
    },
  },

  //Plans
  {
    path: "/setting/plans/new",
    name: "plan-new",
    component: PlanFormView,
    meta: {
      requiresAuth: true,
      permission: `${featureTwo}.store`,
    },
  },
  {
    path: "/setting/plans/get-by-country-and-usertype/:countryCode/:userType",
    name: "plan-edit",
    component: PlanFormView,
    props: true,
    meta: {
      requiresAuth: true,
      permission: `${featureTwo}.edit`,
    },
  },
  {
    path: "/setting/plans/get-by-country-and-usertype/:countryCode/:userType",
    name: "plan-view",
    component: PlanFormView,
    props: true,
    meta: {
      requiresAuth: true,
      permission: `${featureTwo}.show`,
    },
  },

  //Companies

  //Map Price Orders

  {
    path: "/setting/map-price-orders/view/:id",
    name: "mapPriceOrder-view",
    component: MapPriceOrderFormView,
    props: true,
    meta: {
      requiresAuth: true,
      permission: `${featureFive}.show`,
    },
  },
];
