import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { defineComponent } from "vue";
import { useAssociationTable } from "../useAssociationTable";
import { ref } from "vue";

const mockPush = vi.fn();
vi.mock("vue-router", () => ({
  useRouter: () => ({ push: mockPush }),
}));

const mockRequire = vi.fn();
vi.mock("primevue/useconfirm", () => ({
  useConfirm: () => ({ require: mockRequire }),
}));

vi.mock("@/composables/common/useAppToast", () => ({
  useAppToast: () => ({
    showSuccess: vi.fn(),
    showInfo: vi.fn(),
    showError: vi.fn(),
  }),
}));

const mockFetchAll = vi.fn();
vi.mock("@/composables/common/useCrud", () => ({
  useCrud: () => ({
    items: ref([]),
    loading: ref(false),
    error: ref(null),
    page: ref(1),
    limit: ref(10),
    total: ref(0),
    fetchAll: mockFetchAll,
    deleteItem: vi.fn(),
  }),
}));

// Helper to mount composable inside a component
function mountUseAssociationTable() {
  let result: ReturnType<typeof useAssociationTable>;
  mount(
    defineComponent({
      setup() {
        result = useAssociationTable();
        return () => null;
      },
    })
  );
  return result!;
}

describe("useAssociationTable", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should be defined", () => {
    expect(useAssociationTable).toBeDefined();
  });

  it("should have the correct initial state", () => {
    const { items, loading, page, limit, total } = mountUseAssociationTable();
    expect(items.value).toEqual([]);
    expect(loading.value).toBe(false);
    expect(page.value).toBe(1);
    expect(limit.value).toBe(10);
    expect(total.value).toBe(0);
  });

  it("should call fetchAll when fetchData is called", async () => {
    const { fetchData } = mountUseAssociationTable();
    await fetchData();
    expect(mockFetchAll).toHaveBeenCalled();
  });

  it("should call router.push with the correct route when openNewForm is called", () => {
    const { openNewForm } = mountUseAssociationTable();
    openNewForm();
    expect(mockPush).toHaveBeenCalledWith({ name: "association-new" });
  });

  it("should call router.push with the correct route and params when editItem is called", () => {
    const { editItem } = mountUseAssociationTable();
    editItem({ id: "1", name: "Test" } as any);
    expect(mockPush).toHaveBeenCalledWith({
      name: "association-edit",
      params: { id: "1" },
    });
  });

  it("should call router.push with the correct route and params when viewItem is called", () => {
    const { viewItem } = mountUseAssociationTable();
    viewItem({ id: "1", name: "Test" } as any);
    expect(mockPush).toHaveBeenCalledWith({
      name: "association-view",
      params: { id: "1" },
    });
  });

  it("should call confirm.require with the correct options when confirmDeleteItem is called", () => {
    const { confirmDeleteItem } = mountUseAssociationTable();
    confirmDeleteItem({ id: "1", name: "Test" } as any);
    expect(mockRequire).toHaveBeenCalled();
  });
});
