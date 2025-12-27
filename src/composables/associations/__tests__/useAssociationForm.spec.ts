import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { defineComponent, ref } from "vue";
import { useAssociationForm } from "../useAssociationForm";

const mockPush = vi.fn();
const mockRoute = {
  params: { id: null as string | null },
  name: "association-new",
};

vi.mock("vue-router", () => ({
  useRouter: () => ({ push: mockPush }),
  useRoute: () => mockRoute,
}));

vi.mock("@/composables/common/useAppToast", () => ({
  useAppToast: () => ({
    showSuccess: vi.fn(),
    showError: vi.fn(),
  }),
}));

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

vi.mock("../validateAssociationForm", () => ({
  validateAssociationForm: () => ({}),
}));

vi.mock("../apiPaths", () => ({
  ASSOCIATION_CREATE_API_PATHS: {
    Associations: "/api/associations",
    Countries: "/api/countries",
    ShortNames: "/api/shortnames",
  },
}));

//  Helper to mount composable inside a component
function mountUseAssociationForm() {
  let result: ReturnType<typeof useAssociationForm>;
  mount(
    defineComponent({
      setup() {
        result = useAssociationForm();
        return () => null;
      },
    })
  );
  return result!;
}

describe("useAssociationForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockRoute.params.id = null;
    mockRoute.name = "association-new";
  });

  it("should be defined", () => {
    expect(useAssociationForm).toBeDefined();
  });

  it("should have the correct initial state", () => {
    const { form, isEditMode, isShowMode, saving } = mountUseAssociationForm();
    expect(form.value.name).toBe("");
    expect(isEditMode.value).toBe(false);
    expect(isShowMode.value).toBe(false);
    expect(saving.value).toBe(false);
  });

  it("should call createItem when save is called in create mode", async () => {
    const { save, form } = mountUseAssociationForm();
    form.value = { name: "Test" } as any;
    await save();
    expect(mockCreateItem).toHaveBeenCalled();
  });

  it("should call updateItem when save is called in edit mode", async () => {
    mockRoute.name = "association-edit";
    mockRoute.params.id = "1";
    const { save, form } = mountUseAssociationForm();
    form.value = { id: "1", name: "Test" } as any;
    await save();
    expect(mockUpdateItem).toHaveBeenCalled();
  });

  it("should call router.push when cancel is called", () => {
    const { cancel } = mountUseAssociationForm();
    cancel();
    expect(mockPush).toHaveBeenCalledWith({ name: "associations" });
  });

  it("should call fetchOne in edit mode", async () => {
    mockRoute.name = "association-edit";
    mockRoute.params.id = "1";
    const { loadInitialData } = mountUseAssociationForm();
    await loadInitialData();
    expect(mockFetchOne).toHaveBeenCalledWith("1");
  });
});
