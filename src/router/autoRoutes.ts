import AutoBranchListView from "@views/autoBranches/AutoBranchListView.vue";
import AutoBranchFormView from "@views/autoBranches/AutoBranchFormView.vue";
import AutoSubBranchFormView from "@/views/autoSubBranches/AutoSubBranchFormView.vue";
import AutoSubBranchListView from "@/views/autoSubBranches/AutoSubBranchListView.vue";
import AutoFormView from "@/views/autos/AutoFormView.vue";
import AutoListView from "@/views/autos/AutoListView.vue";

export const autoRoutes = [
  {
    path: "/auto",
    name: "autos-root",
    meta: {
      requiresAuth: true,
      sidebar: true,
      label: "sidebar.auto",
      icon: "pi pi-car",
    },

    children: [
      {
        path: "autos",
        name: "autos",
        component: AutoListView,
        meta: {
          requiresAuth: true,
          permission: "autos.index",
          label: "sidebar.autos",
          sidebar: false,
        },
      },
      {
        path: "branches",
        name: "autoBranches",
        component: AutoBranchListView,
        meta: {
          requiresAuth: true,
          permission: "autoBranches.index",
          label: "sidebar.autoBranches",
          sidebar: false,
        },
      },
      {
        path: "sub-branches",
        name: "autoSubBranches",
        component: AutoSubBranchListView,
        meta: {
          requiresAuth: true,
          permission: "autoSubBranches.index",
          label: "sidebar.autoSubBranches",
          sidebar: false,
        },
      },
    ],
  },
  // Auto Create , Edit , Update
  {
    path: "/auto/autos/new",
    name: "auto-new",
    component: AutoFormView,
    meta: {
      requiresAuth: true,
      permission: "autos.store",
    },
  },
  {
    path: "/auto/autos/edit/:id",
    name: "auto-edit",
    component: AutoFormView,
    props: true,
    meta: {
      requiresAuth: true,
      permission: "autos.edit",
    },
  },
  {
    path: "/auto/autos/view/:id",
    name: "auto-view",
    component: AutoFormView,
    props: true,
    meta: {
      requiresAuth: true,
      permission: "autos.show",
    },
  },

  // Auto Branch Create , Edit , Update
  {
    path: "/auto/branches/new",
    name: "autoBranch-new",
    component: AutoBranchFormView,
    meta: {
      requiresAuth: true,
      permission: "autoBranches.store",
    },
  },
  {
    path: "/auto/branches/edit/:id",
    name: "autoBranch-edit",
    component: AutoBranchFormView,
    props: true,
    meta: {
      requiresAuth: true,
      permission: "autoBranches.edit",
    },
  },
  {
    path: "/auto/branches/view/:id",
    name: "autoBranch-view",
    component: AutoBranchFormView,
    props: true,
    meta: {
      requiresAuth: true,
      permission: "autoBranches.show",
    },
  },

  // Auto Sub Branch Create , Edit , Update
  {
    path: "/auto/sub-branches/new",
    name: "autoSubBranch-new",
    component: AutoSubBranchFormView,
    meta: {
      requiresAuth: true,
      permission: "autoSubBranches.store",
    },
  },
  {
    path: "/auto/sub-branches/edit/:id",
    name: "autoSubBranch-edit",
    component: AutoSubBranchFormView,
    props: true,
    meta: {
      requiresAuth: true,
      permission: "autoSubBranches.edit",
    },
  },
  {
    path: "/auto-sub-branches/view/:id",
    name: "autoSubBranch-view",
    component: AutoSubBranchFormView,
    props: true,
    meta: {
      requiresAuth: true,
      permission: "autoSubBranches.show",
    },
  },
];
