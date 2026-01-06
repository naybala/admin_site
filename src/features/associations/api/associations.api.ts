import { apiRequest } from "@/composables/common/useApi";
import type { Association, AssociationIndex } from "@/types";

export const ASSOCIATION_API_PATHS = {
  Associations: "/associations",
  Countries: "/countries/prepare",
  ShortNames: "/associations/get-distinct-short-name",
};

export const associationsApi = {
  getList: (params: any) => {
    const query = new URLSearchParams(params as any).toString();
    return apiRequest<{
      data: AssociationIndex;
    }>(`${ASSOCIATION_API_PATHS.Associations}?${query}`, {
      method: "GET",
    });
  },

  getDetail: (id: string) =>
    apiRequest<Association>(`${ASSOCIATION_API_PATHS.Associations}/${id}`, {
      method: "GET",
    }),

  create: (data: Partial<Association>) =>
    apiRequest<any>(ASSOCIATION_API_PATHS.Associations, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<Association>) =>
    apiRequest<any>(`${ASSOCIATION_API_PATHS.Associations}/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiRequest<any>(`${ASSOCIATION_API_PATHS.Associations}/${id}`, {
      method: "DELETE",
    }),

  getCountries: () =>
    apiRequest<any>(ASSOCIATION_API_PATHS.Countries, {
      method: "GET",
    }),

  getShortNames: () =>
    apiRequest<any>(ASSOCIATION_API_PATHS.ShortNames, {
      method: "GET",
    }),
};
