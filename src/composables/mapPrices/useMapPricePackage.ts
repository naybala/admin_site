import { ref } from "vue";

export function useMapPricePackage() {
  const packages = ref<any[]>([]);
  const pkgLoading = ref(false);
  const error = ref<string | null>(null);

  // Fetch packages from API
  const fetchMapPricePackage = async () => {
    pkgLoading.value = true;
    error.value = null;

    try {
      // You can load from .env for flexibility
      const url =
        import.meta.env.VITE_INVA_PKG_API_URL ||
        "https://api.invaestate.com/v2/api/bayon-app/get-package-plans";

      const username = import.meta.env.VITE_INVA_USER_NAME || "bayonapp";
      const password =
        import.meta.env.VITE_INVA_USER_PASSWORD || "Nwqf5fODgtn3lAW2";

      const authHeader = "Basic " + btoa(`${username}:${password}`);

      const response = await fetch(url, {
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const result = await response.json();
      if (result?.status && Array.isArray(result?.data)) {
        // Transform response to match your component props
        packages.value = result.data.map((pkg: any) => ({
          id: pkg.id,
          name: pkg.name,
          price: parseFloat(pkg.price),
          currency: "USD",
          duration: pkg.period.toLowerCase().includes("year") ? 12 : 1,
          features: pkg.features,
          savings: pkg.savings,
          popular: pkg.popular === 1,
        }));
      }
    } catch (err: any) {
      console.error("Error fetching packages:", err);
      error.value = err.message || "Failed to fetch package plans";
    } finally {
      pkgLoading.value = false;
    }
  };

  return {
    packages,
    pkgLoading,
    error,
    fetchMapPricePackage,
  };
}
