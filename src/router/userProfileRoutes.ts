import Index from "@/views/userProfiles/Index.vue";
import MyListing from "@/views/userProfiles/MyListing.vue";
import Packages from "@/views/userProfiles/Packages.vue";
import MyListingForm from "@/views/userProfiles/MyListingForm.vue";
import MyDashboard from "@/views/userProfiles/MyDashboard.vue";
import MyReport from "@/views/userProfiles/MyReport.vue";
import ResourceDownload from "@/views/userProfiles/ResourceDownload.vue";
import PropertyReport from "@/views/userProfiles/PropertyReport.vue";
import MyAgent from "@/views/userProfiles/MyAgent.vue";
import MyAgentForm from "@/views/userProfiles/MyAgentForm.vue";
import MyAgentAddForm from "@/views/userProfiles/MyAgentAddForm.vue";

export const userProfileRoutes = [
  {
    path: "/my-info",
    name: "my-info",
    meta: {
      requiresAuth: true,
      sidebar: true,
      label: "sidebar.myInfo",
      icon: "pi pi-user-edit",
    },

    children: [
      {
        path: "my-dashboard",
        name: "my-dashboard",
        component: MyDashboard,
        meta: {
          requiresAuth: true,
          sidebar: false,
          label: "sidebar.myDashboard",
          permission: "myDashboard.index",
          icon: "pi pi-chart-bar",
        },
      },
      {
        path: "my-profile",
        name: "my-profile",
        component: Index,
        meta: {
          requiresAuth: true,
          sidebar: false,
          label: "sidebar.myProfile",
          permission: "myProfile.index",
          icon: "pi pi-user-edit",
        },
      },
      {
        path: "my-association-members",
        name: "my-association-members",
        component: MyAgent,
        meta: {
          requiresAuth: true,
          sidebar: false,
          label: "sidebar.my_association_member",
          permission: "myAssociationMembers.index",
          icon: "pi pi-user-edit",
        },
      },

      {
        path: "my-listings",
        name: "my-listings",
        component: MyListing,
        meta: {
          requiresAuth: true,
          sidebar: false,
          label: "sidebar.myListing",
          icon: "pi pi-user-edit",
        },
      },

      {
        path: "my-packages",
        name: "my-packages",
        component: Packages,
        meta: {
          requiresAuth: true,
          sidebar: false,
          permission: "myPackages.index",
          label: "sidebar.packages",
          icon: "pi pi-user-edit",
        },
      },

      {
        path: "my-reports",
        name: "my-reports",
        component: MyReport,
        meta: {
          requiresAuth: true,
          sidebar: false,
          permission: "myReports.index",
          label: "sidebar.my_report",
          icon: "pi pi-user",
        },
      },

      {
        path: "download-resources",
        name: "download-resources",
        component: ResourceDownload,
        meta: {
          requiresAuth: true,
          sidebar: true,
          permission: "resourceAndDownloads.index",
          label: "sidebar.my_report",
          icon: "pi pi-user",
        },
      },

      {
        path: "property-report",
        name: "property-report",
        component: PropertyReport,
        meta: {
          requiresAuth: true,
          sidebar: true,
          permission: "propertyReports.index",
          label: "sidebar.property_report",
          icon: "pi pi-user",
        },
      },
    ],
  },
  //My Member
  {
    path: "/my-info/my-association-members/new",
    name: "my-association-members-new",
    component: MyAgentForm,
    props: true,
    meta: { requiresAuth: true, permission: `myAssociationMembers.store` },
  },
  {
    path: "/my-info/my-association-members/edit/:id",
    name: "my-association-members-edit",
    component: MyAgentForm,
    props: true,
    meta: { requiresAuth: true, permission: `myAssociationMembers.edit` },
  },
  {
    path: "/my-info/my-association-members/view/:id",
    name: "my-association-members-view",
    component: MyAgentForm,
    props: true,
    meta: { requiresAuth: true, permission: `myAssociationMembers.show` },
  },
  {
    path: "/my-info/my-association-members/add-existing-user",
    name: "my-association-members-add-existing-user",
    component: MyAgentAddForm,
    props: true,
    meta: {
      requiresAuth: true,
      permission: `myAssociationMembers.addExistingUser`,
    },
  },

  //My properties routes
  {
    path: "/my-info/my-listings/new",
    name: "my-listing-new",
    component: MyListingForm,
    props: true,
    meta: {
      requiresAuth: true,
      permission: "myProperties.store",
    },
  },
  {
    path: "/my-info/my-listings/edit/:id",
    name: "my-listing-edit",
    component: MyListingForm,
    props: true,
    meta: {
      requiresAuth: true,
      permission: "myProperties.edit",
    },
  },
  {
    path: "/my-info/my-listings/view/:id",
    name: "my-listing-view",
    component: MyListingForm,
    props: true,
    meta: {
      requiresAuth: true,
      permission: "myProperties.show",
    },
  },
];
