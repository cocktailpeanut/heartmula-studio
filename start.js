module.exports = {
  daemon: true,
  run: [
    {
      method: "shell.run",
      params: {
        venv: "venv",
        env: {
          "PYTORCH_CUDA_ALLOC_CONF": "expandable_segments:True"
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
