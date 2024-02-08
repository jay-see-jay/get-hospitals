import { parse } from "./deps.ts";
import { LatLngLiteral } from "./places.ts";

export type Hospital = {
  name: string;
  city: string;
  state: string;
  address: string;
  zipCode: string;
  type: string;
  location?: LatLngLiteral;
  cmsId: string;
  imageUrl?: string;
  slug: string;
  googlePlaceId: string;
};

function toTitleCase(str: string) {
  return str.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

function createSlug(name: string) {
  return name.toLowerCase().replace(/\s/g, "-");
}

export async function parseHospitalData(): Promise<Hospital[]> {
  const hospitalsCsv = await Deno.readTextFile("./data/hospitals.csv");

  const hospitalObjects = parse(hospitalsCsv, {
    skipFirstRow: true,
  });

  return hospitalObjects.map((hospital: any) => {
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
}
