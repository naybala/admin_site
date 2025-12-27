<script setup lang="ts">
import { onMounted, watch, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import { usePermissionStore } from "@/stores/permission";

import { useSidebarLinks } from "@/composables/sidebar/useSidebarLinks";
import { useSidebarMenu } from "@/composables/sidebar/useSidebarMenu";
import { useSidebarIndicator } from "@/composables/sidebar/useSidebarIndicator";
import { useSidebarActions } from "@/composables/sidebar/useSidebarActions";
import UserProfile from "./UserProfile.vue";

type CustomRouteMeta = {
  sidebar?: boolean;
  label?: string;
  icon?: string;
  permission?: string;
};

const props = defineProps<{
  isOpen: boolean;
  isMobileVisible: boolean;
  userData: any;
}>();

const emit = defineEmits<{
  (e: "close-mobile"): void;
}>();

const router = useRouter();
const permissionStore = usePermissionStore();

const { sidebarLinks } = useSidebarLinks();
const { expandedMenus, toggleMenu, isMenuExpanded, isActiveBasePath } =
  useSidebarMenu();
const route = useRoute();

function getFilteredChildren(link: any) {
  return (link.children || []).filter((child: any) => {
    const meta = child.meta as any;
    return !meta.permission || permissionStore.hasPermission(meta.permission);
  });
}

function isParentActive(link: any) {
  const children = getFilteredChildren(link);

  // Case: single child flattened -> use child path
  if (children.length === 1) {
    const childPath = `${link.path}/${children[0].path}`;
    return route.path === childPath || route.path.startsWith(childPath + "/");
  }

  // Case: normal parent or multi-child menu
  if (link.children?.length) {
    return (
      route.path === link.path ||
      route.path.startsWith(link.path + "/") ||
      link.children.some((child: any) =>
        route.path.startsWith(`${link.path}/${child.path}`)
      )
    );
  }

  // Case: standalone link
  return route.path === link.path || route.path.startsWith(link.path + "/");
}

const { linkRefs, indicatorTop, indicatorHeight, updateIndicator } =
  useSidebarIndicator(() => sidebarLinks.value, isParentActive);

const { t } = useSidebarActions();

// Enhanced toggleMenu function with proper indicator update
async function handleToggleMenu(path: string) {
  toggleMenu(path);
  // Wait for DOM update after menu expansion/collapse
  await nextTick();
  updateIndicator();
}

// Watchers
watch(() => props.isOpen, updateIndicator);
watch(expandedMenus, updateIndicator);
watch(
  () => route.path,
  (newPath) => {
    const parentLink = sidebarLinks.value.find(
      (link) => newPath.startsWith(link.path + "/") || newPath !== link.path
    );
    if (parentLink && !expandedMenus.value.includes(parentLink.path)) {
      expandedMenus.value.push(parentLink.path);
    }
    // Use nextTick to ensure DOM is updated before updating indicator
    nextTick(() => {
      updateIndicator();
    });
  }
);

// Initial setup
onMounted(() => {
  const parentLink = sidebarLinks.value.find((link) =>
    route.path.startsWith(link.path + "/")
  );
  if (parentLink) {
    expandedMenus.value.push(parentLink.path);
  }
  // Use nextTick to ensure all DOM elements are rendered
  nextTick(() => {
    updateIndicator();
  });
  console.log("Animated Side Bar is Activated");
});
</script>

<template>
  <aside
    :class="[
      'bg-gray-800 dark:bg-gray-950 text-white h-screen transition-all duration-300 z-50 flex flex-col',
      props.isMobileVisible
        ? 'fixed top-0 left-0 w-64 transform translate-x-0'
        : 'fixed top-0 left-0 w-64 transform -translate-x-full',
      'md:relative md:translate-x-0 md:flex-shrink-0',
      props.isOpen ? 'md:w-64' : 'md:w-20',
    ]"
  >
    <!-- Mobile close button -->
    <div class="md:hidden flex justify-end p-2">
      <button @click="emit('close-mobile')" class="text-white">
        <i class="pi pi-times text-xl"></i>
      </button>
    </div>

    <!-- Top logo/title -->
    <div
      class="p-4 text-center font-bold text-xl border-b border-gray-700 dark:border-gray-800"
    >
      <span v-if="props.isOpen">
        <div v-if="userData">
          <UserProfile
            :userData="userData"
            class="w-36 h-36 mx-auto rounded-full"
            :isShowInfo="true"
          />
        </div>
      </span>
      <span v-else>
        <div v-if="userData">
          <UserProfile
            :userData="userData"
            class="w-10 h-10 mx-auto rounded-full"
            :isShowInfo="false"
          />
        </div>
      </span>
    </div>

    <!-- Scrollable Menu Section -->
    <div class="flex-1 overflow-y-auto relative scrollbar-hidden">
      <nav class="mt-4 relative">
        <ul class="relative">
          <!-- Sliding Active Indicator -->
          <div
            class="absolute left-0 w-full transition-all duration-500 ease-in-out z-0 sliding-indicator"
            :style="{
              transform: `translateY(${indicatorTop}px)`,
              height: `${indicatorHeight}px`,
            }"
            v-show="indicatorTop !== null && indicatorHeight > 0"
          >
            <div
              class="bg-brand-primary border-r-8 border-[#F3F4F6] dark:border-r-[#111827] w-full h-full shadow-md"
            ></div>
          </div>

          <!-- Sidebar Links -->
          <li
            v-for="(link, index) in sidebarLinks"
            :key="link.path"
            :ref="(el) => (linkRefs[index] = el)"
            class="relative z-10 menu-item"
          >
            <!-- Case 1: Flatten if there's only one visible child -->
            <template v-if="getFilteredChildren(link).length === 1">
              <div
                class="flex items-center p-4 hover:bg-brand-secondary transition-colors cursor-pointer menu-link"
                :class="[
                  {
                    'justify-center': !props.isOpen,
                    'active-parent': isParentActive(link),
                  },
                ]"
                @click="
                  router.push(
                    `${link.path}/${getFilteredChildren(link)[0].path}`
                  )
                "
              >
                <!-- Fixed width icon container -->
                <div
                  class="flex items-center justify-center w-6 h-6 flex-shrink-0"
                >
                  <i
                    :class="[
                      link.meta.icon,
                      'transition-all duration-300',
                      props.isOpen ? 'mr-3' : 'mr-0',
                    ]"
                  ></i>
                </div>
                <span
                  :class="{
                    'opacity-0 w-0': !props.isOpen,
                    'opacity-100': props.isOpen,
                  }"
                  class="flex-1 truncate transition-all duration-300"
                >
                  {{
                    t(
                      (getFilteredChildren(link)[0].meta as CustomRouteMeta)
                        .label ||
                        (link.meta as CustomRouteMeta).label ||
                        ""
                    )
                  }}
                </span>
              </div>
            </template>

            <!-- Case 2: Normal parent (no children or multiple children) -->
            <template v-else>
              <div
                class="flex items-center p-4 hover:bg-brand-secondary transition-colors cursor-pointer menu-link"
                :class="[
                  {
                    'justify-center': !props.isOpen,
                    'active-parent': isParentActive(link),
                  },
                ]"
                @click="handleToggleMenu(link.path)"
              >
                <!-- Fixed width icon container -->
                <div
                  class="flex items-center justify-center w-6 h-6 flex-shrink-0"
                >
                  <i
                    :class="[
                      link.meta.icon,
                      'transition-all duration-300',
                      props.isOpen ? 'mr-3' : 'mr-0',
                    ]"
                  ></i>
                </div>

                <span
                  :class="{
                    'opacity-0 w-0': !props.isOpen,
                    'opacity-100': props.isOpen,
                  }"
                  class="flex-1 truncate transition-all duration-300"
                >
                  {{ t((link.meta as CustomRouteMeta).label || "") }}
                </span>

                <!-- Chevron icon with fixed positioning -->
                <template
                  v-if="link.children && getFilteredChildren(link).length > 1"
                >
                  <div
                    class="flex-shrink-0 w-4 h-4 flex items-center justify-center"
                  >
                    <i
                      :class="[
                        'pi transition-transform duration-300 flex-shrink-0',
                        isMenuExpanded(link.path)
                          ? 'pi-chevron-down rotate-180'
                          : 'pi-chevron-right',
                        props.isOpen ? 'opacity-100' : 'opacity-0',
                      ]"
                    ></i>
                  </div>
                </template>

                <!-- Invisible spacer for consistent layout when collapsed -->
                <template
                  v-if="
                    link.children &&
                    getFilteredChildren(link).length > 1 &&
                    !props.isOpen
                  "
                >
                  <div
                    class="w-4 h-4 flex-shrink-0 opacity-0"
                    aria-hidden="true"
                  >
                    <i class="pi pi-chevron-right"></i>
                  </div>
                </template>
              </div>

              <!-- Nested submenu with smooth height transition -->
              <div
                v-if="
                  link.children &&
                  getFilteredChildren(link).length > 1 &&
                  props.isOpen
                "
                class="overflow-hidden transition-all duration-300 nested-menu-container"
                :class="{
                  'max-h-0': !isMenuExpanded(link.path),
                  'max-h-96': isMenuExpanded(link.path),
                }"
              >
                <ul class="pl-8 bg-[#1F2937] dark:bg-[#030712]">
                  <li
                    v-for="child in getFilteredChildren(link)"
                    :key="child.path"
                    class="hover:bg-brand-secondary cursor-pointer mt-1 transition-colors"
                  >
                    <RouterLink
                      :to="`${link.path}/${child.path}`"
                      class="flex items-center p-2 transition-all duration-200 menu-link"
                      :class="{
                        'active-child': isActiveBasePath(
                          `${link.path}/${child.path}`
                        ),
                      }"
                    >
                      <span>{{
                        t((child.meta as CustomRouteMeta).label || "")
                      }}</span>
                    </RouterLink>
                  </li>
                </ul>
              </div>
            </template>
          </li>
        </ul>
      </nav>
    </div>

    <!-- Footer section -->
    <div v-if="props.isOpen" class="mt-auto py-4">
      <p class="text-center text-xs text-gray-400">
        Developed By
        <a
          href="https://bigsoft.tech/"
          target="_blank"
          class="hover:text-white transition-colors"
        >
          BigSoft Technology PLC
        </a>
      </p>
      <p class="text-center text-xs text-gray-400 mt-1">version (1.0)</p>
    </div>
  </aside>
