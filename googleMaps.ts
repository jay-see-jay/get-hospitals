import { Hospital } from "./parseCsv.ts";
import { GoogleMapsPlace } from "./places.ts";
import { SupabaseClient } from "./supabase.ts";

export class GoogleMaps {
  private readonly searchUri: string;
  private readonly apiKey: string;
  private supabase: SupabaseClient;

  constructor() {
    this.searchUri =
      "https://maps.googleapis.com/maps/api/place/textsearch/json";
    const apiKey = Deno.env.get("GOOGLE_MAPS_API_KEY");
    if (!apiKey) {
      throw new Error("No Google Maps API key found");
    }
    this.apiKey = apiKey;
    this.supabase = new SupabaseClient();
  }

  async searchForPlace(hospital: Hospital): Promise<Hospital> {
    const query = `${hospital.name} in ${hospital.city}, ${hospital.state}`;

    const response = await fetch(
      `${this.searchUri}?query=${query}&key=${this.apiKey}&type=hospital`,
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

    if (!place.types || !place.types.includes("hospital")) {
      throw new Error("⚠️ Place is not a hospital");
    }

    if (!place.photos || place.photos.length === 0) {
      throw new Error("⚠️ Place has no photos");
    }

    if (!place.geometry) {
      throw new Error("⚠️ Place has no geometry");
    }

    const imageUrl = await this.getPlacePhoto(
      hospital.cmsId,
      place.photos[0].photo_reference,
    );

    hospital.location = place.geometry.location;
    hospital.imageUrl = imageUrl;
    hospital.googlePlaceId = place.place_id;

    return hospital;
  }

  async getPlacePhoto(
    cmsId: string,
    photo_reference: string | undefined,
  ): Promise<string> {
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
      `${uri}?maxwidth=${maxWidth}&key=${apiKey}&photo_reference=${photo_reference}`,
    );

    const blob = await response.blob();

    const fileName = `${cmsId}.${blob.type.split("/")[1]}`;

    return this.supabase.savePhoto(fileName, blob);
  }
}
