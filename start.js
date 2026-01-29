module.exports = {
  daemon: true,
  run: [
    {
      method: "shell.run",
      params: {
        venv: "venv",
        env: {
          // PyTorch memory optimization
          "PYTORCH_CUDA_ALLOC_CONF": "expandable_segments:True",
          // HeartMuLa VRAM optimization - auto-detect based on GPU
          "HEARTMULA_4BIT": "auto",
          "HEARTMULA_SEQUENTIAL_OFFLOAD": "auto",
          // Disable torch.compile by default (causes long first-run compilation)
          "HEARTMULA_COMPILE": "false"
        },
        path: "app",
        message: [
          "python -m uvicorn backend.app.main:app --host 127.0.0.1"
        ],
        on: [{
          event: "/(http:\\/\\/[0-9.:]+)/",
          done: true
        }]
      }
    },
    {
      method: "shell.run",
      params: {
        path: "app/frontend",
        message: [
          "npm run dev -- --host 127.0.0.1"
        ],
        on: [{
          event: "/(http:\\/\\/[0-9.:]+)/",
          done: true
        }]
      }
    },
    {
      method: "local.set",
      params: {
        url: "{{input.event[1]}}"
      }
    }
  ]
}
