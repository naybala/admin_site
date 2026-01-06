import { apiRequest } from "@/composables/common/useApi";

const ROLE_API_PATHS = {
  Roles: "/roles",
  AllPermissions: "/roles/get-all-permission",
};

export const rolesApi = {
  getList: (params: { page: number; limit: number; search?: string }) => {
    const query = new URLSearchParams(params as any).toString();
    return apiRequest<{
      data: {
        data: any[];
        total: number;
      };
    }>(`${ROLE_API_PATHS.Roles}?${query}`, {
      method: "GET",
    });
  },

  getDetail: (id: string) =>
    apiRequest<any>(`${ROLE_API_PATHS.Roles}/${id}`, {
      method: "GET",
    }),

  getAllPermissions: () =>
    apiRequest<any>(ROLE_API_PATHS.AllPermissions, {
      method: "GET",
    }),

  create: (data: any) =>
    apiRequest<any>(ROLE_API_PATHS.Roles, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: string, data: any) =>
    apiRequest<any>(`${ROLE_API_PATHS.Roles}/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiRequest<any>(`${ROLE_API_PATHS.Roles}/${id}`, {
      method: "DELETE",
    }),
};
