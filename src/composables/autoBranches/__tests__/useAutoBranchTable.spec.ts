import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { defineComponent, ref } from "vue";
import { useAutoBranchTable } from "../useAutoBranchTable";

// --- Mock Vue Router ---
const mockPush = vi.fn();
vi.mock("vue-router", () => ({
  useRouter: () => ({ push: mockPush }),
}));

// --- Mock i18n ---
vi.mock("vue-i18n", () => ({
  useI18n: () => ({
    t: (key: string) => key,
  }),
}));

// --- Mock Confirm ---
const mockRequire = vi.fn();
vi.mock("primevue/useconfirm", () => ({
  useConfirm: () => ({ require: mockRequire }),
}));

// --- Mock Toast ---
vi.mock("@/composables/common/useAppToast", () => ({
  useAppToast: () => ({
    showSuccess: vi.fn(),
    showInfo: vi.fn(),
    showError: vi.fn(),
  }),
}));

// --- Mock CRUD ---
const mockFetchAll = vi.fn();
const mockDeleteItem = vi.fn();

vi.mock("@/composables/common/useCrud", () => ({
  useCrud: () => ({
    items: ref([]),
    loading: ref(false),
    error: ref(null),
    page: ref(1),
    limit: ref(10),
    total: ref(0),
    fetchAll: mockFetchAll,
    deleteItem: mockDeleteItem,
  }),
}));

// --- Mock Debounced Fn ---
const mockDebouncedFn = vi.fn();
vi.mock("@/composables/common/useDebouncedFn", () => ({
  useDebouncedFn: () => mockDebouncedFn,
}));

// --- Mock API Paths ---
vi.mock("../apiPaths", () => ({
  AutoBranch_INDEX_API_PATHS: {
    AutoBranch: "/api/auto-branches",
  },
}));

// --- Helper ---
function mountUseAutoBranchTable() {
  let result: ReturnType<typeof useAutoBranchTable>;
  mount(
    defineComponent({
      setup() {
        result = useAutoBranchTable();
        return () => null;
      },
    })
  );
  return result!;
}

describe("useAutoBranchTable", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should be defined", () => {
    expect(useAutoBranchTable).toBeDefined();
  });

  it("should have the correct initial state", () => {
    const { items, loading, page, limit, total } = mountUseAutoBranchTable();
    expect(items.value).toEqual([]);
    expect(loading.value).toBe(false);
    expect(page.value).toBe(1);
    expect(limit.value).toBe(10);
    expect(total.value).toBe(0);
  });

  it("should call fetchAll when fetchData is called", async () => {
    const { fetchData } = mountUseAutoBranchTable();
    await fetchData();
    expect(mockFetchAll).toHaveBeenCalled();
  });

  it("should call router.push with the correct route when openNewForm is called", () => {
    const { openNewForm } = mountUseAutoBranchTable();
    openNewForm();
    expect(mockPush).toHaveBeenCalledWith({ name: "autoBranch-new" });
  });

  it("should call router.push with correct route and params when editItem is called", () => {
    const { editItem } = mountUseAutoBranchTable();
    editItem({ id: "1", name: "Test" } as any);
    expect(mockPush).toHaveBeenCalledWith({
      name: "autoBranch-edit",
      params: { id: "1" },
    });
  });

  it("should call router.push with correct route and params when viewItem is called", () => {
    const { viewItem } = mountUseAutoBranchTable();
    viewItem({ id: "1", name: "Test" } as any);
    expect(mockPush).toHaveBeenCalledWith({
      name: "autoBranch-view",
      params: { id: "1" },
    });
  });

  it("should call confirm.require when confirmDeleteItem is called", () => {
    const { confirmDeleteItem } = mountUseAutoBranchTable();
    confirmDeleteItem({ id: "1", name: "Test" } as any);
    expect(mockRequire).toHaveBeenCalled();
  });
});
