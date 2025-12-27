import { ref, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { useCrud } from "../common/useCrud";
import { useAppToast } from "../common/useAppToast";
import { validateAssociationForm } from "./validateAssociationForm";
import { apiRequest } from "../common/useApi";
import { ASSOCIATION_CREATE_API_PATHS } from "./apiPaths";
import type { Association } from "../../types";

export function useAssociationForm() {
  const router = useRouter();
  const route = useRoute();
  const { t } = useI18n();
  const { showSuccess, showError } = useAppToast();

  const saving = ref(false);
  const itemId = route.params.id as string | null;
  const isEditMode = ref(route.name === "association-edit");
  const isShowMode = ref(route.name === "association-view");

  const countries = ref<any[]>([]);
  const shortNames = ref<any[]>([]);
  const validationErrors = ref<Record<string, string>>({});

  const indexRouteName = "associations";

  const {
    selectedItem: item,
    loading,
    error,
    fetchOne,
    createItem,
    updateItem,
  } = useCrud<Association>({
    apiPath: ASSOCIATION_CREATE_API_PATHS.Associations,
  });

  const form = ref<Association>({
    name: "",
    shortName: "",
    imageFiles: null,
    countryId: "",
    logo: "",
    description: "",
  });

  const loadInitialData = async () => {
    try {
      // Fetch form data for edit/view
      const fetchItemPromise = (async () => {
        if ((isEditMode.value || isShowMode.value) && itemId) {
          await fetchOne(itemId);
          if (item.value) {
            form.value = { ...item.value };
            console.log(form.value);
          }
        }
      })();

      // Fetch countries and short names concurrently
      const [countryRes, shortNameRes] = await Promise.all([
        apiRequest<any>(ASSOCIATION_CREATE_API_PATHS.Countries, {
          method: "GET",
        }),
        apiRequest<any>(ASSOCIATION_CREATE_API_PATHS.ShortNames, {
          method: "GET",
        }),
        fetchItemPromise,
      ]);

      countries.value = countryRes.data;
      shortNames.value = shortNameRes.data;
    } catch (err: any) {
      console.error("Initialization error:", err);
      showError(
        t("common.error"),
        err.message || "Failed to load initial data"
      );
    }
  };

  onMounted(loadInitialData);

  watch(item, (newVal) => {
    if (newVal) {
      form.value = { ...newVal };
    }
  });

  const prepareForm = (form: Association): Association => {
    const file = form.imageFiles;
    return {
      ...form,
      logo: file
        ? {
            filename: file.name,
            contentType: file.type,
          }
        : null,
    };
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

  const save = async () => {
    if (isShowMode.value) return;

    validationErrors.value = validateAssociationForm(form.value, t);
    if (Object.keys(validationErrors.value).length > 0) {
      showError(t("common.error"), t("common.validationError"));
      return;
    }

    saving.value = true;

    try {
      const preparedForm = prepareForm(form.value);
      let response: any;
      if (isEditMode.value && itemId) {
        response = await updateItem(preparedForm);
        showSuccess(t("common.success"), t(indexRouteName + ".updated"));
      } else {
        response = await createItem(preparedForm);
        showSuccess(t("common.success"), t(indexRouteName + ".created"));
      }

      const uploadUrl = response?.data?.uploadUrl;
      if (form.value.imageFiles && uploadUrl) {
        await uploadToCloud(uploadUrl, form.value.imageFiles);
      }

      router.push({ name: indexRouteName });
    } catch (err: any) {
      console.error("Save failed:", err);
      showError(
        t("common.error"),
        err.message || "An unexpected error occurred"
      );
    } finally {
      saving.value = false;
    }
  };

  const cancel = () => {
    router.push({ name: indexRouteName });
  };

  return {
    t,
    isEditMode,
    isShowMode,
    form,
    countries,
    shortNames,
    validationErrors,
    save,
    cancel,
    loading,
    error,
    saving,
    loadInitialData,
  };
}
