import { ref, nextTick, watch, onMounted } from "vue";
import { loadGoogleMaps } from "@/utils/loadGoogleMaps";

export function useMapPriceData(props: any, emit: any) {
  const mapContainer = ref<HTMLElement | null>(null);
  const fallbackPosition = { lat: 11.5564, lng: 104.9282 };
  const lat = ref(fallbackPosition.lat);
  const lng = ref(fallbackPosition.lng);

  let map: google.maps.Map | null = null;
  let marker: google.maps.Marker | null = null;
  let userMarker: google.maps.Marker | null = null;
  let infoWindow: google.maps.InfoWindow | null = null;

  const url =
    import.meta.env.VITE_INVA_MAP_PRICE_URL ||
    "https://api.invaestate.com/v2/api/bayon-app/request-land-price-estimation";
  const username = import.meta.env.VITE_INVA_USER_NAME || "bayonapp";
  const password =
    import.meta.env.VITE_INVA_USER_PASSWORD || "Nwqf5fODgtn3lAW2";

  /** Fetch price estimate from API */
  const calculatePrice = async (lat: number, lng: number) => {
    const authHeader = "Basic " + btoa(`${username}:${password}`);
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          latitude: lat,
          longitude: lng,
          land_area: 100,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      return result?.data?.estimated_price ?? "No price available";
    } catch (error) {
      console.error("Error fetching price:", error);
      return "Error fetching price";
    }
  };

  /** Format price nicely */
  const formatPrice = (price: string): string => {
    const numericValue = parseFloat(
      price?.replace(/\$/g, "").replace(/,/g, "").trim()
    );
    if (!price || isNaN(numericValue)) return "No Price available!";

    if (price.includes("-")) {
      const [min, max] = price
        .replace(/\$/g, "")
        .split("-")
        .map((p: any) => parseFloat(p.replace(/,/g, "").trim()));
      if (!isNaN(min) && !isNaN(max)) {
        return `${(min / 1000).toFixed(0)}K - ${(max / 1000).toFixed(0)}K`;
      }
    } else {
      const num = parseFloat(price.replace(/\$/g, "").replace(/,/g, ""));
      return !isNaN(num) ? `${(num / 1000).toFixed(0)}K` : price;
    }
    return price;
  };

  /** Initialize Google Map */
  const initMap = (latitude: number, longitude: number) => {
    if (!mapContainer.value) return;
    const center = new google.maps.LatLng(latitude, longitude);

    map = new google.maps.Map(mapContainer.value, { center, zoom: 15 });

    marker = new google.maps.Marker({
      position: center,
      map,
      title: "Selected Location",
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 0,
      },
    });

    infoWindow = new google.maps.InfoWindow();

    map.addListener("click", async (e: google.maps.MapMouseEvent) => {
      if (!e.latLng) return;
      const clickedLat = e.latLng.lat();
      const clickedLng = e.latLng.lng();

      lat.value = clickedLat;
      lng.value = clickedLng;
      if (marker) marker.setPosition(e.latLng);
      emit("update:position", { lat: clickedLat, lng: clickedLng });

      const width = 170;
      const height = 50;

      // Loading spinner
      const loadingContent = `
        <div class="custom-info-window" style="width:${width}px;height:${height}px;">
          <div role="status" style="display:grid;height:2rem;place-items:center;">
            <div style="position:relative;z-index:0;font-size:1rem;font-weight:700;letter-spacing:0.42ch;">
              <p style="margin:0;color:white;">BAYON APP</p>
              <div style="position:absolute;height:100%;aspect-ratio:1/1;left:0;top:0;border-radius:20%;background-color:rgba(255,255,255,0.3);animation:moveInline 2s ease-in-out infinite;"></div>
              <style>@keyframes moveInline {50% {left:calc(100% - 1rem);}}</style>
            </div>
          </div>
        </div>`;
      infoWindow!.setContent(loadingContent);
      infoWindow!.setPosition(e.latLng);
      infoWindow!.open(map);

      await nextTick();

      // Fetch & display price
      try {
        const price = await calculatePrice(lat.value, lng.value);
        const formattedPrice = formatPrice(price);
        const resultContent = `
          <div class="custom-info-window" style="width:${width}px;">
            <div style="font-size:14px;text-align:center;color:white;padding:6px 2px;margin-bottom:2px;">Min - Max</div>
            <div style="font-size:18px;text-align:center;color:white;padding:6px 2px;margin-bottom:12px;">${formattedPrice}</div>
          </div>`;
        infoWindow!.setContent(resultContent);
      } catch (error) {
        infoWindow!.setContent(
          `<div style="color:red;text-align:center;padding:6px;">Error loading price</div>`
        );
      }
    });
  };

  /** Show user's current location */
  const showUserLocation = () => {
    if (!navigator.geolocation) {
      console.warn("Geolocation is not supported by this browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        const userLatLng = new google.maps.LatLng(userLat, userLng);
        if (!userMarker && map) {
          userMarker = new google.maps.Marker({
            position: userLatLng,
            map,
            title: "This is your current location",
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 8,
              fillColor: "#4285F4",
              fillOpacity: 1,
              strokeWeight: 2,
              strokeColor: "white",
            },
          });
        } else if (userMarker) {
          userMarker.setPosition(userLatLng);
        }
        map?.setCenter(userLatLng);
      },
      (error) => console.warn("Error getting user location:", error.message)
    );
  };

  /** Watch for prop updates */
  watch(
    () => props.initialPosition,
    (newPos) => {
      if (!newPos || !map || !marker) return;
      const newLatLng = new google.maps.LatLng(newPos.lat, newPos.lng);
      marker.setPosition(newLatLng);
    },
    { deep: true }
  );

  /** Mount map */
  onMounted(async () => {
    await loadGoogleMaps();
    const start = props.initialPosition || fallbackPosition;
    lat.value = start.lat;
    lng.value = start.lng;
    await nextTick();
    initMap(lat.value, lng.value);
  });

  return { mapContainer, showUserLocation };
}
