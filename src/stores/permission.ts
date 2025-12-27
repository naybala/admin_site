import { defineStore } from 'pinia';

export const usePermissionStore = defineStore('permission', {
  state: () => ({
    permissions: new Set<string>(),
    ready: false, 
  }),
  actions: {
   setPermissions(perms: string[]) {
      this.permissions = new Set(perms);
      this.ready = true;
    },
    clearPermissions() {
      this.permissions.clear();
      this.ready = false; 
    },
  },
  getters: {    
    hasPermission: (state) => (key: string) => {
      return state.permissions.has(key);
    },
  },
});
