import { onMounted, onUnmounted } from "vue";
import { useAuthStore } from "@stores/auth";
import { usePermissionStore } from "@stores/permission";
import { apiRequest } from "@/composables/common/useApi";
import { PermissionsResponse } from "@/types";
import { io } from "socket.io-client";

const socketUrl =
  import.meta.env.VITE_SOCKET_LOCAL_URL ?? "http://localhost:3000";
const socket = io(socketUrl);

export function usePermissionSocket() {
  const authStore = useAuthStore();
  const permissionStore = usePermissionStore();

  const handleRoleUpdate = async () => {
    if (!authStore.isAuthenticated || !authStore.userRole) return;

    try {
      const res: any = await apiRequest<PermissionsResponse>(
        `api/v1/web/roles/${authStore.userRole}`,
        { method: "GET" }
      );

      const newPermissions = res.data?.role?.permissions ?? [];
      permissionStore.setPermissions(newPermissions);

      console.log("Permissions updated via socket");
    } catch (err) {
      console.error("Failed to update permissions from socket", err);
    }
  };

  onMounted(() => {
    socket.on(`roles:update-${authStore.roleId}`, handleRoleUpdate);
  });

  onUnmounted(() => {
    socket.off(`roles:update-${authStore.roleId}`, handleRoleUpdate);
  });
}
