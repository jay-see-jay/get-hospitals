# US Hospital Data

A small script to populate a database with US hospital data using information provided by [data.cms.gov](https://data.cms.gov/provider-data/dataset/xubh-q36u).

## Installation

At [data.cms.gov](https://data.cms.gov/provider-data/dataset/xubh-q36u) click the link to download the full dataset, and place the .csv in the [data](./data) folder with the name `hospitals.csv`.

You will also need to [install Deno](https://docs.deno.com/runtime/manual/getting_started/installation) to run the script.

## Usage

```bash
deno run --allow-read --allow-env index.ts
```
