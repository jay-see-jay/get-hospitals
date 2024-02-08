import { loadEnv } from "./deps.ts";
import { parseHospitalData } from "./parseCsv.ts";
import { GoogleMaps } from "./googleMaps.ts";
import { SupabaseClient } from "./supabase.ts";

await loadEnv({ export: true });

const hospitals = await parseHospitalData();

using file = await Deno.open("./errors.txt", {
  write: true,
  truncate: true,
});

const supabase = new SupabaseClient();
const googleMaps = new GoogleMaps(file, supabase);

for (const hospital of hospitals) {
  const place = await googleMaps.searchForPlace(hospital);
  if (place) {
    console.log(place.name);
    await supabase.insertHospital(place);
  }
}

file.close();
