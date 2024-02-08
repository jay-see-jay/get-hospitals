import { loadEnv } from "./deps.ts";
import { parseHospitalData } from "./parseCsv.ts";
import { GoogleMaps } from "./googleMaps.ts";

await loadEnv({ export: true });

const hospitals = await parseHospitalData();

const googleMaps = new GoogleMaps();

const place = await googleMaps.searchForPlace(hospitals[0]);

console.log(place);
