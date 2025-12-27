import { onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useConfirm } from "primevue/useconfirm";
import { useCrud } from "../common/useCrud";
import { useAppToast } from "../common/useAppToast";
import type { New } from "@customTypes/index";
import { NEW_INDEX_API_PATHS } from "./apiPaths";
import { useDebouncedFn } from "../common/useDebouncedFn";
import { apiRequest } from "../common/useApi";

export function useNewTable() {
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
    apiPath: NEW_INDEX_API_PATHS.New,
  });

  const fetchAllWithParams = async (params: any) => {
    try {
      await fetchAll(params);
    } catch (e) {
      console.error("Fetch error:", e);
    }
  };
  const debouncedFetch = useDebouncedFn(fetchAllWithParams, 300, loading);

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
      apiRequest<any>(`${NEW_INDEX_API_PATHS.PrepareData}`, { method: "GET" }),
    ]);
    if (categoryResponse) {
      categories.value = categoryResponse.data.newsCategories || [];
    }
  });

  const openNewForm = () => {
    router.push({ name: "news-new" });
  };

  const editItem = (item: New) => {
    router.push({ name: "news-edit", params: { id: item.id } });
  };

  const viewItem = (item: New) => {
    router.push({ name: "news-view", params: { id: item.id } });
  };

  const confirmDeleteItem = (item: New) => {
    confirm.require({
      message: t("news.confirmDelete"),
      icon: "pi pi-exclamation-triangle",
      acceptClass: "p-button-danger",
      accept: async () => {
        if (item.id) {
          try {
            await deleteItem(item.id);
            showSuccess(t("common.success"), t("news.deleted"));
            await fetchData(page.value, limit.value);
          } catch (e) {
            showError(error.value || "Something went wrong");
            console.error("Delete error:", e);
          }
        }
      },
      reject: () => {
        showInfo(t("common.info"), t("news.notDeleted"));
      },
    });
  };

  return {
    t,
    searchTerm,
    searchCategory,
    categories,
    items,
    loading,
    error,
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
