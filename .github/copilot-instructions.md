# Copilot Instructions for TWA-2025 Ticket System

## Architecture Overview
This is a React + PHP API ticket management system running in Docker containers:
- **Frontend**: React 18 with Vite dev server (port 5173), SASS for styling
- **Backend**: PHP 8.2 REST API endpoints in `/api` directory, session-based auth (`admin/admin`)
- **Data**: File-based JSON storage at `src/tickets.json` (no database)

## Development Workflow

### Starting the Environment
```bash
docker compose up                              # Start PHP (8080) + Node (5173) containers
docker exec -it node_service npm install       # Install dependencies first time
docker exec -it node_service npm run dev       # Start Vite dev server with HMR
```
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:8080/api`

### Build System
- **Vite dev server**: Hot module replacement, proxies `/api` requests to PHP container
- **SASS compilation**: Automatic via Vite's CSS pipeline
- Both use polling (`usePolling: true`) for file watching inside Docker

## Key Conventions

### React Component Structure
- Main app in [src/App.jsx](src/App.jsx) - handles all ticket state and API calls
- Entry point: [src/main.jsx](src/main.jsx) imports React, App, and SCSS
- State management: React hooks (`useState`, `useEffect`) - no external state library

### API Communication Pattern
All backend calls use `fetch()` with `/api` prefix (proxied by Vite):
- `GET /api/tickets.php` - Load all tickets
- `POST /api/tickets.php` with `action=add` - Create ticket
- `POST /api/tickets.php` with `action=delete` - Remove ticket
- `GET /api/check-session.php` - Check login status

API responses return JSON, unauthorized requests return 403.

### PHP Backend Structure
```
api/
├── tickets.php          # Main CRUD endpoint
├── check-session.php    # Session status check
├── login.php            # Authentication page
└── edit_ticket.php      # Edit form (server-rendered)
```

Each PHP file handles both GET (read) and POST (write) operations.

## Authentication
- Session-based auth with hardcoded credentials in [api/login.php](api/login.php)
- Check `$_SESSION['logged_in']` before mutations
- Logout: `GET /api/login.php?logout=true`

## Common Patterns

### Adding New Ticket Fields
1. Update ticket creation in [api/tickets.php](api/tickets.php) POST handler
2. Add state and form input in [src/App.jsx](src/App.jsx) component
3. Include new field in `addTicket()` fetch body
4. Update ticket display JSX in the map function
5. Modify styling in `src/scss/components/_tickets.scss`

### SCSS Styling
- Variables: [src/scss/abstract/_variables.scss](src/scss/abstract/_variables.scss)
- Mixins: [src/scss/abstract/_mixins.scss](src/scss/abstract/_mixins.scss)
- Uses `@use` syntax (not `@import`), 7-1 architecture pattern
- Imported once in [src/main.jsx](src/main.jsx), processed by Vite

## Docker Context
- Node container exposes port 5173 for Vite dev server
- PHP container serves `/api` endpoints on port 8080
- Containers communicate via `app_network` bridge
- Vite config targets `php_app:80` for API proxy

## Gotchas
- Vite dev server must run inside Docker container (not host) for network access
- API calls require `/api` prefix to proxy correctly
- Edit functionality still uses server-rendered PHP page (not React)
- Timezone set to `Europe/Prague` for consistent timestamps
- Must install dependencies after first `docker compose up`

