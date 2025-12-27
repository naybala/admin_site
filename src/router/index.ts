import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@stores/auth";

// Import all route modules
import { authRoutes } from "./authRoutes";
import { dashboardRoute } from "./dashboardRoute";
import { usePermissionStore } from "@stores/permission";
import { PermissionsResponse } from "@/types";
import { userRoutes } from "./userRoutes";
import { apiRequest } from "@/composables/common/useApi";
import { listingRoutes } from "./listingRoutes";
import { autoRoutes } from "./autoRoutes";
import { settingRoutes } from "./settingRoutes";
import { userProfileRoutes } from "./userProfileRoutes";
import { buyerRoutes } from "./buyerRoutes";
import { socialRoutes } from "./socialRoutes";
import { mapPriceRoutes } from "./mapPriceRoutes";
import { agentRoutes } from "./agentRoutes";
import { companyRoutes } from "./companyRoutes";
import { associationRoutes } from "./associationRoutes";
import { paymentRoutes } from "./paymentRoutes";
import { userGuideRoutes } from "./userGuideRoutes";

// Combine all routes
const routes = [
  {
    path: "/",
    redirect: "/login",
  },
  ...userProfileRoutes,
  ...dashboardRoute,
  ...associationRoutes,
  ...agentRoutes,
  ...companyRoutes,
  ...listingRoutes,
  ...buyerRoutes,
  ...mapPriceRoutes,
  ...userGuideRoutes,
  ...authRoutes,
  ...userRoutes,
  ...autoRoutes,
  ...socialRoutes,
  ...settingRoutes,
  ...paymentRoutes,
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Global auth guard
router.beforeEach(async (to, _, next) => {
  const authStore = useAuthStore();
  const permissionStore = usePermissionStore();
  const permissionRequired = to.meta.permission as string | undefined;
  const token = authStore.token;
  // If route requires authentication and no token, redirect to login
  if (to.meta.requiresAuth && !token) {
    return next({ path: "/login", query: { redirect: to.fullPath } });
  }

  // If authenticated and permission data is not loaded, fetch it
  if (
    to.meta.requiresAuth &&
    authStore.isAuthenticated &&
    !permissionStore.ready
  ) {
    // Fetch permissions from the API
    try {
      const res: any = await apiRequest<PermissionsResponse>(
        `api/v1/web/roles/${authStore.userRole}`,
        {
          method: "GET",
        }
      );
      permissionStore.setPermissions(res.data?.role?.permissions);
    } catch (err) {
      console.error("Failed to fetch permissions:", err);
      return next("/unauthorized");
    }
  }
  // If route requires specific permission and user lacks it
  if (
    permissionRequired &&
    !permissionStore.hasPermission(permissionRequired)
  ) {
    return next("/unauthorized");
  }
  return next(); // All good
});

export default router;
