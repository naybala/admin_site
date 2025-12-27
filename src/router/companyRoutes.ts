import CompanyFormView from "@/views/companies/CompanyFormView.vue";
import CompanyListView from "@/views/companies/CompanyListView.vue";

const feature = "companies";

export const companyRoutes = [
  {
    path: "/companies",
    name: "companies",
    component: CompanyListView,
    meta: {
      requiresAuth: true,
      permission: `${feature}.index`,
      sidebar: true,
      label: "sidebar.estate_company",
      icon: "pi pi-user",
    },
  },

  {
    path: "/companies/new",
    name: "company-new",
    component: CompanyFormView,
    meta: {
      requiresAuth: true,
      permission: `${feature}.store`,
    },
  },
  {
    path: "/companies/edit/:id",
    name: "company-edit",
    component: CompanyFormView,
    props: true,
    meta: {
      requiresAuth: true,
      permission: `${feature}.edit`,
    },
  },
  {
    path: "/companies/view/:id",
    name: "company-view",
    component: CompanyFormView,
    props: true,
    meta: {
      requiresAuth: true,
      permission: `${feature}.show`,
    },
  },
];
