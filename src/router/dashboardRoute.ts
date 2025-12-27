import DashboardView from "@views/DashboardView.vue";

export const dashboardRoute = [
  {
    path: "/dashboard",
    name: "dashboard",
    component: DashboardView,
    meta: {
      requiresAuth: true,
      sidebar: true,
      label: "sidebar.dashboard",
      icon: "pi pi-chart-bar",
    },
  },
];
