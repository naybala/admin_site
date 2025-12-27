import { Loader } from '@googlemaps/js-api-loader';

let loader: Loader | null = null;

export async function loadGoogleMaps(): Promise<void> {
  if (loader) {
    await loader.load(); // return existing loader promise
    return;
  }

  loader = new Loader({
    apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    version: 'weekly',
    libraries: ['places', 'geometry'],
  });

  await loader.load();
}
