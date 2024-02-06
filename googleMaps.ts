import { Hospital } from "./parseCsv.ts";
import { PlaceTypes, GoogleMapsPlace, BusinessStatus } from "./places.d.ts";

export async function searchForPlace(
  hospital: Hospital,
): Promise<GoogleMapsPlace> {
  const uri = "https://maps.googleapis.com/maps/api/place/textsearch/json";

  const apiKey = Deno.env.get("GOOGLE_MAPS_API_KEY");
  if (!apiKey) {
    throw new Error("No Google Maps API key found");
  }

  const query = `${hospital.name} in ${hospital.city}, ${hospital.state}`;

  const response = await fetch(
    `${uri}?query=${query}&key=${apiKey}&type=hospital`,
  );

  if (!response.ok) {
    throw new Error("🛑 Unable to fetch place data");
  }

  const { results } = await response.json();

  if (!results || results.length === 0) {
    throw new Error("🛑 No places found");
  }

  if (results.length > 1) {
    throw new Error(`⚠️ Potential conflict, found ${results.length} results`);
  }

  const place = results[0] as GoogleMapsPlace;

  if (!!place.business_status && place.business_status !== "OPERATIONAL") {
    throw new Error("⚠️ Place is not operational");
  }

  if (!place.types.includes("hospital")) {
    throw new Error("⚠️ Place is not a hospital");
  }

  if (!place.photos || place.photos.length === 0) {
    throw new Error("⚠️ Place has no photos");
  }

  if (!place.geometry) {
    throw new Error("⚠️ Place has no geometry");
  }

  await getPlacePhoto(place.photos[0].photo_reference);

  return results[0] as GoogleMapsPlace;
}

async function getPlacePhoto(
  photo_reference: string | undefined,
): Promise<void> {
  if (!photo_reference) {
    return undefined;
  }
  const uri = "https://maps.googleapis.com/maps/api/place/photo";

  const maxWidth = 480;

  const apiKey = Deno.env.get("GOOGLE_MAPS_API_KEY");
  if (!apiKey) {
    throw new Error("No Google Maps API key found");
  }

  const response = await fetch(
    `${uri}?maxWidth=${maxWidth}&key=${apiKey}&photo_reference=${photo_reference}`,
  );

  console.log(await response.blob());
}
