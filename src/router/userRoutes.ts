import UserFormView from "@views/users/UserFormView.vue";
import UserListView from "@/views/users/UserListView.vue";
import UserSubScriptionListView from "@/views/userSubScriptions/UserSubScriptionListView.vue";

const featureOne = "users";
const featureFour = "userSubScriptions";

export const userRoutes = [
  {
    path: "/user",
    name: "users",
    meta: {
      requiresAuth: true,
      sidebar: true,
      label: "sidebar.user",
      icon: "pi pi-users",
    },

    children: [
      {
        path: "users",
        name: "normal-view",
        component: UserListView,
        meta: {
          requiresAuth: true,
          permission: `${featureOne}.index`,
          label: "sidebar.users",
          sidebar: false,
        },
      },

      {
        path: "user-subscriptions",
        name: "userSubScriptions",
        component: UserSubScriptionListView,
        meta: {
          requiresAuth: true,
          permission: `${featureFour}.index`,
          sidebar: false,
          label: "sidebar.userSubScriptions",
          icon: "pi pi-prime",
        },
      },
    ],
  },
  //Users
  {
    path: "/user/users/new",
    name: "user-new",
    component: UserFormView,
    meta: { requiresAuth: true, permission: `${featureOne}.store` },
  },
  {
    path: "/user/users/edit/:id",
    name: "user-edit",
    component: UserFormView,
    props: true,
    meta: { requiresAuth: true, permission: `${featureOne}.edit` },
  },
  {
    path: "/user/users/view/:id",
    name: "user-view",
    component: UserFormView,
    props: true,
    meta: { requiresAuth: true, permission: `${featureOne}.show` },
  },

  //Agents

  //Associations
];
