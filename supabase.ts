import { Hospital } from "./parseCsv";

const supabaseURL =
  "https://lgzeurjeuizrkzmwyici.supabase.co/rest/v1/hospitals";

export async function insertHospital(hospital: Hospital) {
  const apiKey = Deno.env.get("SUPABASE_API_KEY");
  if (!apiKey) {
    throw new Error("No Supabase API key found");
  }

  const response = await fetch(supabaseURL, {
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
