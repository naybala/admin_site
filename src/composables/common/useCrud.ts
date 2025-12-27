// useCrud.ts
import { ref } from "vue";
import type { Ref } from "vue";
import type { CrudOptions } from "@customTypes/crudType";
import { apiRequest } from "./useApi";
import { handleFastLoading } from "@/utils/useFastLoading";

export function useCrud<T extends { id?: string | number }>(
  options: CrudOptions<T>
) {
  const { apiPath } = options;

  const items: Ref<T[]> = ref([]);
  const loading = ref(true);
  const error = ref<string | null>(null);
  const selectedItem: Ref<T | null> = ref(null);
  const total: Ref<number> = ref(0);
  const page: Ref<number> = ref(1);
  const limit: Ref<number> = ref(10);

  const fetchAll = async (
    queryParams: Record<string, any> = {},
    isNormal: string = "GET"
  ) => {
    console.log("Index Api Called");
    error.value = null;
    try {
      // Merge default pagination with custom query params
      const params = new URLSearchParams({
        ...queryParams,
        page: queryParams.page?.toString() || page.value.toString(),
        limit: queryParams.limit?.toString() || limit.value.toString(),
      }).toString();

      const result = await apiRequest<{
        data: {
          data: T[];
          total: number;
          page?: number;
          limit?: number;
        };
      }>(`${apiPath}?${params}`, { method: isNormal });
      console.log(apiPath, params);

      items.value = result.data.data;
      total.value = result.data.total ?? result.data.data.length;

      //This is for debug and tracing.
      //console.log(items.value, total.value);

      // Update page and limit from query params if provided
      if (queryParams.page) page.value = parseInt(queryParams.page);
      if (queryParams.limit) limit.value = parseInt(queryParams.limit);

      return result;
    } catch (e: any) {
      errorReval(error, e);
    } finally {
      await handleFastLoading(loading);
    }
  };

  const fetchOne = async (id: string | string[]) => {
    console.log("Show Api Called");
    error.value = null;
    try {
      const result = await apiRequest<any>(`${apiPath}/${id}`);
      selectedItem.value = Array.isArray(result) ? result : result.data;
      return result;
    } catch (e: any) {
      errorReval(error, e);
    }
  };

  const createItem = async (item: T) => {
    console.log("Create Api Called");
    loading.value = true;
    error.value = null;
    try {
      const newItem = await apiRequest<T>(apiPath, {
        method: "POST",
        body: JSON.stringify(item),
      });
      await fetchAll(); // Refresh data after creation
      return newItem;
    } catch (e: any) {
      errorReval(error, e);
    } finally {
      loading.value = false;
    }
  };

  const updateItem = async (
    updatedFields: any,
    isWantToRefresh: boolean = true
  ) => {
    loading.value = true;
    error.value = null;
    try {
      const updatedItem = await apiRequest<T>(
        `${apiPath}/${updatedFields?.id}`,
        {
          method: "PUT",
          body: JSON.stringify(updatedFields),
        }
      );
      if (isWantToRefresh) {
        await fetchAll(); // Refresh data after update
      }
      console.log(updatedItem);

      return updatedItem;
    } catch (e: any) {
      errorReval(error, e);
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const deleteItem = async (id: string | number) => {
    console.log("Delete Api Called");
    loading.value = true;
    error.value = null;
    try {
      await apiRequest(`${apiPath}/${id}`, {
        method: "DELETE",
      });
      await fetchAll(); // Refresh data after deletion
    } catch (e: any) {
      errorReval(error, e);
    } finally {
      loading.value = false;
    }
  };

  const customizeApi = async (data: any, method: string, url: string) => {
    try {
      await apiRequest<any>(`${url}`, {
        method: method,
        body: JSON.stringify(data),
      });
    } catch (e: any) {
      errorReval(error, e);
    } finally {
      loading.value = false;
    }
  };

  const errorReval = (error: any, e: any) => {
    const responseData = e.responseData;
    if (responseData?.errors && Array.isArray(responseData.errors)) {
      error.value = responseData.errors
        .map((err: any) => err.message)
        .join(", ");
    } else if (typeof responseData === "object") {
      error.value = Object.values(responseData.errors).join(`\n`);
    } else {
      console.log("here");
      error.value =
        responseData?.message || e.message || "An unknown error occurred.";
    }
    console.log(error.value);
    throw e;
  };

  return {
    items,
    loading,
    error,
    selectedItem,
    page,
    limit,
    total,
    fetchAll,
    fetchOne,
    createItem,
    updateItem,
    deleteItem,
    errorReval,
    customizeApi,
  };
}
