import { ref, onMounted, watch, reactive } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { useCrud } from "../common/useCrud";
import type { LiveStreamings } from "../../types";
import { useAppToast } from "../common/useAppToast";
import { validateLiveStreamingForm } from "./validateLiveStreamingForm";
import { LiveStreaming_CREATE_API_PATHS } from "./apiPaths";

export function useLiveStreamingForm() {
  const router = useRouter();
  const route = useRoute();
  const { t } = useI18n();
  const { showSuccess, showError } = useAppToast();

  const state = reactive({
    saving: false,
    isEditMode: route.name === "liveStreaming-edit",
    isShowMode: route.name === "liveStreaming-view",
    validationErrors: {} as Record<string, string>,
  });

  const {
    selectedItem: item,
    loading,
    error,
    fetchOne,
    createItem,
    updateItem,
  } = useCrud<any>({ apiPath: LiveStreaming_CREATE_API_PATHS.LiveStreaming });

  const form = ref<LiveStreamings>({
    channelName: "",
    liveLink: "",
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
    setTimeout(() => {
      loading.value = false;
    }, 300);
  });

  watch(item, (newVal) => {
    if (newVal) {
      form.value = { ...newVal };
    }
  });

  const save = async () => {
    if (state.isShowMode) return;

    state.validationErrors = validateLiveStreamingForm(form.value, t);

    if (Object.keys(state.validationErrors).length > 0) {
      showError(t("common.error"), t("common.validationError"));
      return;
    }

    state.saving = true;
    try {
      if (state.isEditMode && route.params.id) {
        await updateItem(form.value);
        showSuccess(t("common.success"), t("liveStreamings.updated"));
      } else {
        await createItem(form.value);
        showSuccess(t("common.success"), t("liveStreamings.created"));
      }
      router.push({ name: "liveStreamings" });
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
    router.push({ name: "liveStreamings" });
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
