<template>
  <!-- Responsive wrapper -->
  <div class="overflow-x-auto w-full">
    <table
      class="min-w-full table-auto border-collapse border border-gray-300 dark:border-gray-600 dark:text-white"
    >
      <thead class="bg-gray-100 dark:bg-gray-700">
        <tr>
          <th
            v-for="col in columns"
            :key="col.field"
            class="border px-4 py-2 text-start whitespace-nowrap"
          >
            {{ col.label }}
          </th>
          <th v-if="hasAnyActionPermission" class="border px-4 py-2 text-start">
            Actions
          </th>
        </tr>
      </thead>

      <tbody>
        <template v-for="group in items" :key="group.id">
          <template
            v-for="(child, childIndex) in group.children"
            :key="child.id"
          >
            <tr
              :class="
                childIndex === 0
                  ? 'bg-white dark:bg-gray-900'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-800'
              "
            >
              <td
                v-for="col in columns"
                :key="col.field"
                class="border px-4 py-2 whitespace-nowrap"
              >
                <!-- First child: show all group-level + child-level data -->
                <template v-if="childIndex === 0">
                  <template v-if="col.field === 'name'">{{
                    group.name
                  }}</template>
                  <template v-else-if="col.field === 'userTypeName'">{{
                    group.userTypeName
                  }}</template>
                  <template v-else-if="col.field === 'countryCode'">{{
                    group.countryCode
                  }}</template>
                  <template v-else-if="col.field === 'price'">{{
                    group.price
                  }}</template>
                  <template v-else-if="col.field === 'currency'">{{
                    group.currency
                  }}</template>
                  <template v-else-if="col.field === 'duration'">{{
                    child.duration
                  }}</template>
                  <template v-else-if="col.field === 'vatPercent'">{{
                    child.vatPercent
                  }}</template>
                  <template v-else-if="col.field === 'finalPrice'">{{
                    child.finalPrice
                  }}</template>
                  <template v-else></template>
                </template>

                <!-- Other children: show only specific child fields -->
                <template v-else>
                  <template
                    v-if="
                      ['duration', 'vatPercent', 'finalPrice'].includes(
                        col.field
                      )
                    "
                  >
                    {{ child[col.field] }}
                  </template>
                </template>
              </td>

              <!-- Actions column -->
              <td v-if="hasAnyActionPermission" class="border px-4 py-2">
                <template v-if="childIndex === 0">
                  <!-- Only show action buttons for the first child -->
                  <div class="relative">
                    <Button
                      type="button"
                      icon="pi pi-ellipsis-v"
                      @click="(e) => toggle(child.id, e)"
                      class="p-button-text"
                    />
                    <Popover
                      :key="child.id"
                      :ref="(el) => assignPopoverRef(child.id, el)"
                      class="z-50"
                    >
                      <div class="flex flex-col gap-2">
                        <template
                          v-for="(action, index) in actions"
                          :key="index"
                        >
                          <Button
                            v-if="action.permission"
                            :icon="action.icon"
                            :label="action.tooltip"
                            class="p-button-text justify-start"
                            @click="(e) => handleAction(child, action, e)"
                          />
                        </template>
                      </div>
                    </Popover>
                  </div>
                </template>
              </td>
            </tr>
          </template>
        </template>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive } from "vue";
import Button from "primevue/button";
import Popover from "primevue/popover";
import Tooltip from "primevue/tooltip";

defineExpose({ directives: { tooltip: Tooltip } });
const props = defineProps<{
  columns: Array<{ label: string; field: string; isImage?: boolean }>;
  items: Record<string, any>[];
  actions?: Array<{
    icon: string;
    class?: string;
    tooltip?: string;
    permission: boolean;
    handler: (item: any, event: Event) => void;
  }>;
}>();

const hasAnyActionPermission = computed(() => {
  return props.actions?.some((action) => action.permission) ?? false;
});

// Store popover refs for each row
const popoverRefs = reactive<Record<string, any>>({});

// Assign popover ref to specific row
const assignPopoverRef = (id: string, el: any) => {
  if (el) {
    popoverRefs[id] = el;
  }
};

// Toggle popover visibility
const toggle = (id: string, event: Event) => {
  if (popoverRefs[id]) {
    popoverRefs[id].toggle(event);
  }
};

// Handle action click and close popover
const handleAction = (item: any, action: any, event: Event) => {
  action.handler(item, event);
  if (popoverRefs[item.id]) {
    popoverRefs[item.id].hide();
  }
};
</script>
