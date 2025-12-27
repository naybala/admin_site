import Index from "@/views/mapPrices/Index.vue";

export const mapPriceRoutes = [
  {
    path: "/map-prices",
    name: "map-prices",
    component: Index,
    meta: {
      requiresAuth: true,
      permission: "mapPrices.index",
      sidebar: true,
      label: "sidebar.mapPrices",
      icon: "pi pi-map",
    },
  },
];
