import BuyerListView from "@views/buyers/BuyerListView.vue";
import BuyerFormView from "@views/buyers/BuyerFormView.vue";

export const buyerRoutes = [
  {
    path: "/buyers",
    name: "buyers",
    component: BuyerListView,
    meta: {
      requiresAuth: true,
      permission: "buyers.index",
      sidebar: true,
      label: "sidebar.estate_buyer",
      icon: "pi pi-filter-fill",
    },
  },
  {
    path: "/buyers/new",
    name: "buyer-new",
    component: BuyerFormView,
    meta: {
      requiresAuth: true,
      permission: "buyers.store",
    },
  },
  {
    path: "/buyers/edit/:id",
    name: "buyer-edit",
    component: BuyerFormView,
    props: true,
    meta: {
      requiresAuth: true,
      permission: "buyers.edit",
    },
  },
  {
    path: "/buyers/view/:id",
    name: "buyer-view",
    component: BuyerFormView,
    props: true,
    meta: {
      requiresAuth: true,
      permission: "buyers.show",
    },
  },
];