</template>

<style scoped>
/* Smooth transitions for nested menus */
ul ul {
  transition: max-height 0.3s ease-in-out;
  -webkit-transition: max-height 0.3s ease-in-out;
}

/* Rotate animation for chevron */
.rotate-180 {
  transform: rotate(180deg);
  -webkit-transform: rotate(180deg);
}

/* Remove any background color from parent menu items */
.relative.z-10 > div:first-child {
  background-color: transparent !important;
}

/* Hide scrollbar for cleaner look */
.scrollbar-hidden {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hidden::-webkit-scrollbar {
  display: none;
}

/* Chrome-specific fixes */
@media all and (-webkit-min-device-pixel-ratio: 0) and (min-resolution: 0.001dpcm) {
  /* Ensure smooth transitions in Chrome */
  .transition-all {
    -webkit-backface-visibility: hidden;
    -webkit-perspective: 1000;
    -webkit-transform-style: preserve-3d;
  }

  /* Fix for nested menu animations in Chrome */
  .overflow-hidden {
    -webkit-mask-image: -webkit-radial-gradient(white, black);
  }

  /* Fix for sliding indicator in Chrome */
  .sliding-indicator {
    -webkit-transform: translateZ(0);
  }
}

/* Cross-browser transition fixes */
.flex-shrink-0 {
  flex-shrink: 0;
  -webkit-flex-shrink: 0;
}

.transition-all {
  -webkit-transition: all 0.3s ease;
  transition: all 0.3s ease;
}

.transition-transform {
  -webkit-transition: transform 0.3s ease;
  transition: transform 0.3s ease;
}

.transition-colors {
  -webkit-transition: background-color 0.3s ease, border-color 0.3s ease,
    color 0.3s ease;
  transition: background-color 0.3s ease, border-color 0.3s ease,
    color 0.3s ease;
}

/* Fix for max-height transitions in Chrome */
.nested-menu-container {
  will-change: max-height;
}

/* Fix for opacity transitions */
.opacity-0 {
  opacity: 0;
  -webkit-opacity: 0;
}

.opacity-100 {
  opacity: 1;
  -webkit-opacity: 1;
}

/* Hardware acceleration for smoother animations */
.menu-item {
  -webkit-transform: translateZ(0);
  transform: translateZ(0);
}

.relative.z-10 {
  -webkit-transform: translateZ(0);
  transform: translateZ(0);
}

/* Fix for sliding indicator animation */
.sliding-indicator {
  -webkit-transition: transform 0.5s ease-in-out, height 0.5s ease-in-out;
  transition: transform 0.5s ease-in-out, height 0.5s ease-in-out;
  -webkit-backface-visibility: hidden;
  -webkit-perspective: 1000;
}

/* Ensure consistent box sizing */
* {
  box-sizing: border-box;
}

/* Smooth text transitions */
.text-transition {
  transition: opacity 0.3s ease, width 0.3s ease;
  -webkit-transition: opacity 0.3s ease, width 0.3s ease;
}

/* Fix for nested menu positioning */
ul ul {
  -webkit-transform: translateZ(0);
  transform: translateZ(0);
}

/* Ensure smooth indicator movement */
.transition-all.duration-500 {
  -webkit-transition: all 0.5s ease-in-out;
  transition: all 0.5s ease-in-out;
}

/* Fix for chevron rotation animation */
.pi-chevron-down.rotate-180 {
  -webkit-transform: rotate(180deg);
  transform: rotate(180deg);
}

/* Prevent flash of unstyled content */
.relative.z-10 {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Active state classes for debugging */
.active-parent {
  position: relative;
  z-index: 5;
}

.active-child {
  position: relative;
  z-index: 5;
}

/* Ensure indicator stays visible during transitions */
.sliding-indicator {
  z-index: 2;
}

.menu-link {
  position: relative;
  z-index: 10;
}
</style>
