<template>
  <Dialog
    v-model:visible="visible"
    :header="dialogTitle"
    :style="{ width: `${uiState.adjustDialog}rem` }"
  >
    <!-- Width Adjust Buttons -->
    <div class="flex justify-center gap-2 mb-4">
      <Button
        icon="pi pi-minus"
        @click="decreaseWidth"
        class="p-button-sm bg-brand-primary shadow-lg text-white"
      />
      <Button
        icon="pi pi-plus"
        @click="increaseWidth"
        class="p-button-sm bg-brand-primary shadow-lg text-white"
      />
    </div>

    <!-- Country -->
    <div class="flex items-center gap-4 mb-4">
      <label class="font-semibold w-24">Countries</label>
      <SelectItem
        id="country"
        v-model="form.country"
        :options="countries"
        :placeholder="t('users.selectCountry')"
        optionLabel="name"
        optionValue="countryCode"
        :showFlag="true"
        :readonly="false"
        :showClear="true"
      />
    </div>

    <!-- User Types -->
    <div class="flex items-center gap-4 mb-8">
      <label class="font-semibold w-24">UserTypes</label>
      <SelectItem
        id="userType"
        v-model="form.userType"
        :options="userTypes"
        :placeholder="t('users.selectUserType')"
        optionLabel="name"
        optionValue="id"
        :showFlag="false"
        :readonly="false"
        :showClear="true"
      />
    </div>

    <span v-if="uiState.modelLoader" class="text-brand-primary text-center">
      Loading api data..
    </span>
    <span v-else>
      <!-- Member Code -->
      <div
        class="flex items-center gap-4 mb-8"
        v-if="form.userType === 'Agent'"
      >
        <label class="font-semibold w-24">MemberCode</label>
        <NameField id="memberCode" v-model="form.memberCode" label="" />
      </div>

      <!-- Own License -->
      <div
        class="flex items-center gap-4 mb-8"
        v-if="form.userType === 'Corporate_Agent'"
      >
        <label class="font-semibold w-24">{{ t("users.ownLicense") }}</label>
        <SelectItem
          id="ownLicenseId"
          v-model="form.ownLicenseId"
          :options="apiData.ownLicenses"
          :placeholder="t('users.selectOwnLicense')"
          optionLabel="name"
          optionValue="id"
          :showFlag="false"
          imgKey="logo"
          :readonly="false"
          :showClear="true"
        />
      </div>

      <!-- Association -->
      <div class="flex items-center gap-4 mb-8" v-if="canShowCompanyFields">
        <label class="font-semibold w-24">{{ t("users.association") }}</label>
        <SelectItem
          id="associationId"
          v-model="form.associationId"
          :options="apiData.associations"
          :placeholder="t('users.selectAssociation')"
          optionLabel="name"
          optionValue="id"
          :showFlag="true"
          imgKey="logo"
          :readonly="false"
          :showClear="true"
        />
      </div>

      <!-- Company -->
      <div class="flex items-center gap-4 mb-8" v-if="canShowCompanyFields">
        <label class="font-semibold w-24">{{ t("users.company") }}</label>
        <SelectItem
          id="agencyId"
          v-model="form.agencyId"
          :options="apiData.companies"
          :placeholder="t('users.selectCompany')"
          optionLabel="name"
          optionValue="id"
          :showFlag="false"
          :readonly="false"
          :showClear="true"
        />
      </div>

      <!-- Plans -->
      <div v-if="apiData.plans.length > 0" class="mb-6">
        <h3 class="text-lg font-semibold mb-2">Select a Plan</h3>
        <div class="flex flex-col gap-3">
          <div
            v-for="plan in apiData.plans[0].plans"
            :key="plan.id"
            class="flex items-start gap-3 p-3 border rounded hover:shadow-md transition cursor-pointer"
          >
            <input
              type="radio"
              :value="plan.id"
              v-model="form.plan_id"
              class="mt-1"
            />
            <div>
              <p class="font-medium">
                {{ plan.duration }} month(s) —
                {{ plan.finalPrice.toLocaleString() }} ({{
                  apiData.plans[0].currency
                }})
              </p>
              <p class="text-sm text-gray-500">
                Discount: {{ plan.discountPercent }}% | VAT:
                {{ plan.vatPercent }}%
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- No plans fallback -->
      <div v-else-if="canShowCompanyFields" class="text-sm text-gray-400 mb-6">
        No plans available for this selection.
      </div>

      <!-- Footer Buttons -->
      <div class="flex justify-end gap-2">
        <Button
          label="Cancel"
          severity="secondary"
          @click="visible = false"
          class="p-button-secondary text-white bg-gray-600 dark:bg-gray-700 px-5"
        />
        <Button
          label="Upgrade"
          :disabled="!form.plan_id"
          @click="onSave"
          class="p-button-primary text-white bg-gray-600 dark:bg-gray-700 px-5"
        />
      </div>
    </span>
  </Dialog>
