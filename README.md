# HeartMuLa Studio (Pinokio Launcher)

## What it does
HeartMuLa Studio is a professional, Suno-like AI music generation studio built on HeartLib. It can generate full songs with vocals, instrumentals, lyrics, and style tags, and includes a modern UI with history, likes, playlists, and real-time progress.

This repository is a launcher for HeartMula Studio https://github.com/fspecii/HeartMuLa-Studio

## VRAM Requirements

| VRAM | Mode | Performance |
|------|------|-------------|
| **8GB** | 4-bit quantization + sequential offload | Works, ~70s overhead per song |
| **10-12GB** | 4-bit quantization + sequential offload | Good, ~70s overhead per song |
| **14GB+** | 4-bit quantization, no swapping | Fast, no overhead |
| **20GB+** | Full precision | Fastest, best quality |

### How VRAM Optimization Works
The system auto-detects your GPU and applies the best configuration:

1. **4-bit Quantization** - Reduces HeartMuLa model from ~11GB to ~3GB
2. **Sequential Offload** - Loads HeartMuLa for generation, then swaps to HeartCodec for decoding (never both in VRAM at once)
3. **Lazy Codec Loading** - HeartCodec only loads when needed

For **8GB GPUs**: Both models are swapped in/out of VRAM sequentially. This adds ~70 seconds overhead per song but allows generation on lower VRAM GPUs.

### Manual Configuration
You can override auto-detection via environment variables in `start.js`:
```js
env: {
  "HEARTMULA_4BIT": "true",           // Force 4-bit quantization
  "HEARTMULA_SEQUENTIAL_OFFLOAD": "true", // Force model swapping
  "HEARTMULA_COMPILE": "false"        // Disable torch.compile
}
```

## Quick start (Pinokio)
1. Click **Install** to clone the repo and install Python and Node dependencies.
2. Click **Start** to launch the backend and frontend.
3. Open the Web UI at: `http://127.0.0.1:5173`

Backend API runs at: `http://127.0.0.1:8000`

## Notes
- First run downloads models from HuggingFace (~5GB).
- GPU with 8GB+ VRAM required (10GB+ recommended).
- VRAM usage is logged in the terminal - check if you're hitting limits.
- Optional LLM settings live in `app/backend/.env` (see `app/backend/.env.example`).

## Troubleshooting

### Out of Memory (OOM) Errors
If you see CUDA OOM errors:
1. Close other GPU-intensive applications
2. Check terminal for VRAM logs: `[VRAM] After cache setup: X.XXgb allocated`
3. For 8GB cards, ensure sequential offload is enabled

### Slow Generation
On 8GB cards, each song takes ~70s extra due to model swapping. This is normal.

### torch.compile Issues
torch.compile is disabled by default. If enabled, first run takes 5-20 minutes to compile kernels.

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
