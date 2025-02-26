# Gourmedia Viewer

This is a [Next.js](https://nextjs.org/) project for displaying todays lunch at Gourmedia

## Development

Install dependencies

```bash
npm i
```

Start up a redis server, and a local version of the upstash server

```bash
docker compose up
```

Copy the environment variables

```bash
cp .env-example .env.local
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
```

## Deployment

The app will be automatically deployed to Vercel on push to `main`.

## Example data

### API request

```
https://www.iss-menyer.se/_api/cloud-data/v2/items/query?.r=eyJkYXRhQ29sbGVjdGlvbklkIjoiTWVueSIsInF1ZXJ5Ijp7ImZpbHRlciI6eyJyZXN0cmF1bnRJZCI6IlJlc3RhdXJhbmcgR291cm1lZGlhIiwid2Vla051bWJlciI6NX0sInBhZ2luZyI6eyJvZmZzZXQiOjAsImxpbWl0IjoxfSwiZmllbGRzIjpbXX0sInJlZmVyZW5jZWRJdGVtT3B0aW9ucyI6W10sInJldHVyblRvdGFsQ291bnQiOnRydWUsImVudmlyb25tZW50IjoiTElWRSIsImFwcElkIjoiMTZkNDVlMzUtZDNkOC00ZDVlLWIyNGQtMmE2ODBiN2U1MDg5In0
```

The `.r` parameter is a base64 encoded json payload. The one in the example decodes to

```
{"dataCollectionId":"Meny","query":{"filter":{"restrauntId":"Restaurang Gourmedia","weekNumber":5},"paging":{"offset":0,"limit":1},"fields":[]},"referencedItemOptions":[],"returnTotalCount":true,"environment":"LIVE","appId":"16d45e35-d3d8-4d5e-b24d-2a680b7e5089"}
```

Some of the fields don't seem to be needed for our purposes. This payload seems to work for our needs. Note that we've also added the `year` filter, since you otherwise can get multiple responses for a certain week (one for each year); Also note that `restrauntId` needs to be misspelt.

```
{"dataCollectionId":"Meny","query":{"filter":{"restrauntId":"Restaurang Gourmedia","weekNumber":5, "year":2025}}}
```
