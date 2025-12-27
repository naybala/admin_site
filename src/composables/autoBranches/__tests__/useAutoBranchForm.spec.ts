import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { defineComponent } from "vue";
import { useAutoBranchForm } from "../useAutoBranchForm";
import { ref } from "vue";

// --- Mock Vue Router ---
const mockPush = vi.fn();
const mockRoute = {
  params: { id: null as string | null },
  name: "autoBranch-new",
};

vi.mock("vue-router", () => ({
  useRouter: () => ({ push: mockPush }),
  useRoute: () => mockRoute,
}));

// --- Mock i18n ---
vi.mock("vue-i18n", () => ({
  useI18n: () => ({
    t: (key: string) => key,
  }),
}));

// --- Mock Toasts ---
vi.mock("@/composables/common/useAppToast", () => ({
  useAppToast: () => ({
    showSuccess: vi.fn(),
    showError: vi.fn(),
  }),
}));

// --- Mock CRUD ---
const mockCreateItem = vi.fn();
const mockUpdateItem = vi.fn();
const mockFetchOne = vi.fn();

vi.mock("@/composables/common/useCrud", () => ({
  useCrud: () => ({
    selectedItem: ref(null),
    loading: ref(false),
    error: ref(null),
    fetchOne: mockFetchOne,
    createItem: mockCreateItem,
    updateItem: mockUpdateItem,
  }),
}));

// --- Mock Validation ---
vi.mock("../validateAutoBranchForm", () => ({
  validateAutoBranchForm: vi.fn(() => ({})),
}));

// --- Mock API Paths ---
vi.mock("../apiPaths", () => ({
  AutoBranch_CREATE_API_PATHS: {
    AutoBranch: "/api/auto-branches",
    PrepareData: "/api/auto-branches/prepare-data",
  },
}));

// --- Mock API Request ---
vi.mock("@/composables/common/useApi", () => ({
  apiRequest: vi.fn(() => Promise.resolve({ data: [] })),
}));

// --- Helper to mount composable ---
function mountUseAutoBranchForm() {
  let result: ReturnType<typeof useAutoBranchForm>;
  mount(
    defineComponent({
      setup() {
        result = useAutoBranchForm();
        return () => null;
      },
    })
  );
  return result!;
}

describe("useAutoBranchForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockRoute.params.id = null;
    mockRoute.name = "autoBranch-new";
  });

  it("should be defined", () => {
    expect(useAutoBranchForm).toBeDefined();
  });

  it("should have the correct initial state", () => {
    const { form, state } = mountUseAutoBranchForm();
    const { isEditMode, isShowMode, saving } = state;

    expect(form.value.name).toBe("");
    expect(isEditMode).toBe(false);
    expect(isShowMode).toBe(false);
    expect(saving).toBe(false);
  });

  it("should call createItem when save is called in create mode", async () => {
    const { save, form } = mountUseAutoBranchForm();
    form.value = { name: "Test" } as any;
    await save();
    expect(mockCreateItem).toHaveBeenCalled();
  });

  it("should call updateItem when save is called in edit mode", async () => {
    mockRoute.name = "autoBranch-edit";
    mockRoute.params.id = "1";
    const { save, form } = mountUseAutoBranchForm();
    form.value = { id: "1", name: "Test" } as any;
    await save();
    expect(mockUpdateItem).toHaveBeenCalled();
  });

  it("should navigate to index route when cancel is called", () => {
    const { cancel } = mountUseAutoBranchForm();
    cancel();
    expect(mockPush).toHaveBeenCalledWith({ name: "autoBranches" });
  });

  it("should call fetchOne in edit mode when initialized", async () => {
    mockRoute.name = "autoBranch-edit";
    mockRoute.params.id = "1";

    mountUseAutoBranchForm(); // onMounted(init) should trigger fetchOne

    expect(mockFetchOne).toHaveBeenCalledWith("1");
  });
});
