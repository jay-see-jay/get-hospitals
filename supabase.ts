import { Hospital } from "./parseCsv.ts";
import { createClient } from "./deps.ts";

export class SupabaseClient {
  private baseURL: string;
  private client: any;
  private readonly bucketName = "images";

  constructor() {
    const supabaseKey = Deno.env.get("SUPABASE_API_KEY");
    const supabaseBaseURL = Deno.env.get("SUPABASE_URL");
    if (!supabaseKey || !supabaseBaseURL) {
      throw new Error("No Supabase API key or URL found");
    }
    this.baseURL = supabaseBaseURL;
    this.client = createClient(supabaseBaseURL, supabaseKey);
  }

  async savePhoto(fileName: string, blob: Blob): Promise<string> {
    // return `${this.baseURL}storage/v1/object/public/hospital_photos/${fileName}`;
    const { data, error } = await this.client.storage
      .from(this.bucketName)
      .upload(`hospital_photos/${fileName}`, blob, {
        contentType: blob.type,
      });

    if (error) {
      console.log(`🛑 Unable to upload ${fileName}: ${error.message}`);
      return undefined;
    }

    return `${this.baseURL}/storage/v1/object/public/${data.fullPath}`;
  }

  async insertHospital(hospital: Hospital) {
    const { data, error } = await this.client.from("hospitals").insert([
      {
        name: hospital.name,
        city: hospital.city,
        state: hospital.state,
        type: hospital.type,
        address: hospital.address,
        location: `POINT(${hospital.location.lat} ${hospital.location.lng})`,
        cms_id: hospital.cmsId,
        image_url: hospital.imageUrl,
        slug: hospital.slug,
        google_place_id: hospital.googlePlaceId,
        zip_code: hospital.zipCode,
      },
    ]);

    if (error) {
      console.error(
        `${hospital.cmsId}: 🛑 Unable to insert ${hospital.name}`,
        error,
      );
    }
  }
}
