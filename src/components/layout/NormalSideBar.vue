<script setup lang="ts">
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { usePermissionStore } from "@stores/permission";

import UserProfile from "./UserProfile.vue";

const props = defineProps<{
  isOpen: boolean;
  isMobileVisible: boolean;
  userData: any;
}>();

const emit = defineEmits<{
  (e: "close-mobile"): void;
}>();

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const permissionStore = usePermissionStore();

type CustomRouteMeta = {
  sidebar?: boolean;
  label?: any;
  icon?: string;
  permission?: string;
};
console.log("Normal Side Bar is Activated");

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

const expandedMenus = ref<string[]>([]);

function toggleMenu(path: string) {
  if (expandedMenus.value.includes(path)) {
    expandedMenus.value = expandedMenus.value.filter((p) => p !== path);
  } else {
    expandedMenus.value.push(path);
  }
}

function isMenuExpanded(path: string) {
  return expandedMenus.value.includes(path);
}

function isActiveBasePath(basePath: string) {
  return route.path.startsWith(basePath);
}

function isParentActive(link: (typeof sidebarLinks.value)[0]) {
  return route.path === link.path || route.path.startsWith(link.path + "/");
}

function getFilteredChildren(link: (typeof sidebarLinks.value)[0]) {
  return (link.children || []).filter((child) => {
    const meta = child.meta as CustomRouteMeta;
    return !meta.permission || permissionStore.hasPermission(meta.permission);
  });
}

