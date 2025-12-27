import SocialCategoryListView from "@views/socialCategories/SocialCategoryListView.vue";
import SocialCategoryFormView from "@views/socialCategories/SocialCategoryFormView.vue";

export const socialCategoryRoutes = [
  {
    path: "/social-categories",
    name: "socialCategories",
    component: SocialCategoryListView,
    meta: {
      requiresAuth: true,
      permission: "socialCategories.index",
      sidebar: true,
      label: "sidebar.socialCategories",
      icon: "pi pi-prime",
    },
  },
  {
    path: "/social-categories/new",
    name: "socialCategory-new",
    component: SocialCategoryFormView,
    meta: {
      requiresAuth: true,
      permission: "socialCategories.store",
    },
  },
  {
    path: "/social-categories/edit/:id",
    name: "socialCategory-edit",
    component: SocialCategoryFormView,
    props: true,
    meta: {
      requiresAuth: true,
      permission: "socialCategories.edit",
    },
  },
  {
    path: "/social-categories/view/:id",
    name: "socialCategory-view",
    component: SocialCategoryFormView,
    props: true,
    meta: {
      requiresAuth: true,
      permission: "socialCategories.show",
    },
  },
];
