<script setup lang="ts">
import { useArtistForm } from "@composables/artists/useArtistForm";
import Toast from "primevue/toast";
import Card from "primevue/card";
import NameField from "@components/common/NameField.vue";
import Description from "@components/common/Description.vue";
import FormActions from "@components/common/FormActions.vue";
import { useServerError } from "@/composables/common/useServerError";
import Loader from "@/components/common/Loader.vue";
import SingleImageUploader from "@/components/common/SingleImageUploader.vue";
import SelectItem from "@/components/common/SelectItem.vue";
import { inject } from "vue";
import MultipleSelect from "@/components/common/MultipleSelect.vue";
import RadioBtn from "@/components/common/RadioBtn.vue";

const {
  t,
  state,
  form,
  save,
  loading,
  artistTypes,
  genderTypes,
  cancel,
  error,
} = useArtistForm();
const countries: any = inject("countryList");
useServerError(error);
</script>

<template>
  <div class="p-6">
    <Toast />
    <h1 class="text-3xl font-bold mb-6">
      {{
        state.isShowMode
          ? t("artists.view")
          : state.isEditMode
          ? t("artists.edit")
          : t("artists.add")
      }}
    </h1>

    <Card class="dark:bg-gray-800 dark:text-gray-100 shadow-md">
      <template #content>
        <span v-if="loading || state.saving" class="">
          <Loader />
        </span>
        <form @submit.prevent="save" v-else>
          <!-- Image Upload -->
          <div class="flex justify-center">
            <SingleImageUploader
              v-model="form.imageFiles"
              :initialUrl="form.url"
              @update:initialUrl="(val:any) => (form.url = val)"
              :error="state.validationErrors.urlRequired"
            />
          </div>
          <br />
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Name -->
            <NameField
              id="nameRequired"
              v-model="form.name"
              :label="t('artists.name')"
              :error="state.validationErrors.nameRequired"
              :readonly="state.isShowMode"
            />

            <!-- En Name -->
            <NameField
              id="enNameRequired"
              v-model="form.enName"
              :label="t('artists.enName')"
              :error="state.validationErrors.enNameRequired"
              :readonly="state.isShowMode"
            />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- Country -->
            <SelectItem
              id="countryId"
              v-model="form.countryId"
              :label="t('artists.country')"
              :options="countries"
              :placeholder="t('artists.selectCountry')"
              :error="state.validationErrors.countryIdRequired"
              optionLabel="name"
              optionValue="code"
              :showFlag="true"
              :readonly="state.isShowMode"
              :showClear="true"
            />
            <!-- Type -->
            <MultipleSelect
              id="type"
              v-model="form.type"
              :label="t('socialCategories.type')"
              :options="artistTypes"
              :placeholder="t('socialCategories.selectType')"
              :error="state.validationErrors.typeRequired"
              optionLabel="name"
              optionValue="id"
              :readonly="state.isShowMode"
            />

            <!-- Gender -->
            <SelectItem
              id="gender"
              v-model="form.gender"
              :label="t('artists.gender')"
              :options="genderTypes"
              :placeholder="t('artists.selectGender')"
              :error="state.validationErrors.genderRequired"
              optionLabel="name"
              optionValue="id"
              :showFlag="false"
              :readonly="state.isShowMode"
              :showClear="true"
            />
          </div>

          <!-- Description -->
          <Description
            v-model="form.description"
            :label="t('roles.description')"
            :readonly="state.isShowMode"
          />

          <!-- Status -->
          <RadioBtn v-model="form.status" :readonly="state.isShowMode" />

          <FormActions
            :onCancel="cancel"
            :saveLabel="t('common.save')"
            :cancelLabel="t('common.cancel')"
            :loading="state.saving"
            :readonly="state.isShowMode"
          />
        </form>
      </template>
    </Card>
  </div>
</template>

<style scoped></style>
