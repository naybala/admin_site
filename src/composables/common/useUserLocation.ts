import { ref } from "vue";

export function useUserLocation() {
  const autoCountryCode = ref<string | null>(null);
  const autoCountry = ref<string | null>(null);
  const loading = ref<boolean>(false);
  const error = ref<string | null>(null);
  const url =
    import.meta.env.VITE_USER_LOCATION_API ?? "https://ipapi.co/json/";

  const fetchUserLocation = async () => {
    loading.value = true;
    error.value = null;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch location data.");
      }

      const data = await response.json();
      autoCountryCode.value = data.country_calling_code;
      autoCountry.value = data.country;
    } catch (err: any) {
      error.value = err.message || "Unknown error occurred.";
      console.error("IP Location Error:", err);
    } finally {
      loading.value = false;
    }
  };

  return {
    autoCountry,
    autoCountryCode,
    loading,
    error,
    fetchUserLocation,
  };
}
