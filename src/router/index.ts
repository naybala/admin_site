import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@stores/auth";

// Import all route modules
import { authRoutes } from "./authRoutes";
import { dashboardRoute } from "./dashboardRoute";
import { usePermissionStore } from "@stores/permission";
import { PermissionsResponse } from "@/types";
import { apiRequest } from "@/composables/common/useApi";
import { associationRoutes } from "./associationRoutes";

// Combine all routes
const routes = [
  {
    path: "/",
    redirect: "/login",
  },
  ...dashboardRoute,
  ...authRoutes,
  ...associationRoutes,
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
