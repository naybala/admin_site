<template>
  <div class="mb-4">
    <label
      :for="id"
      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
    >
      {{ label }}
    </label>

    <!-- Hybrid Input/Select -->
    <AutoComplete
      v-if="isInsertable"
      :id="id"
      :modelValue="modelValue"
      @update:modelValue="updateValue"
      :suggestions="filteredOptions"
      :placeholder="placeholder"
      :completeOnFocus="true"
      @complete="onFilterAutoSelect"
      :disabled="readonly"
      style="
        width: 100%;
        padding: 1rem;
        border: 1px solid #e5e7eb;
        border-radius: 10px;
      "
    />

    <Select
      v-else
      :id="id"
      :modelValue="modelValue"
      @update:modelValue="updateValue"
      :options="normalizedOptions"
      :optionLabel="optionLabel || 'label'"
      :optionValue="optionValue || 'value'"
      :placeholder="placeholder"
      @filter="onFilter"
      :filter="true"
      filterPlaceholder="Search..."
      class="w-full p-inputtext-sm dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-600"
      :disabled="readonly"
      :class="readonly ? 'bg-gray-100' : ''"
    >
      <!-- Custom Option Template -->
      <template #option="slotProps">
        <div class="flex items-center gap-2">
          <img
            v-if="getImageFromOption(slotProps.option)"
            :src="getImageFromOption(slotProps.option)"
            alt="flag"
            class="w-5 h-3 object-cover rounded"
          />
          <span>{{ slotProps.option[optionLabel || "label"] }}</span>
        </div>
      </template>

      <!-- Selected Value Template with Clear Button -->
      <template #value="slotProps">
        <div
          v-if="slotProps.value"
          class="flex items-center gap-2 justify-between w-full"
        >
          <div class="flex items-center gap-2">
            <img
              v-if="showFlag"
              :src="getFlagByCode(slotProps.value)"
              alt="flag"
              class="w-5 h-3 object-cover rounded"
            />
            <span>
              {{ getLabelByValue(slotProps.value) }}
            </span>
          </div>
          <!-- Clear Button (only if not readonly) -->
          <button v-if="showClear" type="button" @click.stop="updateValue('')">
            ✖
          </button>
        </div>
        <span v-else class="text-gray-400">{{ placeholder }}</span>
      </template>
    </Select>
    <span v-if="!modelValue">
      <p v-if="error" class="text-red-500 text-sm mt-1">{{ error }}</p>
    </span>
  </div>
</template>

<script setup lang="ts">
import { Select, AutoComplete } from "primevue";
import { computed, ref } from "vue";

const props = defineProps<{
  id: string;
  modelValue?: any;
  options?: any;
  label?: string;
  placeholder?: string;
  error?: string;
  optionLabel?: string;
  optionValue?: string;
  showFlag?: boolean;
  imgKey?: string;
  readonly?: boolean;
  showClear?: boolean;
  isInsertable?: boolean; // NEW PROP
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string | null): void;
  (e: "filter", value: string): void;
}>();

function updateValue(value: string | null) {
  emit("update:modelValue", value);
}

function onFilterAutoSelect(event: { originalEvent: Event; query: string }) {
  emit("update:modelValue", event.query);
  filterSuggestions(event.query);
}

function onFilter(event: { originalEvent: Event; value: string }) {
  emit("filter", event.value);
  filterSuggestions(event.value);
}

// Normalized options
const normalizedOptions = computed(() => {
  if (!Array.isArray(props.options)) return [];

  return props.options.map((opt) => {
    if (typeof opt === "string") {
      return {
        label: opt,
        value: opt,
      };
    }
    return opt;
  });
});

// Used for AutoComplete
const filteredOptions = ref<any>([]);

function getImageFromOption(option: any) {
  if (!option || !props.showFlag) return null;
  return option?.[props.imgKey || "flag"] || option?.flag || null;
}

function filterSuggestions(query: string) {
  const options = props.options ?? [];
  filteredOptions.value = options.filter((opt: any) => {
    const val =
      typeof opt === "string" ? opt : opt[props.optionLabel || "label"];
    return val.toLowerCase().includes(query.toLowerCase());
  });
}

//  Get label by value
function getLabelByValue(value: string | null): string {
  const option = normalizedOptions?.value?.find(
    (opt) => opt[props.optionValue || "value"] === value
  );
  return option?.[props.optionLabel || "label"] || "";
}

//  Get flag for value (used for countryList)
function getFlagByCode(code: string | null): string {
  if (!code || !props.showFlag) return "";
  const option = normalizedOptions?.value?.find(
    (opt) => opt[props.optionValue || "value"] === code
  );
  return option?.[props.imgKey || "flag"] || option?.flag || "";
}
</script>
