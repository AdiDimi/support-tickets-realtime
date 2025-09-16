## Live Support Ticket Dashboard (Frontend)

This is the React + TypeScript frontend for the Live Support Ticket Dashboard.

### Quick Start

1. Requirements

- Node.js 18+

2. Install

```bash
npm install
```

3. Configure environment

- Copy `.env.example` to `.env` and adjust values.

4. Run

```bash
npm run dev
```

The app expects a backend running at `VITE_API_BASE` (default `http://localhost:8080`).

### Tech Choices

- React 18 + TypeScript
- Vite for dev/build
- TanStack Query for data fetching/cache
- Axios for HTTP
- SignalR for realtime ticket updates
- OpenAPI tooling (`orval`, `openapi-typescript`) for typed client generation

### Directory Structure

- `src/components` UI components (Dashboard, TicketList, TicketForm)
- `src/generated` lightweight API hooks and types (regenerate when backend is live)
- `src/hooks/useTicketRealtime.ts` SignalR connection and cache invalidation
- `src/data/queryClient.ts` shared TanStack Query client
- `src/styles` basic responsive styles

### API Client Generation

When the backend is running and exposes Swagger at `/swagger/v1/swagger.json`:

```bash
npm run generate:types
npm run generate:client
```

### Assumptions

- Authentication is mocked/simplified for assessment purposes.
- Agent directory is mocked in the UI; real implementation would query an endpoint.

### Testing

- A sample component test exists (`TicketForm.test.tsx`). Add Jest/Vitest + RTL to run.

### Deployment

- See `Dockerfile` for containerized build. Ensure `VITE_API_BASE` is configured at runtime.
