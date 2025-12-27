<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import UserProfile from "./UserProfile.vue";
import { usePermissionStore } from "@/stores/permission";
import {
  FreeMemberSidebarConfig,
  DeveloperSidebarConfig,
  CompanySidebarConfig,
} from "./SidebarConfig";
import { AssociationSidebarConfig } from "./SidebarConfig";
import { AgentSidebarConfig } from "./SidebarConfig";

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

const sidebarLinks = computed(() => {
  switch (props.userData?.userType) {
    case "Developer":
      return DeveloperSidebarConfig;
    case "Agency":
      return CompanySidebarConfig;
    case "Association":
      return AssociationSidebarConfig;
    case "Agent":
      return AgentSidebarConfig;
    case "Member":
      return FreeMemberSidebarConfig;
    default:
      return [];
  }
});

const menuSections = computed(() => {
  const links = sidebarLinks.value;
  // Define all paths that should appear in the Public Menu
  const publicPaths = [
    "/dashboard",
    "/properties",
    "/associations",
    "/companies",
    "/agents",
    "/buyers",
    "/my-info/download-resources",
    "/my-info/property-report",
    "/map-prices",
  ];

  const publicMenu = links.filter((l: any) => publicPaths.includes(l.path));
  const privateMenu = links.filter((l: any) => !publicPaths.includes(l.path));

  return [
    { label: "Public Menu", items: publicMenu },
    { label: "Private Menu", items: privateMenu },
  ];
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

function isParentActive(link: any) {
  return route.path === link.path || route.path.startsWith(link.path + "/");
}

function getFilteredChildren(link: (typeof sidebarLinks.value)[0]) {
  return (link.children || []).filter((child: any) => {
    const meta = child.meta as any;
    return !meta.permission || permissionStore.hasPermission(meta.permission);
  });
}
</script>

<template>
  <aside
    :class="[
      'bg-gray-800 dark:bg-gray-950 text-white h-screen transition-all duration-300 z-50 flex flex-col',
      props.isMobileVisible
        ? 'fixed top-0 left-0 w-72 transform translate-x-0'
        : 'fixed top-0 left-0 w-72 transform -translate-x-full',
      'md:relative md:translate-x-0 md:flex-shrink-0',
      props.isOpen ? 'md:w-72' : 'md:w-20',
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
      class="px-4 py-2 text-center font-bold text-xl border-b border-gray-700 dark:border-gray-800"
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
    <div class="flex-1 overflow-y-auto scrollbar-hidden">
      <nav class="mt-4">
        <div v-for="(section, index) in menuSections" :key="index">
          <div
            v-if="section.label && section.items.length > 0 && props.isOpen"
            class="px-4 py-2 text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2 bg-slate-400"
            :class="{ 'mt-6': index > 0 }"
          >
            {{ section.label }}
          </div>
          <div
            v-if="section.label && section.items.length > 0 && !props.isOpen"
            class="h-px bg-gray-700 mx-2 my-2"
            :class="{ hidden: index === 0 }"
          ></div>

          <ul>
            <li
              v-for="link in section.items"
              :key="link.path"
              :class="{
                'pb-5': index === section.items.length - 1,
              }"
            >
              <div
                class="flex items-center px-4 py-2 hover:bg-brand-secondary transition-colors cursor-pointer"
                :class="[
                  'transition-all duration-300 ease-in-out',
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
                <i
                  :class="[link.meta.icon, props.isOpen ? 'mr-3' : 'mr-0']"
                ></i>
                <span
                  :class="{ hidden: !props.isOpen, inline: props.isOpen }"
                  class="flex-1"
                >
                  {{ t((link.meta as any).label || "") }}
                </span>
                <template v-if="link.children && link.children.length">
                  <i
                    :class="[
                      'pi',
                      isMenuExpanded(link.path)
                        ? 'pi-chevron-down'
                        : 'pi-chevron-right',
                      props.isOpen ? '' : 'hidden',
                    ]"
                  ></i>
                </template>
              </div>

              <!-- Nested submenu -->
              <ul
                v-if="
                  link.children &&
                  getFilteredChildren(link).length &&
                  isMenuExpanded(link.path) &&
                  props.isOpen
                "
                class="pl-8"
              >
                <li
                  v-for="child in getFilteredChildren(link)"
                  :key="child.path"
                  class="hover:bg-brand-secondary cursor-pointer mt-1"
                >
                  <RouterLink
                    :to="`${link.path}/${child.path}`"
                    class="flex items-center p-2"
                    :class="{
                      'bg-brand-primary border-l-8 border-brand-secondary':
                        isActiveBasePath(`${link.path}/${child.path}`),
                    }"
                  >
                    <span>{{ t((child.meta as any).label || "") }}</span>
                  </RouterLink>
                </li>
              </ul>
            </li>
          </ul>
        </div>
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
