# 3DVerse Backend

## Run

1. `npm install`
2. `npm run dev`

Backend runs on `http://localhost:5000`.

## Endpoints

- `GET /health`
- `GET /stats`
- `POST /upload` (form-data key: `file`)
- `POST /generate` (json: `{ "prompt": "..." }`)
- `POST /manual-build` (json: `{ "buildingLength": 12, "buildingWidth": 8, "floors": 1, "rooms": 4, "doors": 1 }`)
- `POST /ar/link` (json: `{ "modelUrl": "..." }`)
- `GET /projects`
- `GET /catalog/objects`
- `GET /generate/supported-prompts`

## Behavior

- Uploaded files are stored in `backend/uploads`.
- Project metadata is stored in `backend/data/projects.json`.
- AR endpoint returns:
  - `arUrl` (open in mobile browser)
  - `qrCodeDataUrl` (PNG data URL for QR download/display)
- Text-to-3D first checks `data/objectCatalog.json` for the closest object match.
- `data/objectCatalog.json` is the live catalog used by the website.
- `data/textPromptDataset.csv` contains example prompts mapped to catalog object IDs; use it to expand aliases, test matching, or later train a smarter classifier.
- You can inspect supported prompts from `GET /generate/supported-prompts`.
- Manual Builder generates a 2D SVG blueprint from user-entered architectural dimensions.