</template>

<script setup lang="ts">
import { reactive, ref, watch, computed } from "vue";
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import SelectItem from "./SelectItem.vue";
import NameField from "./NameField.vue";
import { useI18n } from "vue-i18n";
import { apiRequest } from "@/composables/common/useApi";

// Props and emits
const props = defineProps<{
  visible: boolean;
  item: any;
  dialogTitle?: string;
  countries: Array<any>;
  userTypes: Array<any>;
  ownLicenses: Array<any>;
}>();
console.log(props.userTypes);

console.log(props.ownLicenses);

const emit = defineEmits(["update:visible", "save-Modal"]);
const { t } = useI18n();

// Visibility binding
const visible = ref(props.visible);
watch(
  () => props.visible,
  (val) => (visible.value = val)
);
watch(
  () => visible.value,
  (val) => emit("update:visible", val)
);

// Form state
const form = reactive({
  userId: props.item.id,
  plan_id: "",
  associationId: "",
  associationMemberCode: "",
  agencyId: "",
  ownLicenseId: "",
  userType: "",
  country: "",
  memberCode: "",
});

// UI and API state
const uiState = reactive({
  adjustDialog: 30,
  modelLoader: false,
});

const apiData = reactive({
  plans: [] as any[],
  companies: [] as any[],
  associations: [] as any[],
  ownLicenses: [] as any[],
});

// Computed condition
const canShowCompanyFields = computed(() => form.userType && form.country);

// Dialog size control
const minWidth = 20;
const maxWidth = 80;

function increaseWidth() {
  if (uiState.adjustDialog < maxWidth) uiState.adjustDialog += 2;
}
function decreaseWidth() {
  if (uiState.adjustDialog > minWidth) uiState.adjustDialog -= 2;
}

// Watch for plan-related changes
watch(
  [() => form.userType, () => form.country],
  async ([userType, country]) => {
    if (userType && country) {
      uiState.modelLoader = true;

      const [planRes, companyRes, associationRes] = await Promise.all([
        apiRequest<any>(
          `/plans/get-by-country-and-usertype/${country}/${userType}`
        ),
        apiRequest<any>("/user-subscriptions/prepare-company"),
        apiRequest<any>("/user-subscriptions/prepare-association"),
      ]);

      apiData.plans = planRes?.data ?? [];
      apiData.companies = companyRes?.data ?? [];
      apiData.associations = associationRes?.data ?? [];
      apiData.ownLicenses = props.ownLicenses;

      form.plan_id = "";
      uiState.modelLoader = false;
    } else {
      apiData.plans = [];
      apiData.companies = [];
      apiData.associations = [];
      apiData.ownLicenses = [];
      form.plan_id = "";
      form.memberCode = "";
      form.agencyId = "";
      form.associationId = "";
      form.ownLicenseId = "";
    }
  }
);

// Save action
function onSave() {
  console.log("plan_id :", form.plan_id);
  console.log("User ID:", props.item.id);
  console.log("Own License ID:", form.ownLicenseId);
  console.log("Association:", form.associationId);
  console.log("Company:", form.agencyId);
  console.log("Member Code:", form.memberCode);

  emit("save-Modal", {
    planId: form.plan_id,
    country: form.country,
    userType: form.userType,
    associationId: form.associationId,
    agencyId: form.agencyId,
    memberCode: form.memberCode,
  });

  visible.value = false;
}
</script>
