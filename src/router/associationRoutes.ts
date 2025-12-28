import AssociationFormView from "@/views/associations/AssociationFormView.vue";
import AssociationListView from "@/views/associations/AssociationListView.vue";

const feature = "associations";

export const associationRoutes = [
  {
    path: "/associations",
    name: "associations",
    component: AssociationListView,
    meta: {
      requiresAuth: true,
      permission: `${feature}.index`,
      sidebar: true,
      label: "sidebar.estate_association",
      icon: "pi pi-user",
    },
  },

  {
    path: "/associations/new",
    name: "association-new",
    component: AssociationFormView,
    meta: {
      requiresAuth: true,
      permission: `${feature}.store`,
    },
  },
  {
    path: "/associations/edit/:id",
    name: "association-edit",
    component: AssociationFormView,
    props: true,
    meta: {
      requiresAuth: true,
      permission: `${feature}.edit`,
    },
  },
  {
    path: "/associations/view/:id",
    name: "association-view",
    component: AssociationFormView,
    props: true,
    meta: {
      requiresAuth: true,
      permission: `${feature}.show`,
    },
  },
];
