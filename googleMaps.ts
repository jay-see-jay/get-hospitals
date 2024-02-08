import { Hospital } from "./parseCsv.ts";
import { GoogleMapsPlace } from "./places.ts";

export class GoogleMaps {
  private readonly searchUri: string;
  private readonly apiKey: string;
  private supabase: SupabaseClient;
  private log: FsFile;
  private encoder: TextEncoder;

  constructor(logFile: FsFile, supabase: SupabaseClient) {
    this.searchUri =
      "https://maps.googleapis.com/maps/api/place/textsearch/json";
    const apiKey = Deno.env.get("GOOGLE_MAPS_API_KEY");
    if (!apiKey) {
      throw new Error("No Google Maps API key found");
    }
    this.apiKey = apiKey;
    this.supabase = supabase;
    this.log = logFile;
    this.encoder = new TextEncoder();
  }

  private async writeLog(entry: string): Promise<void> {
    const data = this.encoder.encode(`${entry}\n`);
    await this.log.write(data);
  }

  async searchForPlace(hospital: Hospital): Promise<Hospital | undefined> {
    const query = `${hospital.name} in ${hospital.city}, ${hospital.state}`;

    const response = await fetch(
      `${this.searchUri}?query=${query}&key=${this.apiKey}&type=hospital`,
    );

    if (!response.ok) {
      await this.writeLog(
        `${hospital.cmsId}: 🛑 Unable to fetch place data for ${hospital.name}`,
      );
      return undefined;
    }

    const { results } = await response.json();

    if (!results || results.length === 0) {
      await this.writeLog(
        `${hospital.cmsId}: 🛑 No places found for ${hospital.name}`,
      );
      return undefined;
    }

    if (results.length > 1) {
      await this.writeLog(
        `${hospital.cmsId}: ⚠️ Potential conflict, found ${results.length} results for ${hospital.name}`,
      );
      return undefined;
    }

    const place = results[0] as GoogleMapsPlace;

    if (!!place.business_status && place.business_status !== "OPERATIONAL") {
      await this.writeLog(
        `${hospital.cmsId}: ⚠️ Place is not operational - ${hospital.name}`,
      );
      return undefined;
    }

    if (!place.types || !place.types.includes("hospital")) {
      await this.writeLog(
        `${hospital.cmsId}: ⚠️ Place is not a hospital - ${hospital.name}`,
      );
      return undefined;
    }

    if (!place.photos || place.photos.length === 0) {
      await this.writeLog(
        `${hospital.cmsId}: ⚠️ Place has no photos - ${hospital.name}`,
      );
      return undefined;
    }

    if (!place.geometry) {
      await this.writeLog(
        `${hospital.cmsId}: ⚠️ Place has no geometry - ${hospital.name}`,
      );
      return undefined;
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
