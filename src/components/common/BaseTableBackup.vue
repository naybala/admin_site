<template>
  <div
    class="overflow-auto border border-gray-300 dark:border-gray-600 rounded"
    :class="isHeaderSticky ? 'max-h-[500px]' : ''"
  >
    <table class="min-w-full table-auto border-collapse dark:text-white">
      <thead class="shadow-sm">
        <tr class="bg-gray-100 dark:bg-gray-700">
          <th
            v-for="col in columns"
            :key="col.field"
            class="bg-gray-100 dark:bg-gray-700 border px-4 py-2 text-start whitespace-nowrap"
            :class="isHeaderSticky ? 'sticky top-0 z-10' : ''"
          >
            {{ col.label }}
          </th>
          <th
            v-if="hasAnyActionPermission"
            class="bg-gray-100 dark:bg-gray-700 border px-4 py-2 text-start"
            :class="isHeaderSticky ? 'sticky top-0 z-10' : ''"
          >
            Actions
          </th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="item in items"
          :key="item.id"
          class="hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          <td
            v-for="col in columns"
            :key="col.field"
            class="border px-4 py-2 whitespace-nowrap"
          >
            <template v-if="col.isImage">
              <img
                :src="item[col.field]"
                alt="Image"
                class="h-10 w-10 object-cover rounded"
                :class="rowClickUrl ? 'cursor-pointer' : ''"
                @click="rowClickUrl ? handleRowClick(item) : ''"
              />
            </template>
            <template v-else>
              <!-- Show styled status badge -->
              <span v-if="col.field === 'status'">
                <span
                  :class="{
                    'bg-green-600 text-white px-3 py-2 rounded-xl':
                      item[col.field] === true || item[col.field] === 'true',
                    'bg-red-600 text-white px-3 py-2 rounded-xl':
                      item[col.field] === false || item[col.field] === 'false',
                  }"
                >
                  {{
                    item[col.field] === true || item[col.field] === "true"
                      ? "Active"
                      : "Inactive"
                  }}
                </span>
              </span>

              <!-- Default text for other fields -->
              <span v-else>
                {{ item[col.field] }}
              </span>
            </template>
          </td>

          <td
            v-if="hasAnyActionPermission"
            class="border px-4 py-2 whitespace-nowrap"
          >
            <!-- Action Buttons -->
            <div class="relative">
              <Button
                type="button"
                icon="pi pi-ellipsis-v"
                @click="(e) => toggle(item.id, e)"
                class="p-button-text"
              />
              <Popover
                :ref="(el) => assignPopoverRef(item.id, el)"
                class="z-50"
              >
                <div class="flex flex-col gap-2">
                  <template v-for="(action, index) in actions" :key="index">
                    <Button
                      v-if="action.permission"
                      :icon="action.icon"
                      :label="action.tooltip"
                      class="p-button-text justify-start"
                      @click="(e) => handleAction(item, action, e)"
                    />
                  </template>
                </div>
              </Popover>
            </div>
          </td>

          <!-- Per-Row Modal -->
          <div v-if="isModal">
            <ModalDialog
              v-if="modalVisibilityMap[item.id]"
              :visible="modalVisibilityMap[item.id]"
              :item="selectedItemMap[item.id]"
              :dialogTitle="
                'Upgrade User: ' + selectedItemMap[item.id]?.username
              "
              @update:visible="(val:any) => (modalVisibilityMap[item.id] = val)"
              @save="(data:any) => handleSave(item.id, data)"
              :userTypes="userTypes ?? []"
              :countries="countries ?? []"
              :ownLicenses="ownLicenses ?? []"
            />
          </div>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive } from "vue";
import Button from "primevue/button";
import Popover from "primevue/popover";
import Tooltip from "primevue/tooltip";
import ModalDialog from "../user/ModalDialog.vue";
import { useRouter } from "vue-router";

// Expose tooltip directive
defineExpose({ directives: { tooltip: Tooltip } });
const router = useRouter();

// Props
const props = defineProps<{
  columns: Array<{ label: string; field: string; isImage?: boolean }>;
  items: Record<string, any>[];
  isHeaderSticky?: boolean;
  isFixedHeight?: boolean;
  isModal?: boolean;
  rowClickUrl?: string;
  actions?: Array<{
    icon: string;
    class?: string;
    tooltip?: string;
    permission: boolean;
    handler: (item: any, event: Event) => void;
  }>;
  userTypes?: Array<any> | undefined;
  countries?: Array<any> | undefined;
  ownLicenses?: Array<any> | undefined;
}>();

console.log(props.rowClickUrl);

// Check for action permission
const hasAnyActionPermission = computed(
  () => props.actions?.some((action) => action.permission) ?? false
);
const handleRowClick = (item: any) => {
  router.push({ name: props.rowClickUrl, params: { id: item.id } });
};

// --- Popover handling ---
const popoverRefs = reactive<Record<string, any>>({});

const assignPopoverRef = (id: string, el: any) => {
  if (el) popoverRefs[id] = el;
};

const toggle = (id: string, event: Event) => {
  if (popoverRefs[id]) popoverRefs[id].toggle(event);
};

// --- Modal handling ---
const modalVisibilityMap = reactive<Record<string, boolean>>({});
const selectedItemMap = reactive<Record<string, any>>({});

const showModalForItem = (item: any) => {
  modalVisibilityMap[item.id] = true;
  selectedItemMap[item.id] = { ...item };
};

const handleSave = (id: string, updatedData: any) => {
  // Optional: Save the data to backend or emit event
  console.log("Save triggered for ID:", id, updatedData);
  modalVisibilityMap[id] = false;
};

// Handle Action Clicks
const handleAction = (item: any, action: any, event: Event) => {
  action.handler(item, event);

  // Open modal for specific tooltips
  const openModalTooltips = ["Edit Item", "Upgrade User"];
  if (openModalTooltips.includes(action.tooltip)) {
    showModalForItem(item);
  }

  if (popoverRefs[item.id]) {
    popoverRefs[item.id].hide();
  }
};
</script>
