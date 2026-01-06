import { ref, computed, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { useAssociationDetail } from "../queries/useAssociationDetail";
import { useCountries, useShortNames } from "../queries/useCountries";
import { useAssociationMutations } from "../mutations/useAssociationMutations";
import {
  associationSchema,
  type AssociationFormValues,
} from "../schema/association.schema";
import { useAppToast } from "@/composables/common/useAppToast";

export function useAssociationForm() {
  const router = useRouter();
  const route = useRoute();
  const { t } = useI18n();
  const { showError } = useAppToast();

  const id = route.params.id as string;
  const isEditMode = route.name === "association-edit";
  const isShowMode = route.name === "association-view";

  const { data: detail, isLoading: isLoadingDetail } = useAssociationDetail(id);
  const { data: countriesRes } = useCountries();
  const { data: shortNamesRes } = useShortNames();
  const { createMutation, updateMutation } = useAssociationMutations();

  const countries = computed(() => countriesRes.value?.data || []);
  const shortNames = computed(() => shortNamesRes.value?.data || []);

  const form = ref<AssociationFormValues>({
    name: "",
    shortName: "",
    countryId: "",
    logo: "",
    description: "",
    imageFiles: null,
  });

  const validationErrors = ref<Record<string, string>>({});

  watch(
    detail,
    (newVal: any) => {
      if (newVal?.data) {
        form.value = {
          ...form.value,
          ...newVal.data,
        };
      }
    },
    { immediate: true }
  );

  const validate = () => {
    const result = associationSchema.safeParse(form.value);
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        errors[issue.path[0] as string] = issue.message;
      });
      validationErrors.value = errors;
      return false;
    }
    validationErrors.value = {};
    return true;
  };

  const uploadToCloud = async (url: string, file: File) => {
    await fetch(url, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": file.type,
        "x-amz-acl": "public-read",
      },
    });
  };

  const handleSave = async () => {
    if (!validate()) {
      showError(t("common.error"), t("common.validationError"));
      return;
    }

    const preparedForm = {
      ...form.value,
      logo: form.value.imageFiles
        ? {
            filename: form.value.imageFiles.name,
            contentType: form.value.imageFiles.type,
          }
        : null,
    };

    try {
      let response: any;
      if (isEditMode && id) {
        response = await updateMutation.mutateAsync({ id, data: preparedForm });
      } else {
        response = await createMutation.mutateAsync(preparedForm);
      }

      const uploadUrl = response?.data?.uploadUrl;
      if (form.value.imageFiles && uploadUrl) {
        await uploadToCloud(uploadUrl, form.value.imageFiles);
      }

      router.push({ name: "associations" });
    } catch (err) {
      // Error handled by mutation
    }
  };

  const handleCancel = () => router.push({ name: "associations" });

  const saving = computed(
    () => createMutation.isPending.value || updateMutation.isPending.value
  );
  const loading = computed(() => id && isLoadingDetail.value);

  return {
    t,
    isShowMode,
    isEditMode,
    form,
    countries,
    shortNames,
    validationErrors,
    handleSave,
    handleCancel,
    loading,
    saving,
  };
}
