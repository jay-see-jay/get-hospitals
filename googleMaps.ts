import { Hospital } from "./parseCsv.ts";

export async function searchForPlace(hospital: Hospital) {
  const uri = "https://maps.googleapis.com/maps/api/place/textsearch/json";

  const apiKey = Deno.env.get("GOOGLE_MAPS_API_KEY");
  if (!apiKey) {
    throw new Error("No Google Maps API key found");
  }

  const query = `${hospital.name} in ${hospital.city}, ${hospital.state}`;

  const response = await fetch(
    `${uri}?query=${query}&key=${apiKey}&type=hospital`,
  );

  const json = await response.json();

  console.log(json);
}
