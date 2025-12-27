import ListingView from "@views/listings/ListingListView.vue";
import ListingFormView from "@views/listings/ListingFormView.vue";
import Packages from "@/views/listings/Packages.vue";

export const listingRoutes = [
  {
    path: "/properties",
    name: "listings",
    component: ListingView,
    meta: {
      requiresAuth: true,
      permission: "properties.index",
      sidebar: true,
      label: "sidebar.listings",
      icon: "pi pi-home",
    },
  },
  {
    path: "/properties/new",
    name: "listing-new",
    component: ListingFormView,
    meta: {
      requiresAuth: true,
      permission: "properties.store",
    },
  },
  {
    path: "/properties/edit/:id",
    name: "listing-edit",
    component: ListingFormView,
    props: true,
    meta: {
      requiresAuth: true,
      permission: "properties.edit",
    },
  },
  {
    path: "/properties/view/:id",
    name: "listing-view",
    component: ListingFormView,
    props: true,
    meta: {
      requiresAuth: true,
      permission: "properties.show",
    },
  },
  {
    path: "/my-info/my-listings/boost-packages/:id/:type",
    name: "boost-packages",
    component: Packages,
    props: true,
    meta: {
      requiresAuth: true,
      permission: "properties.index",
    },
  },
];
