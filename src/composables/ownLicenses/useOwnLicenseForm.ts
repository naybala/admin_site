import { ref, onMounted, watch, reactive } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { useCrud } from "../common/useCrud";
import type { OwnLicense } from "../../types";
import { useAppToast } from "../common/useAppToast";
import { validateOwnLicenseForm } from "./validateOwnLicenseForm";
import { OwnLicense_CREATE_API_PATHS } from "./apiPaths";

export function useOwnLicenseForm() {
  const router = useRouter();
  const route = useRoute();
  const { t } = useI18n();
  const { showSuccess, showError } = useAppToast();

  const state = reactive({
    saving: false,
    isEditMode: route.name === "ownLicense-edit",
    isShowMode: route.name === "ownLicense-view",
    validationErrors: {} as Record<string, string>,
  });

  const {
    selectedItem: item,
    loading,
    error,
    fetchOne,
    createItem,
    updateItem,
  } = useCrud<any>({ apiPath: OwnLicense_CREATE_API_PATHS.OwnLicense });

  const form = ref<OwnLicense>({
    name: "",
    shortCode: "",
    logo: "",
    imageFiles: "",
    description: "",
  });

  onMounted(async () => {
    try {
      if ((state.isEditMode || state.isShowMode) && route.params.id) {
        await fetchOne(route.params.id as string);
        if (item.value) {
          form.value = { ...item.value };
        }
      }
    } catch (err: any) {
      showError(
        t("common.error"),
        err.message || "An unexpected error occurred"
      );
    }
    loading.value = false;
  });

  watch(item, (newVal) => {
    if (newVal) {
      form.value = { ...newVal };
    }
  });

  function prepareForm(form: OwnLicense): OwnLicense {
    const firstFile = form.imageFiles;
    return {
      ...form,
      logo: firstFile
        ? {
            filename: firstFile.name,
            contentType: firstFile.type,
          }
        : null, // or undefined, depending on your use case
    };
  }

  const uploadToCloud = async (url: any, file: any) => {
    await fetch(url, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": file?.type,
        "x-amz-acl": "public-read",
      },
    });
  };

  const save = async () => {
    if (state.isShowMode) return;

    state.validationErrors = validateOwnLicenseForm(form.value, t);

    if (Object.keys(state.validationErrors).length > 0) {
      showError(t("common.error"), t("common.validationError"));
      return;
    }

    state.saving = true;
    try {
      const preparedForm = prepareForm(form.value);
      let response: any;

      if (state.isEditMode && route.params.id) {
        response = await updateItem(preparedForm);
        showSuccess(t("common.success"), t("ownLicenses.updated"));
      } else {
        console.log(preparedForm);

        response = await createItem(preparedForm);
        showSuccess(t("common.success"), t("ownLicenses.created"));
      }

      // Handle image upload if necessary
      const uploadUrl = response?.data?.uploadUrl;
      if (form?.value?.imageFiles && uploadUrl != null) {
        await uploadToCloud(uploadUrl, form.value.imageFiles);
      }

      router.push({ name: "ownLicenses" });
    } catch (err: any) {
      console.error("Save failed:", err);
      showError(
        t("common.error"),
        err.message || "An unexpected error occurred"
      );
    } finally {
      state.saving = false;
    }
  };

  const cancel = () => {
    router.push({ name: "ownLicenses" });
  };

  return {
    t,
    state,
    form,
    save,
    cancel,
    loading,
    error,
  };
}
