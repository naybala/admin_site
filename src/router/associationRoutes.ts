import { AssociationForm, AssociationTable } from "@/features/associations";

const feature = "associations";

export const associationRoutes = [
  {
    path: "/associations",
    name: "associations",
    component: AssociationTable,
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
    component: AssociationForm,
    meta: {
      requiresAuth: true,
      permission: `${feature}.store`,
    },
  },
  {
    path: "/associations/edit/:id",
    name: "association-edit",
    component: AssociationForm,
    props: true,
    meta: {
      requiresAuth: true,
      permission: `${feature}.edit`,
    },
  },
  {
    path: "/associations/view/:id",
    name: "association-view",
    component: AssociationForm,
    props: true,
    meta: {
      requiresAuth: true,
      permission: `${feature}.show`,
    },
  },
];
