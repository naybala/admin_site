<template>
  <div>
    <!-- Map -->
    <div
      ref="mapContainer"
      class="map-container"
      style="width: 100%; height: 600px"
    ></div>

    <!-- Coordinates Display -->
    <div class="mt-4">
      <label class="block text-sm font-medium mb-1">Coordinates</label>
      <input
        type="text"
        class="w-full border rounded px-3 py-2 bg-gray-100 dark:bg-gray-600"
        :value="coordinateDisplay"
        readonly
      />
    </div>

    <!-- Nearby Places -->
    <div class="mt-4">
      <h3 class="text-lg font-semibold mb-2">Nearby Popular Places</h3>
      <ul v-if="nearbyPlaces.length" class="list-disc pl-5">
        <li v-for="place in nearbyPlaces" :key="place.place_id">
          <strong>{{ place.name }}</strong>
          <div class="text-sm text-gray-500 italic">
            {{ formatDistance(place.distance) }}
          </div>
        </li>
      </ul>
      <p v-else class="text-gray-500">No places found nearby.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from "vue";
import { loadGoogleMaps } from "@/utils/loadGoogleMaps";

// Props
const props = defineProps<{
  initialPosition?: { lat: number; lng: number } | null;
  initialNearby?: any[];
  readonly?: boolean;
}>();

const emit = defineEmits(["update:address", "update:nearBy"]);

// Default fallback
const fallbackPosition = { lat: 11.5564, lng: 104.9282 };

// Coordinates
const lat = ref<number>(fallbackPosition.lat);
const lng = ref<number>(fallbackPosition.lng);

// Map references
const mapContainer = ref<HTMLElement | null>(null);
let map: google.maps.Map | null = null;
let marker: google.maps.Marker | null = null;
let placesService: google.maps.places.PlacesService | null = null;

const placeMarkers: google.maps.Marker[] = [];
const nearbyPlaces = ref<any[]>([]);
const isMapInitialized = ref(false);
const hasUserInteracted = ref(false);

const coordinateDisplay = computed(() =>
  lat.value && lng.value ? `${lat.value}, ${lng.value}` : "Loading..."
);

const formatDistance = (distance: number | null | undefined) => {
  if (distance == null) return "Distance unknown";
  return `${Math.round(distance)} m away`;
};

const MAX_DISTANCE_METERS = import.meta.env.VITE_NEAR_BY_DISTANCE_RANGE;
const NEARBY_RADIUS = import.meta.env.VITE_NEAR_BY_RADIUS;
const NEARBY_TYPES = import.meta.env.VITE_NEAR_BY_PLACES;

// Load nearby places
const fetchNearbyPlaces = (latitude: number, longitude: number) => {
  if (!placesService || !google.maps) return;

  const center = new google.maps.LatLng(latitude, longitude);

  const request: google.maps.places.PlaceSearchRequest = {
    location: center,
    radius: NEARBY_RADIUS,
    type: NEARBY_TYPES,
  };

  // Clear old markers
  placeMarkers.forEach((m) => m.setMap(null));
  placeMarkers.length = 0;

  placesService.nearbySearch(request, (results, status) => {
    if (status === google.maps.places.PlacesServiceStatus.OK && results) {
      const placesWithDistance = results
        .map((place) => {
          let distance = null;
          if (place.geometry?.location) {
            distance = google.maps.geometry.spherical.computeDistanceBetween(
              center,
              place.geometry.location
            );
          }
          return {
            ...place,
            distance,
          };
        })
        .filter(
          (place) => place.distance !== null && place.distance <= MAX_DISTANCE_METERS
        );

      const enrichedPlaces: any[] = [];
      let completed = 0;

      placesWithDistance.forEach((place) => {
        if (!place.place_id) return;

        const detailsRequest: google.maps.places.PlaceDetailsRequest = {
          placeId: place.place_id,
          fields: ["opening_hours", "name"],
        };

        placesService!.getDetails(detailsRequest, (details, status) => {
          completed++;

          const isOpenNow =
            status === google.maps.places.PlacesServiceStatus.OK &&
            details?.opening_hours?.isOpen?.();

          const businessStatus = details?.business_status ?? "UNKNOWN";

          enrichedPlaces.push({
            ...place,
            isOpenNow: isOpenNow ?? null,
            businessStatus,
          });

          if (completed === placesWithDistance.length) {
            nearbyPlaces.value = enrichedPlaces;
            emit("update:nearBy", enrichedPlaces);
          }
        });
      });
    } else {
      nearbyPlaces.value = [];
    }
  });
};

