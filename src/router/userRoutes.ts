import { UserForm, UserTable } from "@/features/users";

const feature = "users";

export const userRoutes = [
  {
    path: "/users",
    name: "users",
    component: UserTable,
    meta: {
      requiresAuth: true,
      permission: `${feature}.index`,
      sidebar: true,
      label: "sidebar.users",
      icon: "pi pi-users",
    },
  },
  {
    path: "/users/new",
    name: "user-new",
    component: UserForm,
    meta: {
      requiresAuth: true,
      permission: `${feature}.store`,
    },
  },
  {
    path: "/users/edit/:id",
    name: "user-edit",
    component: UserForm,
    props: true,
    meta: {
      requiresAuth: true,
      permission: `${feature}.edit`,
    },
  },
  {
    path: "/users/view/:id",
    name: "user-view",
    component: UserForm,
    props: true,
    meta: {
      requiresAuth: true,
      permission: `${feature}.show`,
    },
  },
];
