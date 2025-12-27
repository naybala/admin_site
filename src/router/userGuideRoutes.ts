import UserGuideListView from "@views/userGuides/UserGuideListView.vue";
import UserGuideFormView from "@views/userGuides/UserGuideFormView.vue";

export const userGuideRoutes = [
  {
    path: "/user-guides",
    name: "userGuides",
    component: UserGuideListView,
    meta: {
      requiresAuth: true,
      permission: "userGuides.index",
      sidebar: true,
      label: "sidebar.userGuides",
      icon: "pi pi-wrench",
    },
  },
  {
    path: "/user-guides/new",
    name: "userGuide-new",
    component: UserGuideFormView,
    meta: {
      requiresAuth: true,
      permission: "userGuides.store",
    },
  },
  {
    path: "/user-guides/edit/:id",
    name: "userGuide-edit",
    component: UserGuideFormView,
    props: true,
    meta: {
      requiresAuth: true,
      permission: "userGuides.edit",
    },
  },
  {
    path: "/user-guides/view/:id",
    name: "userGuide-view",
    component: UserGuideFormView,
    props: true,
    meta: {
      requiresAuth: true,
      permission: "userGuides.show",
    },
  },
];