// Initialize Map
const initMap = (latitude: number, longitude: number) => {
  if (!mapContainer.value) return;

  const center = new google.maps.LatLng(latitude, longitude);

  map = new google.maps.Map(mapContainer.value as HTMLElement, {
    center,
    zoom: 15,
  });

  placesService = new google.maps.places.PlacesService(map);

  // Create marker with the initial position
  marker = new google.maps.Marker({
    position: center,
    map,
    title: "Selected Location",
    draggable: !props.readonly, // Make marker draggable only if not readonly
  });

  // If we have initial nearby places, use them
  if (props.initialNearby && props.initialNearby.length > 0) {
    nearbyPlaces.value = props.initialNearby;
  } else {
    fetchNearbyPlaces(latitude, longitude);
  }

  // Add click listener for map clicks (only if not readonly)
  if (!props.readonly) {
    map.addListener("click", (e: google.maps.MapMouseEvent) => {
      if (e.latLng) {
        const clickedLat = e.latLng.lat();
        const clickedLng = e.latLng.lng();

        lat.value = clickedLat;
        lng.value = clickedLng;

        marker!.setPosition(e.latLng);

        emit("update:address", { lat: clickedLat, lng: clickedLng });
        fetchNearbyPlaces(clickedLat, clickedLng);

        // Mark that user has interacted
        hasUserInteracted.value = true;
      }
    });

    // Add drag listener for marker (only if not readonly)
    marker.addListener("dragend", (e: google.maps.MapMouseEvent) => {
      if (e.latLng) {
        const draggedLat = e.latLng.lat();
        const draggedLng = e.latLng.lng();

        lat.value = draggedLat;
        lng.value = draggedLng;

        emit("update:address", { lat: draggedLat, lng: draggedLng });
        fetchNearbyPlaces(draggedLat, draggedLng);

        // Mark that user has interacted
        hasUserInteracted.value = true;
      }
    });
  }

  isMapInitialized.value = true;
};

// Update map position - Different behavior for each mode
const updateMapPosition = (position: { lat: number; lng: number }) => {
  if (!map || !marker) return;

  const newLatLng = new google.maps.LatLng(position.lat, position.lng);

  // console.log("updateMapPosition called:", {
  //   readonly: props.readonly,
  //   hasUserInteracted: hasUserInteracted.value,
  //   position,
  // });

  // Simple logic:
  // - In view mode: Always center
  // - In edit/create mode: Center only if user hasn't interacted yet
  if (props.readonly) {
    // View mode: Always center
    map.setCenter(newLatLng);
    marker.setPosition(newLatLng);
  } else {
    // Edit/Create mode: Center only if user hasn't interacted
    if (!hasUserInteracted.value) {
      map.setCenter(newLatLng);
      marker.setPosition(newLatLng);
    } else {
      // User has interacted, only update marker position
      marker.setPosition(newLatLng);
    }
  }

  // Update coordinates
  lat.value = position.lat;
  lng.value = position.lng;

  // Fetch nearby places at the new position
  fetchNearbyPlaces(position.lat, position.lng);
};

// Watch for `initialPosition` updates
watch(
  () => props.initialPosition,
  (newPosition) => {
    // console.log("initialPosition watch triggered:", newPosition);
    if (newPosition && isFinite(newPosition.lat) && isFinite(newPosition.lng)) {
      lat.value = newPosition.lat;
      lng.value = newPosition.lng;

      if (isMapInitialized.value) {
        updateMapPosition(newPosition);
      }
    }
  },
  { deep: true, immediate: true }
);

// On mount: load Google Maps and initialize
onMounted(async () => {
  try {
    await loadGoogleMaps();

    // Determine initial position - prioritize props.initialPosition
    let initialPosition = fallbackPosition;
    if (
      props.initialPosition &&
      isFinite(props.initialPosition.lat) &&
      isFinite(props.initialPosition.lng)
    ) {
      initialPosition = props.initialPosition;
      //console.log("Using initialPosition from props:", initialPosition);
    } else {
      //console.log("Using fallback position:", initialPosition);
    }

    lat.value = initialPosition.lat;
    lng.value = initialPosition.lng;

    // Wait for next tick to ensure DOM is ready
    await nextTick();
    initMap(initialPosition.lat, initialPosition.lng);

    //console.log("Map initialized with mode:", props.readonly ? "view" : "edit/create");
  } catch (error) {
    //console.error("Google Maps failed to load:", error);
  }
});
</script>

<style scoped>
.map-container {
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>
