<template>
  <div
    class="overflow-auto border border-gray-300 dark:border-gray-600 rounded"
    :class="isHeaderSticky ? 'max-h-[500px]' : ''"
  >
    <table class="min-w-full table-auto border-collapse dark:text-white">
      <thead>
        <tr class="bg-gray-100 dark:bg-gray-700">
          <th
            v-for="col in columns"
            :key="col.field"
            :class="[
              tdHeaderClass || 'border px-4 py-2 text-start whitespace-nowrap',
              isHeaderSticky ? 'sticky top-0 z-10' : '',
              col.isHeaderStart ? 'text-start ps-2' : 'text-center',
            ]"
          >
            {{ col.label }}
          </th>
          <th
            v-if="hasAnyActionPermission"
            class="border px-14 py-2 text-start"
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
          class="hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
          @click="rowClickUrl ? handleRowClick(item) : undefined"
        >
          <td
            v-for="col in columns"
            :key="col.field"
            :class="tdStyleClass || 'border px-4 py-2 whitespace-nowrap'"
          >
            <template v-if="col.isImage">
              <div @click.stop class="cursor-pointer">
                <Image
                  :src="getImageUrl(item[col.field])"
                  alt="Image"
                  width="50"
                  height="50"
                  preview
                />
              </div>
            </template>

            <template v-else>
              <!-- Status Badge -->
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

              <span v-else-if="col.field == 'location'">
                <p style="text-align: left !important">
                  {{ item[col.field] }}
                </p>
              </span>

              <span v-else-if="col.field === 'is_private'">
                <span
                  :class="{
                    'bg-green-600 text-white px-3 py-2 rounded-xl':
                      item[col.field] === false || item[col.field] === 'false',
                    'bg-red-600 text-white px-3 py-2 rounded-xl':
                      item[col.field] === true || item[col.field] === 'true',
                  }"
                >
                  {{
                    item[col.field] === true || item[col.field] === "true"
                      ? "Private"
                      : "Public"
                  }}
                </span>
              </span>

              <span v-else-if="col.isCopy == false">
                <span class="select-none">
                  {{ item[col.field] }}
                </span>
              </span>

              <span v-else-if="col.isDirectToTelegram">
                <a :href="`https://t.me/${item[col.field]}`" target="_blank">
                  {{ item[col.field] }}
                </a>
              </span>

              <span v-else-if="col.isDirectToPhoneNumber">
                <a :href="`tel:${item[col.field]}`" target="_blank">
                  {{ item[col.field] }}
                </a>
              </span>

              <!-- Default Field -->
              <span v-else>
                {{ item[col.field] }}
              </span>
            </template>
          </td>

          <td
            v-if="hasAnyActionPermission"
            class="border px-4 py-2 whitespace-nowrap"
          >
            <div class="grid grid-cols-4 gap-2 items-center place-items-center">
              <template v-for="(action, index) in actions" :key="index">
                <template v-if="action.isCustomIcon && action.permission">
                  <img
                    v-tooltip.top="action.tooltip"
                    alt="custom icon"
                    class="w-4 h-4"
                    :src="action.customIconSrc"
                    @click.stop="(e) => handleAction(item, action, e)"
                  />
                </template>
                <Button
                  v-else
                  v-if="action.permission"
                  :icon="action.icon"
                  class="p-button-rounded p-button-text"
                  v-tooltip.top="action.tooltip"
                  @click.stop="(e) => handleAction(item, action, e)"
                />
              </template>
            </div>
          </td>

          <!-- Modal (optional per item) -->
          <div v-if="isModal">
            <ModalDialog
              v-if="modalVisibilityMap[item.id]"
              :visible="modalVisibilityMap[item.id]"
              :item="selectedItemMap[item.id]"
              :dialogTitle="
                'Upgrade User: ' + selectedItemMap[item.id]?.username
              "
              @update:visible="(val) => (modalVisibilityMap[item.id] = val)"
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
import ModalDialog from "../user/ModalDialog.vue";
import { useRouter } from "vue-router";
import { Image } from "primevue";

const router = useRouter();

const props = defineProps<{
  columns: Array<{
    label: string;
    field: string;
    isImage?: boolean;
    isCopy?: boolean;
    isDirectToTelegram?: boolean;
    isDirectToPhoneNumber?: boolean;
    isHeaderStart?: boolean;
  }>;
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
    isCustomIcon?: boolean;
    customIconSrc?: string;
    handler: (item: any, event: Event) => void;
  }>;
  userTypes?: Array<any> | undefined;
  countries?: Array<any> | undefined;
  ownLicenses?: Array<any> | undefined;
  tdHeaderClass?: string;
  tdStyleClass?: string;
}>();

// Action permission check
const hasAnyActionPermission = computed(() =>
  props.actions?.some((action) => action.permission)
);

// Row click
const handleRowClick = (item: any) => {
  if (props.rowClickUrl) {
    router.push({ name: props.rowClickUrl, params: { id: item.id } });
  }
};

// --- Modal handling ---
const modalVisibilityMap = reactive<Record<string, boolean>>({});
const selectedItemMap = reactive<Record<string, any>>({});

const showModalForItem = (item: any) => {
  modalVisibilityMap[item.id] = true;
  selectedItemMap[item.id] = { ...item };
};

const getImageUrl = (url: string): string => {
  if (!url) return "";

  // Handle Cloudflare delivery
  if (url.startsWith("https://imagedelivery.net") && !url.endsWith("/public")) {
    return `${url}/public`;
  }

  // Handle local/CDN-prefixed images
  const CDN_PREFIX = import.meta.env.VITE_CDN_PREFIX;
  if (!url.startsWith("http") && CDN_PREFIX) {
    return `${CDN_PREFIX}/${url}`;
  }

  return url;
};

const handleSave = (id: string, updatedData: any) => {
  console.log("Save triggered for ID:", id, updatedData);
  modalVisibilityMap[id] = false;
};

// Action click (with optional modal trigger)
const handleAction = (item: any, action: any, event: Event) => {
  action.handler(item, event);
  const openModalTooltips = ["Upgrade User"];
  if (openModalTooltips.includes(action.tooltip)) {
    showModalForItem(item);
  }
};
</script>
