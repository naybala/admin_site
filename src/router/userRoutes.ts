import UserFormView from "@/views/users/UserFormView.vue";
import UserListView from "@/views/users/UserListView.vue";

const feature = "users";

export const userRoutes = [
  {
    path: "/users",
    name: "users",
    component: UserListView,
    meta: {
      requiresAuth: true,
      permission: `${feature}.index`,
      sidebar: true,
      label: "sidebar.users",
      icon: "pi pi-user-plus",
    },
  },

  {
    path: "/users/new",
    name: "user-new",
    component: UserFormView,
    meta: {
      requiresAuth: true,
      permission: `${feature}.store`,
    },
  },
  {
    path: "/users/edit/:id",
    name: "user-edit",
    component: UserFormView,
    props: true,
    meta: {
      requiresAuth: true,
      permission: `${feature}.edit`,
    },
  },
  {
    path: "/users/view/:id",
    name: "user-view",
    component: UserFormView,
    props: true,
    meta: {
      requiresAuth: true,
      permission: `${feature}.show`,
    },
  },
];
