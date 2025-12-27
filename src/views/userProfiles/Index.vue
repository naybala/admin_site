<script setup lang="ts">
import { ref, nextTick } from "vue";
import Toast from "primevue/toast";
import NameField from "@components/common/NameField.vue";
import FormActions from "@components/common/FormActions.vue";
import { useServerError } from "@/composables/common/useServerError";
import SelectItem from "@components/common/SelectItem.vue";
import Loader from "@/components/common/Loader.vue";
import CombineInput from "@/components/common/CombineInput.vue";
import { handleFastLoading } from "@/utils/useFastLoading";
import { useUserProfileForm } from "@/composables/userProfiles/useUserProfileForm";
import SingleImageUploader from "@/components/common/SingleImageUploader.vue";
import PasswordField from "@/components/common/PasswordField.vue";
import { ToggleSwitch } from "primevue";

const {
  t,
  form,
  save,
  validationErrors,
  cancel,
  error,
  loading,
  saving,
  countries,
  locations,
} = useUserProfileForm();

const isPasswordChange = ref<boolean>(false);

// --- Prevent browser autofill ---
const clearAutofilledPassword = async () => {
  await nextTick();
  const passwordInputs = document.querySelectorAll('input[type="password"]');
  passwordInputs.forEach((el: any) => {
    el.value = "";
  });
  form.value.password = null;
};

// --- Toggle Password Field ---
const togglePasswordChange = async () => {
  if (!isPasswordChange.value) {
    // user turns ON password change
    isPasswordChange.value = true;
    await nextTick();
    clearAutofilledPassword();
  } else {
    // user turns it OFF
    isPasswordChange.value = false;
    form.value.password = null;
    clearAutofilledPassword();
  }
};

handleFastLoading(loading);
useServerError(error);
</script>

<template>
  <div class="p-6">
    <Toast />
    <h1 class="text-3xl font-bold mb-6">User Profile</h1>

    <div class="grid grid-cols-1 md:grid-cols-7 gap-6">
      <div></div>
      <div class="dark:text-gray-100 col-span-5 w-full">
        <span v-if="loading">
          <Loader />
        </span>

        <form @submit.prevent="save" v-else class="max-w-[1000px] mx-auto">
          <!-- Facebook-style Cover and Profile Photo -->
          <div class="relative w-full mb-24">
            <!-- Cover Photo Container -->
            <div
              class="w-full h-[200px] md:h-350px lg:h-[500px] bg-gray-200 dark:bg-gray-700"
            >
              <SingleImageUploader
                v-model="form.imageFileCoverPhoto"
                :initialUrl="form.coverUrl"
                @update:initialUrl="(val: any) => (form.coverUrl = val)"
                shape="cover"
                width="w-full"
                height="h-[200px] md:h-350px lg:h-[500px]"
                :crop-aspect-ratio="2"
                :editable="true"
                :error="validationErrors.coverPhotoRequired"
              />
            </div>

            <!-- Profile Photo (overlaid) -->
            <div
              class="absolute -bottom-20 left-2 md:-bottom-16 md:left-12 w-24 md:w-44 rounded-lg overflow-hidden"
            >
              <SingleImageUploader
                v-model="form.imageFileProfilePhoto"
                :initialUrl="form.url"
                @update:initialUrl="(val: any) => (form.url = val)"
                shape="rounded"
                width="w-24 md:w-32"
                height="h-24 md:h-32"
                :crop-aspect-ratio="1"
                :editable="true"
                :error="validationErrors.profilePhotoRequired"
              />
            </div>
          </div>

          <!-- Push form content down so it's not overlapped -->
          <div class="mt-20 px-4 md:px-12 py-3">
            <div class="">
              <!-- Name -->
              <NameField
                id="usernameRequired"
                :modelValue="form.username ?? ''"
                @update:modelValue="form.username = $event"
                :label="t('users.name')"
                :error="validationErrors.usernameRequired"
              />

              <!-- Country -->
              <SelectItem
                id="phoneNumberPrefixRequired"
                v-model="form.phoneNumberPrefix"
                :label="t('users.country')"
                :options="countries"
                :placeholder="t('users.selectCountry')"
                :error="validationErrors.phoneNumberPrefixRequired"
                optionLabel="code"
                optionValue="code"
                :showFlag="true"
              />

              <!-- Locations -->
              <SelectItem
                id="locationId"
                v-model="form.locationId"
                :label="t('users.location')"
                :options="locations"
                :placeholder="t('users.selectLocation')"
                :error="validationErrors.locationIdRequired"
                optionLabel="name"
                optionValue="id"
                :showFlag="false"
              />

              <!-- Email -->
              <NameField
                id="emailRequired"
                :modelValue="form.email ?? ''"
                @update:modelValue="form.email = $event"
                :label="t('users.email')"
                :error="validationErrors.emailRequired"
              />

              <!-- Phone Number -->
              <CombineInput
                id="phoneNumberRequired"
                v-model="form.phoneNumber"
                :preModelValue="form.phoneNumberPrefix"
                :modelValueTwo="form.phoneNumber"
                :label="t('users.phoneNumber')"
                :error="validationErrors.phoneNumberRequired"
                type="text"
              />

              <!-- Facebook -->
              <NameField
                id="facebookRequired"
                :modelValue="form.facebook ?? ''"
                @update:modelValue="form.facebook = $event"
                :label="t('users.facebook')"
                :error="validationErrors.facebookRequired"
                :readonly="false"
              />

              <!-- telegram -->
              <NameField
                id="telegramRequired"
                :modelValue="form.telegram ?? ''"
                @update:modelValue="form.telegram = $event"
                :label="t('users.telegram')"
                :error="validationErrors.telegramRequired"
                :readonly="false"
              />

              <div class="flex justify-start gap-2 mb-4">
                <label for="">Wanna password change?</label>
                <ToggleSwitch
                  :modelValue="isPasswordChange"
                  @update:modelValue="togglePasswordChange"
                />
              </div>

              <!-- Password only shown when toggle is active -->
              <PasswordField
                v-if="isPasswordChange"
                id="user-password"
                :modelValue="form.password ?? ''"
                @update:modelValue="form.password = $event"
                :label="t('users.password')"
                :error="validationErrors.passwordRequired"
                autocomplete="new-password"
              />

              <!-- Actions -->
              <FormActions
                :onCancel="cancel"
                :saveLabel="t('common.save')"
                :cancelLabel="t('common.cancel')"
                :loading="saving"
                :readonly="false"
              />
              <br /><br /><br />
            </div>
          </div>
        </form>
      </div>
      <div></div>
    </div>
  </div>
</template>

<style scoped>
/* Optional: Add some custom styles for better appearance */
:deep(.cover-image) {
  width: 100%;
  height: auto;
  max-height: 450px;
  object-fit: contain;
}
</style>
