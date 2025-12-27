import { ref, onMounted, Ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { useCrud } from "../common/useCrud";
import type { UserProfile } from "../../types";
import { useAppToast } from "../common/useAppToast";
import { validateUserProfileForm } from "./validateUserProfileForm";
import { INDEX_API_PATHS } from "@/composables/userProfiles/apiPaths";
import { apiRequest } from "../common/useApi";
import { useAuthStore } from "@/stores/auth";

export function useUserProfileForm() {
  const router = useRouter();
  const route = useRoute();
  const { t } = useI18n();
  const { showSuccess, showError } = useAppToast();
  const saving: Ref<boolean> = ref(false);
  const countries = ref<any>([]);
  const locations = ref<any>([]);
  const isEditMode = ref(route.name === "user-edit");
  const index = ref<string>("my-profile");
  const authStore = useAuthStore();
  const userId: any = authStore.userId || "";
  const {
    selectedItem: item,
    loading,
    error,
    fetchOne,
    updateItem,
  } = useCrud<UserProfile>({ apiPath: INDEX_API_PATHS.USER_PROFILES });

  const form = ref<UserProfile>({
    username: "",
    email: "",
    phoneNumberPrefix: "",
    phoneNumber: "",
    roleId: "",
    userType: "",
    url: null,
    coverUrl: null,
    imageFileProfilePhoto: null,
    imageFileCoverPhoto: null,
    facebook: "",
    telegram: "",
    password: null,
    locationId: "",
  });

  const validationErrors = ref<Record<string, string>>({});

  onMounted(async () => {
    const countriesResponse = await apiRequest<any>(
      INDEX_API_PATHS.COUNTRIES_AND_USER_TYPES,
      {
        method: "GET",
      }
    );
    countries.value = countriesResponse.data.countryList || [];
    await fetchOne(userId);
    if (item.value) {
      form.value = {
        ...item.value,
        url: item.value.url,
        coverUrl: item.value.coverUrl,
        password: null,
      };
      loading.value = false;
    }
  });

  watch(
    () => form.value.phoneNumberPrefix,
    async (newCountryCode) => {
      if (!newCountryCode) {
        locations.value = [];
        return;
      }
      const res = await apiRequest<any>(
        `${INDEX_API_PATHS.Location}${encodeURIComponent(newCountryCode)}`,
        { method: "GET" }
      );
      locations.value = res.data;
    },
    { immediate: true }
  );

  function prepareForm(form: UserProfile): UserProfile {
    const firstFile = form.imageFileCoverPhoto;
    const secondFile = form.imageFileProfilePhoto;
    return {
      ...form,
      coverUrl: firstFile
        ? {
            filename: firstFile.name,
            contentType: firstFile.type,
          }
        : null, // or undefined, depending on your use case
      url: secondFile
        ? {
            filename: secondFile.name,
            contentType: secondFile.type,
          }
        : null,
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
    validationErrors.value = validateUserProfileForm(form.value, t);
    if (Object.keys(validationErrors.value).length > 0) {
      showError(t("common.error"), t("common.validationError"));
      return;
    }

    saving.value = true;
    let originalPhoneNumber: string = form.value.phoneNumber;
    try {
      const preparedForm = prepareForm(form.value);
      let rawPhone = form.value.phoneNumber.trim();
      const cleanedPrefix = form.value.phoneNumberPrefix.replace(/\+/g, "");
      if (rawPhone.startsWith("0")) rawPhone = rawPhone.substring(1);
      const fullPrefixRegex = new RegExp(`^\\+?${cleanedPrefix}`);
      rawPhone = rawPhone.replace(fullPrefixRegex, "");
      form.value.phoneNumber = `+${cleanedPrefix}${rawPhone}`;
      console.log(preparedForm);
      const response: any = await updateItem(preparedForm, false);
      const uploadUrls = response?.data?.uploadUrls || {};
      if (form.value.coverUrl && uploadUrls.coverUrl) {
        await uploadToCloud(
          uploadUrls.coverUrl,
          form.value.imageFileCoverPhoto
        );
      }
      if (form.value.url && uploadUrls.url) {
        await uploadToCloud(uploadUrls.url, form.value.imageFileProfilePhoto);
      }

      showSuccess(t("common.success"), t("users.updated"));
      router.push({ name: index.value });
    } catch (err: any) {
      resetFormToOriginalState();
      console.error("Save failed:", err);
      showError(
        t("common.error"),
        err.message || "An unexpected error occurred"
      );
    } finally {
      resetFormToOriginalState();
      saving.value = false;
    }
    function resetFormToOriginalState() {
      form.value.phoneNumber = originalPhoneNumber;
    }
  };

  const cancel = () => {
    router.push({ name: index.value });
  };

  return {
    t,
    isEditMode,
    form,
    validationErrors,
    countries,
    locations,
    save,
    cancel,
    loading,
    error,
    saving,
  };
}
