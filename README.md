# PolarRoute — SIH26059

Complete Antarctic sea-ice and voyage-planning prototype in [`SIH26059`](SIH26059/README.md), including the full Antarctic map, draggable endpoints, playback, dated real observations, source attribution, research notes and tests.

## Run locally

```powershell
cd SIH26059
python -m pip install -r requirements.txt
python app.py
```

Open http://127.0.0.1:8059.

## Deploy on Vercel

Import this repository with the **repository root** as Root Directory and framework **Other**. Keep build/output overrides empty. `api/index.py` runs the existing Python handler; `vercel.json` routes requests to it. Python 3.12 and requirements are configured at the root.

Alternatively, run `vercel --prod` from the repository root after `vercel login`.

The bundled 2026-09-17 snapshot loads without an upstream download. Fetching other dates depends on NOAA/Open-Meteo availability and the function timeout. Hosted cache uses ephemeral temporary storage; saved voyages use the visitor's browser storage. No API keys are needed by the application.

This is a research prototype. Observations cover the outlined region only; forecasts use persistence by default. Missing currents, waves, depth and iceberg inventories remain explicitly unassessed. See SIH26059/data/SOURCES.md for provenance.
