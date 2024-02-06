import { parse } from "./deps.ts";

const hospitalsCsv = await Deno.readTextFile("./data/hospitals.csv");

const hospitalObjects = parse(hospitalsCsv, {
  skipFirstRow: true,
});

type GeoLocation = {
  latitude: number;
  longitude: number;
};

type Hospital = {
  name: string;
  city: string;
  state: string;
  address: string;
  zipCode: string;
  type: string;
  location?: GeoLocation; // Get from Google Maps API
  cmsId: string;
  imageUrl?: string; // Get from Google Maps, upload to Supabase storage, and add here
  slug: string;
};

function toTitleCase(str: string) {
  return str.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

function createSlug(name: string) {
  return name.toLowerCase().replace(/\s/g, "-");
}

const hospitals: Hospital[] = hospitalObjects.map((hospital: any) => {
  const name = toTitleCase(hospital["Facility Name"]);
  const city = toTitleCase(hospital["City/Town"]);
  const address = toTitleCase(hospital["Address"]);
  return {
    name,
    city,
    state: hospital["State"],
    address,
    zipCode: hospital["ZIP Code"],
    type: hospital["Hospital Type"],
    cmsId: hospital["Facility ID"],
    slug: createSlug(name),
  };
});

console.log(hospitals[0]);
