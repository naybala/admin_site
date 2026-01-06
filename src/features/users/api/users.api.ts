import { apiRequest } from "@/composables/common/useApi";

const USER_API_PATHS = {
  Users: "/users",
  PrepareData: "/users/prepare-data-for-store",
  Roles: "/roles/get-all",
  Associations: "/associations/options",
};

export const usersApi = {
  getList: (params: {
    page: number;
    limit: number;
    search?: string;
    phoneNumberPrefix?: string;
    roleId?: string;
    associationId?: string;
  }) => {
    const query = new URLSearchParams(params as any).toString();
    return apiRequest<{
      data: {
        data: any[];
        total: number;
      };
    }>(`${USER_API_PATHS.Users}?${query}`, {
      method: "GET",
    });
  },

  getDetail: (id: string) =>
    apiRequest<any>(`${USER_API_PATHS.Users}/${id}`, {
      method: "GET",
    }),

  getPrepareData: () =>
    apiRequest<any>(USER_API_PATHS.PrepareData, {
      method: "GET",
    }),

  getRoles: () =>
    apiRequest<any>(USER_API_PATHS.Roles, {
      method: "GET",
    }),

  getAssociations: () =>
    apiRequest<any>(USER_API_PATHS.Associations, {
      method: "GET",
    }),

  create: (data: any) =>
    apiRequest<any>(USER_API_PATHS.Users, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: string, data: any) =>
    apiRequest<any>(`${USER_API_PATHS.Users}/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiRequest<any>(`${USER_API_PATHS.Users}/${id}`, {
      method: "DELETE",
    }),
};
