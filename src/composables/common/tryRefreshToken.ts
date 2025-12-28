import { useAuthStore } from "@/stores/auth";

export async function tryRefreshToken(): Promise<boolean> {
  const authStore = useAuthStore();
  console.log(" i am refresh token");

  try {
    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}//auth/refresh-token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    if (!response.ok) return false;

    const res = await response.json();
    const newAccessToken = res.data?.accessToken;
    if (newAccessToken) {
      authStore.token = newAccessToken;
      return true;
    }

    return false;
  } catch (error) {
    console.error("Refresh token error:", error);
    return false;
  }
}
