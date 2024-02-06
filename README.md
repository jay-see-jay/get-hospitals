# US Hospital Data

A small script to populate a database with US hospital data using information provided by [data.cms.gov](https://data.cms.gov/provider-data/dataset/xubh-q36u).

## Installation

### Data
At [data.cms.gov](https://data.cms.gov/provider-data/dataset/xubh-q36u) click the link to download the full dataset, and place the .csv in the [data](./data) folder with the name `hospitals.csv`.

### Deno
You will also need to [install Deno](https://docs.deno.com/runtime/manual/getting_started/installation) to run the script.

### Environment Variables
You will need to set an environment variable `GOOGLE_MAPS_API_KEY` to a valid Google Maps API key with the [Places API](https://developers.google.com/maps/documentation/places/web-service) enabled.

## Usage

```bash
deno run --allow-read=./ --allow-env=GOOGLE_MAPS_API_KEY --allow-net=maps.googleapis.com index.ts
```
