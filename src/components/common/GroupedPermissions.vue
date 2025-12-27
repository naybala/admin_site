<template>
  <div class="border border-gray-300 rounded-md p-4">
    <Accordion multiple :activeIndex="activeIndex">
      <AccordionTab
        v-for="(entities, header) in groupedPermissions"
        :key="header"
        :header="header"
        style="padding: 2rem"
      >
        <div class="space-y-6" style="padding: 2rem !important">
          <div
            v-for="(perms, entity) in entities"
            :key="entity"
            class="border border-gray-200 rounded-md p-4"
          >
            <!-- Entity Header and Select All -->
            <div class="flex flex-wrap justify-between items-center mb-2">
              <h2 class="font-semibold capitalize">{{ entity }}</h2>
              <div>
                <button
                  type="button"
                  :disabled="readonly"
                  @click="toggleAll(header, entity)"
                  :class="{
                    'bg-green-500 text-white hover:bg-green-600 rounded-md p-1':
                      !isAllSelected(header, entity),
                    'bg-red-500 text-white hover:bg-red-600 rounded-md p-1':
                      isAllSelected(header, entity),
                    'bg-gray-400 text-white cursor-not-allowed': readonly,
                  }"
                >
                  {{
                    isAllSelected(header, entity)
                      ? "Unselect All"
                      : "Select All"
                  }}
                </button>
              </div>
            </div>

            <!-- Permission Checkboxes -->
            <div class="space-y-2">
              <label
                v-for="(label, key) in perms"
                :key="key"
                class="flex items-center space-x-2"
              >
                <input
                  type="checkbox"
                  :value="key"
                  v-model="modelValue"
                  :disabled="readonly"
                  class="w-4 h-4"
                />
                <span>{{ label }}</span>
              </label>
            </div>
          </div>
        </div>
      </AccordionTab>
    </Accordion>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import Accordion from "primevue/accordion";
import AccordionTab from "primevue/accordiontab";

import type { PermissionsData } from "@/types";

interface Props {
  permissions: PermissionsData;
  modelValue: string[];
  readonly?: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits(["update:modelValue"]);

const modelValue = computed<string[]>({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

const activeIndex = ref<number[]>([]);

// Group permissions by header.root
const groupedPermissions = computed(() => {
  const headers: Record<string, Record<string, Record<string, string>>> = {};
  for (const [entity, perms] of Object.entries(props.permissions)) {
    const headerName = perms["header.root"] || "Other Permissions";
    const filteredPerms = Object.fromEntries(
      Object.entries(perms).filter(([key]) => key !== "header.root")
    );
    const sortedPerms = Object.fromEntries(
      Object.entries(filteredPerms).sort(([a], [b]) => a.localeCompare(b))
    );
    if (!headers[headerName]) headers[headerName] = {};
    headers[headerName][entity] = sortedPerms;
  }
  return headers;
});

// Select / Unselect logic
function selectAll(header: string, entity: string) {
  const perms = Object.keys(groupedPermissions.value[header][entity] || {});
  modelValue.value = Array.from(new Set([...modelValue.value, ...perms]));
}

function unselectAll(header: string, entity: string) {
  const perms = Object.keys(groupedPermissions.value[header][entity] || {});
  modelValue.value = modelValue.value.filter((p) => !perms.includes(p));
}

function isAllSelected(header: string, entity: string) {
  const perms = Object.keys(groupedPermissions.value[header][entity] || {});
  return perms.every((perm) => modelValue.value.includes(perm));
}

function toggleAll(header: string, entity: string) {
  if (isAllSelected(header, entity)) {
    unselectAll(header, entity);
  } else {
    selectAll(header, entity);
  }
}
</script>

<style scoped>
input[type="checkbox"] {
  width: 16px;
  height: 16px;
}
</style>
