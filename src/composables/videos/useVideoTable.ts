import { onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useConfirm } from "primevue/useconfirm";
import { useCrud } from "../common/useCrud";
import { useAppToast } from "../common/useAppToast";
import type { Video } from "@customTypes/index";
import { Video_INDEX_API_PATHS } from "./apiPaths";
import { useDebouncedFn } from "../common/useDebouncedFn";
import { apiRequest } from "../common/useApi";

export function useVideoTable() {
  const router = useRouter();
  const { t } = useI18n();
  const confirm = useConfirm();
  const { showSuccess, showInfo, showError } = useAppToast();
  const categories = ref<any>([]);
  const searchCategory = ref<any>("");

  const searchTerm = ref("");

  const {
    items: items,
    loading,
    error,
    page,
    limit,
    total,
    fetchAll,
    deleteItem,
  } = useCrud<any>({
    apiPath: Video_INDEX_API_PATHS.Video,
  });

  const fetchAllWithParams = async (params: any) => {
    try {
      await fetchAll(params);
    } catch (e) {
      console.error("Fetch error:", e);
    }
  };
  const debouncedFetch = useDebouncedFn(
    fetchAllWithParams,
    Number(import.meta.env.VITE_DEBOUNCE_DURATION),
    loading
  );

  const fetchData = async (newPage?: number, newLimit?: number) => {
    loading.value = true;
    try {
      await fetchAll({
        page: newPage ?? page.value,
        limit: newLimit ?? limit.value,
        search: searchTerm.value,
      });
    } catch (e) {
      console.error("Fetch error:", e);
    } finally {
      loading.value = false;
    }
  };

  //  Watch searchTerm for filtering
  watch(searchTerm, (newTerm) => {
    debouncedFetch({
      page: 1,
      limit: limit.value,
      search: newTerm,
      category: searchCategory.value,
    });
  });

  watch(searchCategory, (newTerm) => {
    debouncedFetch({
      page: 1,
      limit: limit.value,
      search: searchTerm.value,
      category: newTerm,
    });
  });

  onMounted(async () => {
    const [categoryResponse] = await Promise.all([
      apiRequest<any>(`${Video_INDEX_API_PATHS.PrepareData}`, {
        method: "GET",
      }),
    ]);
    if (categoryResponse) {
      categories.value = categoryResponse.data || [];
    }
  });

  const openNewForm = () => {
    router.push({ name: "video-new" });
  };

  const editItem = (item: Video) => {
    router.push({ name: "video-edit", params: { id: item.id } });
  };

  const viewItem = (role: any) => {
    router.push({ name: "video-view", params: { id: role.id } });
  };

  const confirmDeleteItem = (event: Event, item: Video) => {
    confirm.require({
      target: event.currentTarget as HTMLElement,
      message: t("videos.confirmDelete"),
      icon: "pi pi-exclamation-triangle",
      acceptClass: "p-button-danger",
      accept: async () => {
        if (item.id) {
          try {
            await deleteItem(item.id);
            showSuccess(t("common.success"), t("videos.deleted"));
            await fetchData(page.value, limit.value);
          } catch (e) {
            showError(error.value || "Something went wrong");
            console.error("Delete error:", e);
          }
        }
      },
      reject: () => {
        showInfo(t("common.info"), t("videos.notDeleted"));
      },
    });
  };

  return {
    t,
    searchTerm,
    items,
    loading,
    error,
    categories,
    searchCategory,
    page,
    limit,
    total,
    fetchData,
    openNewForm,
    viewItem,
    editItem,
    confirmDeleteItem,
  };
}
