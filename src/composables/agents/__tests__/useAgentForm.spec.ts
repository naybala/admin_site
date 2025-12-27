import { describe, it, expect, vi, beforeEach } from "vitest";
import { ref, nextTick } from "vue";
import { useAgentForm } from "../useAgentForm";
import { useRouter, useRoute } from "vue-router";
import { useCrud } from "../../common/useCrud";
import { useAppToast } from "../../common/useAppToast";
import { apiRequest } from "../../common/useApi";
import { validateAgentForm } from "../validateAgentForm";
import { mountComposable } from "./utils/mountComposable";

// --- Define the mocks ---
vi.mock("vue-router", () => ({
  useRouter: vi.fn(),
  useRoute: vi.fn(),
}));

vi.mock("vue-i18n", () => ({
  useI18n: () => ({ t: (x: string) => x }),
}));

vi.mock("../../common/useCrud", () => ({
  useCrud: vi.fn(),
}));

vi.mock("../../common/useAppToast", () => ({
  useAppToast: vi.fn(),
}));

vi.mock("../../common/useApi", () => ({
  apiRequest: vi.fn(),
}));

vi.mock("../validateAgentForm", () => ({
  validateAgentForm: vi.fn(),
}));

// ---------------------------------------------------

describe("useAgentForm", () => {
  let mockRouterPush: any;
  let mockRoute: any;
  let mockFetchOne: any;
  let mockCreateItem: any;
  let mockUpdateItem: any;

  beforeEach(() => {
    vi.clearAllMocks();

    mockRouterPush = vi.fn();
    mockFetchOne = vi.fn();
    mockCreateItem = vi.fn();
    mockUpdateItem = vi.fn();

    (useRouter as any).mockReturnValue({ push: mockRouterPush });
    mockRoute = { name: "", params: {} };
    (useRoute as any).mockReturnValue(mockRoute);

    (useCrud as any).mockReturnValue({
      selectedItem: ref(null),
      loading: ref(false),
      error: ref(null),
      fetchOne: mockFetchOne,
      createItem: mockCreateItem,
      updateItem: mockUpdateItem,
    });

    (useAppToast as any).mockReturnValue({
      showSuccess: vi.fn(),
      showError: vi.fn(),
    });

    (apiRequest as any).mockResolvedValue({
      data: {
        countryList: [{ id: 1, name: "USA" }],
        userType: ["Agent"],
      },
    });

    (validateAgentForm as any).mockReturnValue({});
  });

  // ---------------------------------------------------

  it("should be defined", () => {
    expect(useAgentForm).toBeDefined();
  });

  it("should have correct initial state", () => {
    const { form, state } = mountComposable(() => useAgentForm());
    expect(form.value.username).toBe("");
    expect(state.isEditMode).toBe(false);
    expect(state.isShowMode).toBe(false);
  });

  it("should call createItem and navigate when saving new agent", async () => {
    const { save } = mountComposable(() => useAgentForm());
    await save();

    expect(mockCreateItem).toHaveBeenCalled();
    expect(mockRouterPush).toHaveBeenCalledWith({ name: "agents" });
  });

  it("should call updateItem and navigate when editing agent", async () => {
    mockRoute.name = "agent-edit";
    mockRoute.params.id = "1";

    const { save } = mountComposable(() => useAgentForm());
    await save();

    expect(mockUpdateItem).toHaveBeenCalled();
    expect(mockRouterPush).toHaveBeenCalledWith({ name: "agents" });
  });

  it("should navigate to index when cancel is called", () => {
    const { cancel } = mountComposable(() => useAgentForm());
    cancel();

    expect(mockRouterPush).toHaveBeenCalledWith({ name: "agents" });
  });

  it("should call fetchOne in edit mode on mount", async () => {
    mockRoute.name = "agent-edit";
    mockRoute.params.id = "1";

    mountComposable(() => useAgentForm());
    await nextTick(); // allow onMounted to resolve async work

    expect(mockFetchOne).toHaveBeenCalledWith("1");
  });
});
