import { describe, it, expect, vi, beforeEach } from "vitest";
import { ref } from "vue";
import { useAgentTable } from "../useAgentTable";

import { useRouter } from "vue-router";
import { useCrud } from "../../common/useCrud";
import { useConfirm } from "primevue/useconfirm";
import { useAppToast } from "../../common/useAppToast";

// --- Mocks ---
vi.mock("vue-router", () => ({
  useRouter: vi.fn(),
}));

vi.mock("vue-i18n", () => ({
  useI18n: () => ({ t: (x: string) => x }),
}));

vi.mock("primevue/useconfirm", () => ({
  useConfirm: vi.fn(),
}));

vi.mock("../../common/useCrud", () => ({
  useCrud: vi.fn(),
}));

vi.mock("../../common/useAppToast", () => ({
  useAppToast: vi.fn(),
}));

vi.mock("../../common/useDebouncedFn", () => ({
  useDebouncedFn: (fn: any) => fn,
}));

// ---------------------------------------------------

describe("useAgentTable", () => {
  let mockRouterPush: any;
  let mockFetchAll: any;
  let mockDeleteItem: any;
  let mockConfirmRequire: any;

  beforeEach(() => {
    vi.clearAllMocks();

    mockRouterPush = vi.fn();
    mockFetchAll = vi.fn();
    mockDeleteItem = vi.fn();
    mockConfirmRequire = vi.fn();

    (useRouter as any).mockReturnValue({ push: mockRouterPush });
    (useCrud as any).mockReturnValue({
      items: ref([]),
      loading: ref(false),
      error: ref(null),
      page: ref(1),
      limit: ref(10),
      total: ref(0),
      fetchAll: mockFetchAll,
      deleteItem: mockDeleteItem,
    });

    (useConfirm as any).mockReturnValue({ require: mockConfirmRequire });
    (useAppToast as any).mockReturnValue({
      showSuccess: vi.fn(),
      showInfo: vi.fn(),
      showError: vi.fn(),
    });
  });

  const mountUseAgentTable = () => useAgentTable();

  // ---------------------------------------------------

  it("should be defined", () => {
    expect(useAgentTable).toBeDefined();
  });

  it("should call fetchAll when fetchData is called", async () => {
    const { fetchData } = mountUseAgentTable();
    await fetchData(1, 10);
    expect(mockFetchAll).toHaveBeenCalled();
  });

  it("should navigate to 'agent-new' when openNewForm is called", () => {
    const { openNewForm } = mountUseAgentTable();
    openNewForm();
    expect(mockRouterPush).toHaveBeenCalledWith({ name: "agent-new" });
  });

  it("should navigate to 'agent-edit' when editItem is called", () => {
    const { editItem } = mountUseAgentTable();
    editItem({ id: "1", name: "Test" } as any);
    expect(mockRouterPush).toHaveBeenCalledWith({
      name: "agent-edit",
      params: { id: "1" },
    });
  });

  it("should navigate to 'agent-view' when viewItem is called", () => {
    const { viewItem } = mountUseAgentTable();
    viewItem({ id: "1", name: "Test" } as any);
    expect(mockRouterPush).toHaveBeenCalledWith({
      name: "agent-view",
      params: { id: "1" },
    });
  });

  it("should trigger confirm dialog when confirmDeleteItem is called", () => {
    const { confirmDeleteItem } = mountUseAgentTable();
    confirmDeleteItem({ id: "1", name: "Test" } as any);
    expect(mockConfirmRequire).toHaveBeenCalled();
  });
});
