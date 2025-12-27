import { computed } from "vue";
import { useRouter } from "vue-router";
import { usePermissionStore } from "@/stores/permission";

type CustomRouteMeta = {
  sidebar?: boolean;
  label?: any;
  icon?: string;
  permission?: string;
};

export function useSidebarLinks() {
  const router = useRouter();
  const permissionStore = usePermissionStore();

  const sidebarLinks = computed(() => {
    if (!permissionStore.ready) return [];

    return router.getRoutes().filter((r: any) => {
      const meta = r.meta as CustomRouteMeta;
      if (!meta.sidebar || r.parent) return false;

      const hasParentPermission =
        !meta.permission || permissionStore.hasPermission(meta.permission);

      const children = r.children || [];
      if (children.length === 0) return hasParentPermission;

      const filteredChildren = children.filter((child: any) => {
        const childMeta = child.meta as CustomRouteMeta;
        return (
          !childMeta.permission ||
          permissionStore.hasPermission(childMeta.permission)
        );
      });

      const allChildrenRequirePermission = children.every(
        (child: any) => !!(child.meta as CustomRouteMeta).permission
      );

      const hasAnyChildPermission = filteredChildren.length > 0;

      if (allChildrenRequirePermission && !hasAnyChildPermission) return false;

      return hasParentPermission || hasAnyChildPermission;
    });
  });

  return {
    sidebarLinks,
  };
}
