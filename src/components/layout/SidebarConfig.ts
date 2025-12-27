export const DeveloperSidebarConfig: any = [
  //Dashboard
  {
    path: "/dashboard",
    meta: {
      label: "sidebar.dashboard",
      icon: "pi pi-chart-bar",
    },
  },

  //Associations
  {
    path: "/associations",
    meta: {
      label: "sidebar.estate_association",
      icon: "pi pi-building",
    },
  },

  //Companies
  {
    path: "/companies",
    meta: {
      label: "sidebar.estate_company",
      icon: "pi pi-microsoft",
    },
  },

  //Agents
  {
    path: "/agents",
    meta: {
      label: "sidebar.estate_agent",
      icon: "pi pi-user",
    },
  },

  //Property Listing
  {
    path: "/properties",
    name: "listings",
    meta: {
      label: "sidebar.listings",
      icon: "pi pi-home",
    },
  },

  //Buyers
  {
    path: "/buyers",
    meta: {
      label: "sidebar.estate_buyer",
      icon: "pi pi-filter-fill",
    },
  },

  //My Profile
  {
    path: "/my-info/my-profile",
    meta: {
      label: "sidebar.my_profile",
      icon: "pi pi-user",
    },
  },

  //All User

  {
    path: "/user",
    meta: {
      label: "sidebar.user",
      icon: "pi pi-users",
    },
    children: [
      {
        path: "users",
        meta: {
          label: "sidebar.users",
        },
      },

      {
        path: "user-subscriptions",
        meta: {
          label: "sidebar.userSubScriptions",
        },
      },
    ],
  },

  //My Listing
  {
    path: "/my-info/my-listings",
    meta: {
      label: "sidebar.my_listing",
      icon: "pi pi-home",
    },
  },

  //My Report
  {
    path: "/my-info/my-reports",
    meta: {
      label: "sidebar.my_report",
      icon: "pi pi-barcode",
    },
  },

  //Autos
  {
    path: "/auto",
    meta: {
      label: "sidebar.auto",
      icon: "pi pi-car",
    },
    children: [
      {
        path: "autos",
        meta: {
          label: "sidebar.autos",
        },
      },
      {
        path: "branches",
        meta: {
          label: "sidebar.autoBranches",
        },
      },
      {
        path: "sub-branches",
        meta: {
          label: "sidebar.autoSubBranches",
        },
      },
    ],
  },

  //Map Price
  {
    path: "/map-prices",
    meta: {
      label: "sidebar.mapPrices",
      icon: "pi pi-map",
    },
  },

  //Resources and Download
  // {
  //   path: "/my-info/download-resources",
  //   meta: {
  //     label: "sidebar.resource_download",
  //     icon: "pi pi-file",
  //   },
  // },

  //Property Report
  // {
  //   path: "/my-info/property-report",
  //   meta: {
  //     label: "sidebar.property_report",
  //     icon: "pi pi-file-arrow-up",
  //   },
  // },

  //Setting
  {
    path: "/setting",
    meta: {
      label: "sidebar.settings",
      icon: "pi pi-cog",
    },
    children: [
      {
        path: "own-licenses",
        meta: {
          label: "sidebar.ownLicenses",
        },
      },
      {
        path: "plans",
        meta: {
          label: "sidebar.plans",
        },
      },
      {
        path: "roles",
        meta: {
          label: "sidebar.roles",
        },
      },
      {
        path: "map-price-orders",
        meta: {
          label: "sidebar.mapPriceOrders",
        },
      },
    ],
  },

  //Social
  {
    path: "/social",
    meta: {
      label: "sidebar.social",
      icon: "pi pi-megaphone",
    },
    children: [
      {
        path: "news",
        meta: {
          label: "sidebar.news",
          icon: "pi pi-microchip",
        },
      },
      {
        path: "videos",
        meta: {
          label: "sidebar.videos",
          icon: "pi pi-sitemap",
        },
      },
      {
        path: "social-audios",
        meta: {
          label: "sidebar.socialAudios",
          icon: "pi pi-prime",
        },
      },
      {
        path: "social-categories",
        meta: {
          label: "sidebar.socialCategories",
          icon: "pi pi-prime",
        },
      },
      {
        path: "artists",
        meta: {
          label: "sidebar.artists",
          icon: "pi pi-prime",
        },
      },
    ],
  },
];

