import { loadEnv } from "./deps.ts";
import { parseHospitalData } from "./parseCsv.ts";
import { searchForPlace } from "./googleMaps.ts";

await loadEnv({ export: true });

const hospitals = await parseHospitalData();

const place = await searchForPlace(hospitals[0]);

console.log(place);
