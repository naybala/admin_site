import { RoleForm, RoleTable } from "@/features/roles";

const feature = "roles";

export const roleRoutes = [
  {
    path: "/roles",
    name: "roles",
    component: RoleTable,
    meta: {
      requiresAuth: true,
      permission: `${feature}.index`,
      sidebar: true,
      label: "sidebar.roles",
      icon: "pi pi-gift",
    },
  },

  {
    path: "/roles/new",
    name: "role-new",
    component: RoleForm,
    meta: {
      requiresAuth: true,
      permission: `${feature}.store`,
    },
  },
  {
    path: "/roles/edit/:id",
    name: "role-edit",
    component: RoleForm,
    props: true,
    meta: {
      requiresAuth: true,
      permission: `${feature}.edit`,
    },
  },
  {
    path: "/roles/view/:id",
    name: "role-view",
    component: RoleForm,
    props: true,
    meta: {
      requiresAuth: true,
      permission: `${feature}.show`,
    },
  },
];
