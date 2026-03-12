# Kube Hacks: Test Grid & Prow

Hacking around with a fresh idea for a single UI for Test Grid and Prow.
Given Headlamp is now under SIG-UI and vendor neutral I'll model the
frontend deps of this project to follow their lead.

And for fun, asked Copilot to quick cough up some matching logos for
this project, based on the existing Prow logo, but modernized a bit.
These are not official in any way.

## Development

### Prerequisites

- Go 1.23+
- Node.js 20+ / npm 10+

### Quick Start

```bash
# Install frontend dependencies
make install

# Start both backend and frontend dev servers
make dev
```

This runs:
- **Backend** on `http://localhost:8080` — Go proxy server
- **Frontend** on `http://localhost:5173` — Vite dev server with HMR

The Vite dev server proxies `/api/*` requests to the backend, so all
API calls work seamlessly during development.

### Available Commands

```
make help       # Show all targets
make dev        # Run both servers (Ctrl-C kills both)
make install    # npm install in frontend/
make backend    # Build Go binary
make frontend   # Build Vite production bundle
make test       # Run all tests
make lint       # Lint both projects
make clean      # Remove build artifacts
```

### Backend

The backend is a thin proxy to the real Prow and TestGrid APIs:

| Local Route | Upstream |
|---|---|
| `/api/prow/*` | `https://prow.k8s.io/*` |
| `/api/testgrid/*` | `https://testgrid.k8s.io/*` |
| `/healthz` | Health check |
| `/readyz` | Readiness check |

Configuration is via `backend/.env` (committed defaults) or
`backend/.env.local` (gitignored overrides). See
`backend/.env.local.example`.

### Frontend

Built with React 18, MUI 5, Zustand, TanStack Query, and Vite.

| Directory | Purpose |
|---|---|
| `src/api/` | TanStack Query hooks + fetch helpers |
| `src/components/` | Layout (AppShell, TopBar, Sidebar) + shared |
| `src/pages/` | Route pages for Prow and TestGrid |
| `src/stores/` | Zustand stores for UI + filter state |
| `src/theme/` | MUI theme with switchable palettes |
| `src/types/` | Shared TypeScript interfaces |

### Project Structure

```
├── Makefile              # Root orchestration
├── backend/
│   ├── cmd/server/       # Go entrypoint
│   ├── internal/         # config, proxy, server, middleware
│   ├── .env              # Default config (committed)
│   └── Makefile
├── frontend/
│   ├── src/              # React source tree
│   ├── public/           # Static assets + favicons
│   ├── vite.config.ts    # Vite config with API proxy
│   └── Makefile
├── assets/               # Branding (Prow + TestGrid logos)
└── TODO/                 # Planning docs
```