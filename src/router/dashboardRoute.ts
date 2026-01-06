import { Dashboard } from "@/features/dashboard";

export const dashboardRoute = [
  {
    path: "/dashboard",
    name: "dashboard",
    component: Dashboard,
    meta: {
      requiresAuth: true,
      sidebar: true,
      label: "sidebar.dashboard",
      icon: "pi pi-th-large",
    },
  },
];
