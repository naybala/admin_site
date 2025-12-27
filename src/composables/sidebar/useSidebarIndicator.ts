import { ref, nextTick } from "vue";
import type { RouteRecordRaw } from "vue-router";

export function useSidebarIndicator(
  sidebarLinks: () => RouteRecordRaw[],
  isParentActive: (link: RouteRecordRaw) => boolean
) {
  const linkRefs = ref<any[]>([]);
  const indicatorTop = ref<number | null>(null);
  const indicatorHeight = ref<number>(0);

  const updateIndicator = () => {
    nextTick(() => {
      const index = sidebarLinks().findIndex((link) => {
        return isParentActive(link);
      });

      if (index !== -1 && linkRefs.value[index]) {
        const el = linkRefs.value[index] as HTMLElement;
        const rect = el.getBoundingClientRect();
        const containerRect = el.parentElement?.getBoundingClientRect();

        if (containerRect) {
          indicatorTop.value = rect.top - containerRect.top;
          indicatorHeight.value = rect.height;
        }
      } else {
        indicatorTop.value = null;
      }
    });
  };

  return {
    linkRefs,
    indicatorTop,
    indicatorHeight,
    updateIndicator,
  };
}
