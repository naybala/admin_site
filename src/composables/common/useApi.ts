import { useAuthStore } from "@stores/auth";
import { tryRefreshToken } from "./tryRefreshToken";

export async function apiRequest<T>(
  api: string,
  options: RequestInit = {},
  retrying = false
): Promise<T> {
  const authStore = useAuthStore();
  const token = authStore.token;
  const fullUrl = `${import.meta.env.VITE_BASE_URL}/${api}`;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  try {
    const response = await fetch(fullUrl, {
      ...options,
      credentials:'include',
      headers,
    });
    if (response.status === 401 && !retrying) {
      const refreshed = await tryRefreshToken();
      if (refreshed) {
        return apiRequest<T>(api, options, true); // retry once
      } else {
        authStore.clearAuthData();
        throw new Error("Session expired. Please login again.");
      }
    }

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const error = new Error(data.message || "API request failed");
      (error as any).responseData = data;
      throw error;
    }

    return data;
  } catch (err: any) {
    console.error("API Error:", err);
    throw err;
  }
}
