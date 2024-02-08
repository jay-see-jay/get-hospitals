import { loadEnv } from "./deps.ts";
import { parseHospitalData } from "./parseCsv.ts";
import { GoogleMaps } from "./googleMaps.ts";

await loadEnv({ export: true });

const hospitals = await parseHospitalData();

using file = await Deno.open("./errors.txt", {
  write: true,
  truncate: true,
});

const googleMaps = new GoogleMaps(file);

for (const hospital of hospitals) {
  const place = await googleMaps.searchForPlace(hospital);
  if (place) {
    console.log(place.name);
  }
}

file.close();
