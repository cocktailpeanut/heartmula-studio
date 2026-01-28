# HeartMuLa Studio (Pinokio Launcher)

## What it does
HeartMuLa Studio is a professional, Suno-like AI music generation studio built on HeartLib. It can generate full songs with vocals, instrumentals, lyrics, and style tags, and includes a modern UI with history, likes, playlists, and real-time progress.

## Quick start (Pinokio)
1. Click **Install** to clone the repo and install Python and Node dependencies.
2. Click **Start** to launch the backend and frontend.
3. Open the Web UI at: `http://127.0.0.1:5173`

Backend API runs at: `http://127.0.0.1:8000`

## Notes
- First run downloads models from HuggingFace (~5GB).
- GPU with 10GB+ VRAM is recommended for best performance.
- Optional LLM settings live in `app/backend/.env` (see `app/backend/.env.example`).

## API usage
FastAPI docs are available at:
- `http://127.0.0.1:8000/docs`
- `http://127.0.0.1:8000/openapi.json`

Below are basic examples for the main endpoints.

### JavaScript (fetch)
```js
const base = "http://127.0.0.1:8000";

// Start a generation
const create = await fetch(`${base}/generate/music`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    prompt: "Dreamy synthpop song about sunrise",
    tags: "synthpop, dreamy",
    duration_ms: 30000,
    seed: 12345
  })
});
const { job_id } = await create.json();

// Poll job status
const status = await fetch(`${base}/jobs/${job_id}`);
const job = await status.json();

// When job.status === "completed", job.audio_path contains a URL like /audio/<file>.mp3
```

### Python (requests)
```python
import requests

base = "http://127.0.0.1:8000"

resp = requests.post(
    f"{base}/generate/music",
    json={
        "prompt": "Dreamy synthpop song about sunrise",
        "tags": "synthpop, dreamy",
        "duration_ms": 30000,
        "seed": 12345,
    },
)
job_id = resp.json()["job_id"]

job = requests.get(f"{base}/jobs/{job_id}").json()
print(job)
```

### Curl
```bash
curl -X POST "http://127.0.0.1:8000/generate/music" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Dreamy synthpop song about sunrise",
    "tags": "synthpop, dreamy",
    "duration_ms": 30000,
    "seed": 12345
  }'

# Poll job status
curl "http://127.0.0.1:8000/jobs/<job_id>"
```

## Extra endpoints
- `GET /health`
- `POST /generate/lyrics`
- `POST /upload/ref_audio`
- `GET /history`
- `GET /events` (SSE)
- `GET /audio/<path>`
