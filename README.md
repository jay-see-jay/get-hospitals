# US Hospital Data

A small script to populate a database with US hospital data using information provided by [data.cms.gov](https://data.cms.gov/provider-data/dataset/xubh-q36u).

## Installation

### Data
At [data.cms.gov](https://data.cms.gov/provider-data/dataset/xubh-q36u) click the link to download the full dataset, and place the .csv in the [data](./data) folder with the name `hospitals.csv`.

### Deno
Follow the instructions to [install Deno](https://docs.deno.com/runtime/manual/getting_started/installation) on your local machine.

### Environment Variables
Copy `sample.env` and rename to `.env`.

Set the `GOOGLE_MAPS_API_KEY` environment variable to a valid Google Maps API key, and ensure the [Places API](https://developers.google.com/maps/documentation/places/web-service) is enabled in your Google Cloud Platform project.

## Usage

```bash
deno run \
    --allow-read \
    --allow-write \
    --allow-env \
    --allow-net \
    index.ts
```