export const AssociationSidebarConfig: any = [
  //Dashboard
  {
    path: "/dashboard",
    meta: {
      label: "sidebar.dashboard",
      icon: "pi pi-chart-bar",
    },
  },
  //Associations
  {
    path: "/associations",
    meta: {
      label: "sidebar.estate_association",
      icon: "pi pi-building",
    },
  },
  //Companies
  {
    path: "/companies",
    meta: {
      label: "sidebar.estate_company",
      icon: "pi pi-microsoft",
    },
  },
  //Agents
  {
    path: "/agents",
    meta: {
      label: "sidebar.estate_agent",
      icon: "pi pi-user",
    },
  },

  //Property Listing
  {
    path: "/properties",
    name: "listings",
    meta: {
      label: "sidebar.listings",
      icon: "pi pi-home",
    },
  },

  //Buyers
  {
    path: "/buyers",
    meta: {
      label: "sidebar.estate_buyer",
      icon: "pi pi-filter-fill",
    },
  },

  //My Profile
  {
    path: "/my-info/my-profile",
    meta: {
      label: "sidebar.my_profile",
      icon: "pi pi-user",
    },
  },

  //My Listing
  {
    path: "/my-info/my-listings",
    meta: {
      label: "sidebar.my_listing",
      icon: "pi pi-home",
    },
  },

  //My Association Member
  {
    path: "/my-info/my-association-members",
    meta: {
      label: "sidebar.my_association_member",
      icon: "pi pi-user-edit",
    },
  },

  //My Report
  {
    path: "/my-info/my-reports",
    meta: {
      label: "sidebar.my_report",
      icon: "pi pi-barcode",
    },
  },

  //Map Price
  {
    path: "/map-prices",
    meta: {
      label: "sidebar.mapPrices",
      icon: "pi pi-map",
    },
  },

  //Resources and Download
  // {
  //   path: "/my-info/download-resources",
  //   meta: {
  //     label: "sidebar.resource_download",
  //     icon: "pi pi-file",
  //   },
  //},

  //Property Report
  // {
  //   path: "/my-info/property-report",
  //   meta: {
  //     label: "sidebar.property_report",
  //     icon: "pi pi-file-arrow-up",
  //   },
  // },
];

export const CompanySidebarConfig: any = [
  //Dashboard
  {
    path: "/dashboard",
    meta: {
      label: "sidebar.dashboard",
      icon: "pi pi-chart-bar",
    },
  },

  //Associations
  {
    path: "/associations",
    meta: {
      label: "sidebar.estate_association",
      icon: "pi pi-building",
    },
  },

  //Companies
  {
    path: "/companies",
    meta: {
      label: "sidebar.estate_company",
      icon: "pi pi-microsoft",
    },
  },

  //Agents
  {
    path: "/agents",
    meta: {
      label: "sidebar.estate_agent",
      icon: "pi pi-user",
    },
  },

  //Property Listing
  {
    path: "/properties",
    name: "listings",
    meta: {
      label: "sidebar.listings",
      icon: "pi pi-home",
    },
  },

  //Buyers
  {
    path: "/buyers",
    meta: {
      label: "sidebar.estate_buyer",
      icon: "pi pi-filter-fill",
    },
  },

  //My Profile
  {
    path: "/my-info/my-profile",
    meta: {
      label: "sidebar.my_profile",
      icon: "pi pi-user",
    },
  },

  //My Listing
  {
    path: "/my-info/my-listings",
    meta: {
      label: "sidebar.my_listing",
      icon: "pi pi-home",
    },
  },

  //My Association Member
  {
    path: "/my-info/my-association-members",
    meta: {
      label: "sidebar.my_agents",
      icon: "pi pi-user-edit",
    },
  },

  //My Report
  {
    path: "/my-info/my-reports",
    meta: {
      label: "sidebar.my_report",
      icon: "pi pi-barcode",
    },
  },

  //Map Price
  {
    path: "/map-prices",
    meta: {
      label: "sidebar.mapPrices",
      icon: "pi pi-map",
    },
  },

  //Resources and Download
  // {
  //   path: "/my-info/download-resources",
  //   meta: {
  //     label: "sidebar.resource_download",
  //     icon: "pi pi-file",
  //   },
  // },

  //Property Report
  // {
  //   path: "/my-info/property-report",
  //   meta: {
  //     label: "sidebar.property_report",
  //     icon: "pi pi-file-arrow-up",
  //   },
  // },
];

