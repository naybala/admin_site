import { ref, onMounted, watch, reactive } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { useCrud } from "../common/useCrud";
import type { Company } from "../../types";
import { useAppToast } from "../common/useAppToast";
import { validateCompanyForm } from "./validateCompanyForm";
import { Company_CREATE_API_PATHS } from "./apiPaths";
import { apiRequest } from "../common/useApi";

export function useCompanyForm() {
  const router = useRouter();
  const route = useRoute();
  const { t } = useI18n();
  const { showSuccess, showError } = useAppToast();
  const countries = ref<any>([]);
  const locations = ref<any>([]);
  const associations = ref<any>([]);
  const types = ref<any>([]);
  const uploadImageUrl = ref<any>([]);

  const state = reactive({
    saving: false,
    isEditMode: route.name === "company-edit",
    isShowMode: route.name === "company-view",
    validationErrors: {} as Record<string, string>,
  });

  const {
    selectedItem: item,
    loading,
    error,
    fetchOne,
    createItem,
    updateItem,
  } = useCrud<any>({ apiPath: Company_CREATE_API_PATHS.Company });

  const form = ref<Company>({
    name: "",
    phoneNumber: "",
    email: "",
    countryId: "",
    locationId: "",
    associationId: "",
    associationMemberCode: "",
    address: "",
    description: "",
    facebook: "",
    telegram: "",
    youtubeLink: "",
    logo: "",
    type: [],
    imageFiles: [],
  });

  onMounted(async () => {
    try {
      if ((state.isEditMode || state.isShowMode) && route.params.id) {
        await fetchOne(route.params.id as string);
        if (item.value) {
          form.value = { ...item.value };
        }
      }

      const mixResponse = await apiRequest<any>(
        `${Company_CREATE_API_PATHS.PrepareData}`,
        { method: "GET" }
      );
      countries.value = mixResponse.data.countryList || [];
      associations.value = mixResponse.data.associationList || [];
      types.value = mixResponse.data.agencyTypeList || [];
      uploadImageUrl.value = mixResponse.data.logoUploadLink || "";
    } catch (err: any) {
      showError(
        t("common.error"),
        err.message || "An unexpected error occurred"
      );
    }
    loading.value = false;
  });

  watch(
    () => form.value.countryId,
    async (newVal: any) => {
      if (newVal) {
        const locationResponse = await apiRequest<any>(
          `${Company_CREATE_API_PATHS.Location}${encodeURIComponent(newVal)}`,
          { method: "GET" }
        );

        locations.value = locationResponse.data || [];
      }
    }
  );

  watch(item, (newVal) => {
    if (newVal) {
      form.value = { ...newVal };
    }
  });

  const uploadToCloud = async (url: any, file: any) => {
    await fetch(url, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": file?.type,
        "x-amz-acl": "public-read",
      },
    });
    return true;
  };

  const save = async () => {
    if (state.isShowMode) return;

    state.validationErrors = validateCompanyForm(form.value, t);

    if (Object.keys(state.validationErrors).length > 0) {
      showError(t("common.error"), t("common.validationError"));
      return;
    }

    try {
      state.saving = true;

      // Upload logo if image file is provided
      if (form.value.imageFiles) {
        const file = form.value.imageFiles;
        const isUploaded = await uploadToCloud(uploadImageUrl.value.url, file);
        if (!isUploaded) {
          showError(t("common.error"), t("common.uploadError"));
          return;
        }
        // Set logo to the uploaded key after successful upload
        form.value.logo = uploadImageUrl.value.key;
      }

      // Create or update item
      if (state.isEditMode && route.params.id) {
        await updateItem(form.value);
        showSuccess(t("common.success"), t("company.updated"));
      } else {
        await createItem(form.value);
        showSuccess(t("common.success"), t("company.created"));
      }

      router.push({ name: "companies" });
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
    router.push({ name: "companies" });
  };

  return {
    t,
    state,
    form,
    save,
    countries,
    locations,
    associations,
    types,
    cancel,
    loading,
    error,
  };
}
