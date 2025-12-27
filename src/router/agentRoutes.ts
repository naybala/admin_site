import AgentListView from "@/views/agents/AgentListView.vue";
import AgentFormView from "@/views/agents/AgentFormView.vue";

const feature = "agents";

export const agentRoutes = [
  {
    path: "/agents",
    name: "agents",
    component: AgentListView,
    meta: {
      requiresAuth: true,
      permission: `${feature}.index`,
      sidebar: true,
      label: "sidebar.estate_agent",
      icon: "pi pi-user",
    },
  },

  {
    path: "/agents/new",
    name: "agent-new",
    component: AgentFormView,
    meta: {
      requiresAuth: true,
      permission: "agents.store",
    },
  },
  {
    path: "/agents/edit/:id",
    name: "agent-edit",
    component: AgentFormView,
    props: true,
    meta: {
      requiresAuth: true,
      permission: "agents.edit",
    },
  },
  {
    path: "/agents/view/:id",
    name: "agent-view",
    component: AgentFormView,
    props: true,
    meta: {
      requiresAuth: true,
      permission: "agents.show",
    },
  },
];
