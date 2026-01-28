module.exports = {
  run: [
    {
      method: "shell.run",
      params: {
        message: "git pull"
      }
    },
    {
      method: "shell.run",
      params: {
        path: "app",
        message: "git pull"
      }
    },
    {
      method: "shell.run",
      params: {
        venv: "venv",
        path: "app",
        message: [
          "uv pip install -r backend/requirements.txt"
        ]
      }
    },
    {
      method: "script.start",
      params: {
        uri: "torch.js",
        params: {
          venv: "venv",
          path: "app",
          triton: true
        }
      }
    },
    {
      method: "shell.run",
      params: {
        venv: "venv",
        path: "app",
        message: [
          "uv pip install -U --force-reinstall \"numpy<2\" \"pyarrow<15\""
        ]
      }
    },
    {
      method: "shell.run",
      params: {
        path: "app/frontend",
        message: [
          "npm install"
        ]
      }
    }
  ]
}
