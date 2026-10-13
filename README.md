<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/3ec3ec41-9a18-4d77-80a4-5d6a5b45fcdb

## Run and deploy

**Prerequisites:**  Node.js

1. Install dependencies:
   `npm install`
2. Copy [.env.example](.env.example) to `.env.local` and configure the Bunny Stream values. Keep `BUNNY_API_KEY` server-side; do not prefix it with `VITE_`.
3. Run locally:
   `npm run dev`
4. Build and run the production server:
   `npm run build && npm start`

The app requests film data from the same-origin `/api/bunny/videos` endpoint. The production server reads Bunny settings at runtime, serves the built app, and keeps the Bunny API key out of browser code. Configure `BUNNY_API_KEY` and `BUNNY_LIBRARY_ID` (plus optional `BUNNY_COLLECTION_ID` and `BUNNY_PULL_ZONE`) as server environment variables in the deployment platform, and start the app with `npm start`. For Google Cloud Run, deploy the Node.js service so it runs this start command rather than serving the `dist` folder as a static site.
