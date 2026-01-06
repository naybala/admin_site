import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: null as string | null,
    userId: null as number | null,
    name: null as string | null,
    roleId: null as number | null,
    _hydrated: false,
  }),

  actions: {
    setAuthData({ token, userId, name, roleId }: any) {
      this.token = token;
      this.userId = userId;
      this.name = name;
      this.roleId = roleId;
    },

    clearAuthData() {
      this.token = null;
      this.userId = null;
      this.name = null;
      this.roleId = null;
    },

    clearAuth() {
      this.clearAuthData();
    },

    // Manual hydration trigger
    async ensureHydrated() {
      if (!this._hydrated) {
        await this.$hydrate();
        this._hydrated = true;
      }
      return this._hydrated;
    },

    // Set hydrated state manually
    setHydrated() {
      this._hydrated = true;
    },
  },

  getters: {
    isAuthenticated: (state) => !!state.token,
    userRole: (state) => state.roleId,
    userName: (state) => state.name,
    isHydrated: (state) => state._hydrated,
  },

  persist: {
    storage: localStorage,
  },
});
