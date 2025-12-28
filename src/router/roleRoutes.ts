import RoleFormView from "@/views/roles/RoleFormView.vue";
import RoleListView from "@/views/roles/RoleListView.vue";

const feature = "roles";

export const roleRoutes = [
  {
    path: "/roles",
    name: "roles",
    component: RoleListView,
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
    component: RoleFormView,
    meta: {
      requiresAuth: true,
      permission: `${feature}.store`,
    },
  },
  {
    path: "/roles/edit/:id",
    name: "role-edit",
    component: RoleFormView,
    props: true,
    meta: {
      requiresAuth: true,
      permission: `${feature}.edit`,
    },
  },
  {
    path: "/roles/view/:id",
    name: "role-view",
    component: RoleFormView,
    props: true,
    meta: {
      requiresAuth: true,
      permission: `${feature}.show`,
    },
  },
];
