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
    const { data, error } = await this.client.storage
      .from(this.bucketName)
      .upload(`hospital_photos/${fileName}`, blob, {
        contentType: blob.type,
      });

    if (error) {
      throw new Error(`🛑 Unable to upload photo: ${error.message}`);
    }

    return `${this.baseURL}storage/v1/object/public/${data.fullPath}`;
  }
}

export async function insertHospital(hospital: Hospital) {
  const apiKey = Deno.env.get("SUPABASE_API_KEY");
  if (!apiKey) {
    throw new Error("No Supabase API key found");
  }

  const response = await fetch(`${supabaseBaseURL}rest/v1/hospitals`, {
    method: "POST",
    headers: {
      apikey: apiKey,
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: hospital.name,
      city: hospital.city,
      state: hospital.state,
      type: hospital.type,
      address: hospital.address,
      location: `POINT(${hospital.location?.latitude}, ${hospital.location?.longitude})`,
      zip_code: hospital.zipCode,
      cms_id: hospital.cmsId,
      image_url: "TODO",
      slug: hospital.slug,
      google_place_id: "TODO",
    }),
  });

  if (!response.ok) {
    throw new Error("🛑 Unable to insert hospital");
  }
}
