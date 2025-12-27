import { ref } from "vue";
import { useRoute } from "vue-router";

export function useSidebarMenu() {
  const expandedMenus = ref<string[]>([]);
  const route = useRoute();

  const toggleMenu = (path: string) => {
    if (expandedMenus.value.includes(path)) {
      expandedMenus.value = expandedMenus.value.filter((p) => p !== path);
    } else {
      expandedMenus.value = [path];
    }
  };

  const isMenuExpanded = (path: string) => {
    return expandedMenus.value.includes(path);
  };

  const isActiveBasePath = (basePath: string) => {
    const normalizedBase = basePath.replace(/\/$/, "");
    const current = route.path.replace(/\/$/, "");

    // exact match or child path
    return (
      current === normalizedBase || current.startsWith(normalizedBase + "/")
    );
  };

  return {
    expandedMenus,
    toggleMenu,
    isMenuExpanded,
    isActiveBasePath,
  };
}