export const AgentSidebarConfig: any = [
  //Dashboard
  {
    path: "/dashboard",
    meta: {
      label: "sidebar.dashboard",
      icon: "pi pi-chart-bar",
    },
  },

  //Associations
  {
    path: "/associations",
    meta: {
      label: "sidebar.estate_association",
      icon: "pi pi-building",
    },
  },

  //Companies
  {
    path: "/companies",
    meta: {
      label: "sidebar.estate_company",
      icon: "pi pi-microsoft",
    },
  },

  //Agents
  {
    path: "/agents",
    meta: {
      label: "sidebar.estate_agent",
      icon: "pi pi-user",
    },
  },

  //Property Listing
  {
    path: "/properties",
    name: "listings",
    meta: {
      label: "sidebar.listings",
      icon: "pi pi-home",
    },
  },

  //Buyers
  {
    path: "/buyers",
    meta: {
      label: "sidebar.estate_buyer",
      icon: "pi pi-filter-fill",
    },
  },

  //My Profile
  {
    path: "/my-info/my-profile",
    meta: {
      label: "sidebar.my_profile",
      icon: "pi pi-user",
    },
  },

  //My Listing
  {
    path: "/my-info/my-listings",
    meta: {
      label: "sidebar.my_listing",
      icon: "pi pi-home",
    },
  },

  //My Report
  {
    path: "/my-info/my-reports",
    meta: {
      label: "sidebar.my_report",
      icon: "pi pi-barcode",
    },
  },

  //Map Price
  {
    path: "/map-prices",
    meta: {
      label: "sidebar.mapPrices",
      icon: "pi pi-map",
    },
  },

  //Resources and Download
  // {
  //   path: "/my-info/download-resources",
  //   meta: {
  //     label: "sidebar.resource_download",
  //     icon: "pi pi-file",
  //   },
  // },

  //Property Report
  // {
  //   path: "/my-info/property-report",
  //   meta: {
  //     label: "sidebar.property_report",
  //     icon: "pi pi-file-arrow-up",
  //   },
  // },
];

export const FreeMemberSidebarConfig: any = [
  //Dashboard
  {
    path: "/dashboard",
    meta: {
      label: "sidebar.dashboard",
      icon: "pi pi-chart-bar",
    },
  },

  //Associations
  {
    path: "/associations",
    meta: {
      label: "sidebar.estate_association",
      icon: "pi pi-building",
    },
  },

  //Companies
  {
    path: "/companies",
    meta: {
      label: "sidebar.estate_company",
      icon: "pi pi-microsoft",
    },
  },

  //Agents
  {
    path: "/agents",
    meta: {
      label: "sidebar.estate_agent",
      icon: "pi pi-user",
    },
  },

  //Property Listing
  {
    path: "/properties",
    name: "listings",
    meta: {
      label: "sidebar.listings",
      icon: "pi pi-home",
    },
  },

  //Buyers
  {
    path: "/buyers",
    meta: {
      label: "sidebar.estate_buyer",
      icon: "pi pi-filter-fill",
    },
  },

  //My Profile
  {
    path: "/my-info/my-profile",
    meta: {
      label: "sidebar.my_profile",
      icon: "pi pi-user",
    },
  },

  //My Listing
  {
    path: "/my-info/my-listings",
    meta: {
      label: "sidebar.my_listing",
      icon: "pi pi-home",
    },
  },

  //My Report
  {
    path: "/my-info/my-reports",
    meta: {
      label: "sidebar.my_report",
      icon: "pi pi-barcode",
    },
  },

  //Map Price
  {
    path: "/map-prices",
    meta: {
      label: "sidebar.mapPrices",
      icon: "pi pi-map",
    },
  },

  //Resources and Download
  // {
  //   path: "/my-info/download-resources",
  //   meta: {
  //     label: "sidebar.resource_download",
  //     icon: "pi pi-file",
  //   },
  // },

  //Property Report
  // {
  //   path: "/my-info/property-report",
  //   meta: {
  //     label: "sidebar.property_report",
  //     icon: "pi pi-file-arrow-up",
  //   },
  // },
];