const myInfoLinks = computed(() =>
  sidebarLinks.value.filter(
    (l) => (l.meta as CustomRouteMeta).label === "sidebar.myInfo"
  )
);
const otherLinks = computed(() =>
  sidebarLinks.value.filter(
    (l) => (l.meta as CustomRouteMeta).label !== "sidebar.myInfo"
  )
);
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
      class="p-1 md:p-4 text-center font-bold text-xl border-b border-gray-700 dark:border-gray-800"
    >
      <span v-if="props.isOpen">
        <div v-if="userData">
          <UserProfile
            :userData="userData"
            class="md:w-36 md:h-36 w-20 h-20 mx-auto rounded-full"
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
    <div class="flex-1 overflow-y-auto scrollbar-hidden">
      <nav class="mt-4">
        <!-- Block 1: My Info -->
        <ul v-if="myInfoLinks.length > 0" class="mb-4">
          <li v-for="link in myInfoLinks" :key="link.path" class="relative">
            <template v-if="getFilteredChildren(link).length === 1">
              <!-- If the menu has exactly one visible child, show it directly -->
              <div
                class="flex items-center px-4 py-3 hover:bg-brand-secondary transition-colors cursor-pointer"
                :class="[
                  {
                    'justify-center': !props.isOpen,
                    'bg-brand-primary border-l-8 border-brand-secondary':
                      isActiveBasePath(
                        `${link.path}/${getFilteredChildren(link)[0].path}`
                      ),
                  },
                ]"
                @click="
                  router.push(
                    `${link.path}/${getFilteredChildren(link)[0].path}`
                  )
                "
              >
                <i
                  :class="[
                    link.meta.icon,
                    'flex-shrink-0 transition-all duration-300',
                    props.isOpen ? 'mr-3' : 'mr-0',
                  ]"
                ></i>
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

            <template v-else>
              <!-- Normal parent menu (multiple children or none) -->
              <div
                class="flex items-center px-4 py-3 hover:bg-brand-secondary transition-colors cursor-pointer"
                :class="[
                  {
                    'justify-center': !props.isOpen,
                    'bg-brand-primary border-l-8 border-brand-secondary':
                      isParentActive(link),
                  },
                ]"
                @click="
                  link.children && link.children.length
                    ? toggleMenu(link.path)
                    : router.push(link.path)
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
                          ? 'pi-chevron-down'
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

              <!-- Nested submenu (only if more than one child) -->
              <div
                v-if="
                  link.children &&
                  getFilteredChildren(link).length > 1 &&
                  props.isOpen
                "
                class="overflow-hidden transition-all duration-300"
                :class="{
                  'max-h-0': !isMenuExpanded(link.path),
                  'max-h-96': isMenuExpanded(link.path),
                }"
              >
                <ul class="pl-8">
                  <li
                    v-for="child in getFilteredChildren(link)"
                    :key="child.path"
                    class="hover:bg-brand-secondary cursor-pointer mt-1 rounded-l-lg"
                  >
                    <RouterLink
                      :to="`${link.path}/${child.path}`"
                      class="flex items-center p-2"
                      :class="{
                        'bg-brand-primary border-l-8 border-brand-secondary':
                          isActiveBasePath(`${link.path}/${child.path}`),
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

        <!-- Block 2: Other Links -->

        <ul v-if="otherLinks.length > 0" class="mb-4">
          <li v-for="link in otherLinks" :key="link.path" class="relative">
            <template v-if="getFilteredChildren(link).length === 1">
              <!-- If the menu has exactly one visible child, show it directly -->
              <div
                class="flex items-center px-4 py-3 hover:bg-brand-secondary transition-colors cursor-pointer"
                :class="[
                  {
                    'justify-center': !props.isOpen,
                    'bg-brand-primary border-l-8 border-brand-secondary':
                      isActiveBasePath(
                        `${link.path}/${getFilteredChildren(link)[0].path}`
                      ),
                  },
                ]"
                @click="
                  router.push(
                    `${link.path}/${getFilteredChildren(link)[0].path}`
                  )
                "
              >
                <i
                  :class="[
                    link.meta.icon,
                    'flex-shrink-0 transition-all duration-300',
                    props.isOpen ? 'mr-3' : 'mr-0',
                  ]"
                ></i>
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

            <template v-else>
              <!-- Normal parent menu (multiple children or none) -->
              <div
                class="flex items-center px-4 py-3 hover:bg-brand-secondary transition-colors cursor-pointer"
                :class="[
                  {
                    'justify-center': !props.isOpen,
                    'bg-brand-primary border-l-8 border-brand-secondary':
                      isParentActive(link),
                  },
                ]"
                @click="
                  link.children && link.children.length
                    ? toggleMenu(link.path)
                    : router.push(link.path)
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
                          ? 'pi-chevron-down'
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

              <!-- Nested submenu (only if more than one child) -->
              <div
                v-if="
                  link.children &&
                  getFilteredChildren(link).length > 1 &&
                  props.isOpen
                "
                class="overflow-hidden transition-all duration-300"
                :class="{
                  'max-h-0': !isMenuExpanded(link.path),
                  'max-h-96': isMenuExpanded(link.path),
                }"
              >
                <ul class="pl-8">
                  <li
                    v-for="child in getFilteredChildren(link)"
                    :key="child.path"
                    class="hover:bg-brand-secondary cursor-pointer mt-1 rounded-l-lg"
                  >
                    <RouterLink
                      :to="`${link.path}/${child.path}`"
                      class="flex items-center p-2"
                      :class="{
                        'bg-brand-primary border-l-8 border-brand-secondary':
                          isActiveBasePath(`${link.path}/${child.path}`),
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
          <br />
        </ul>
      </nav>
    </div>
    <div v-if="props.isOpen">
      <p class="text-center text-xs text-gray-400">
        Developed By
        <a href="https://bigsoft.tech/" target="_blank"
          >BigSoft Technology PLC</a
        >
      </p>
      <p class="text-center text-xs text-gray-400">version (1.0)</p>
    </div>
  </aside>
</template>

<style scoped>
/* Animate left border for active links */
@keyframes slide-in-left-border {
  0% {
    border-left-width: 0;
    background-color: transparent;
  }
  100% {
    border-left-width: 8px;
    background-color: theme("colors.brand-primary");
  }
}

.animate-active {
  animation: slide-in-left-border 0.3s ease-out forwards;
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
.overflow-hidden {
  will-change: max-height;
}

/* Ensure proper rendering of borders in Chrome */
/* .border-l-8 {
  -webkit-border-before-width: 8px;
  border-left-width: 8px;
} */

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
.relative {
  -webkit-transform: translateZ(0);
  transform: translateZ(0);
}

/* Fix for nested menu positioning */
ul ul {
  -webkit-transform: translateZ(0);
  transform: translateZ(0);
}

/* Ensure consistent box sizing */
* {
  box-sizing: border-box;
}

/* Smooth transitions for nested menus */
.nested-menu-enter-active,
.nested-menu-leave-active {
  transition: all 0.3s ease;
  -webkit-transition: all 0.3s ease;
}

.nested-menu-enter-from,
.nested-menu-leave-to {
  opacity: 0;
  transform: translateY(-10px);
  -webkit-transform: translateY(-10px);
}
</style>
