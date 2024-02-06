import { loadEnv } from "./deps.ts";
import { parseHospitalData } from "./parseCsv.ts";
import { searchForPlace } from "./googleMaps.ts";

await loadEnv({ export: true });

const hospitals = await parseHospitalData();

await searchForPlace();
