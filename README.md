# Ticket System - React Version

## Setup

### First Time Setup
```bash
docker compose up -d
docker exec -it node_service npm install
```

### Start Development
```bash
docker compose up                              # Start containers
docker exec -it node_service npm run dev       # Start Vite dev server
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:8080/api

## Architecture

- **Frontend**: React 18 + Vite (port 5173)
- **Backend**: PHP 8.2 REST API (port 8080)
- **Data**: JSON file storage (`src/tickets.json`)

Login credentials: `admin/admin`

## Project Structure

```
├── index.html              # React app entry
├── src/
│   ├── main.jsx           # React root
│   ├── App.jsx            # Main component
│   ├── tickets.json       # Data storage
│   └── scss/              # Styles (7-1 pattern)
├── api/                   # PHP backend
│   ├── tickets.php        # CRUD endpoints
│   ├── check-session.php  # Auth check
│   ├── login.php          # Login page
│   └── edit_ticket.php    # Edit form
└── docker-compose.yml     # Container config
```

## API Endpoints

- `GET /api/tickets.php` - Get all tickets
- `POST /api/tickets.php` with `action=add` - Create ticket
- `POST /api/tickets.php` with `action=delete` - Delete ticket
- `GET /api/check-session.php` - Check login status

See [.github/copilot-instructions.md](.github/copilot-instructions.md) for detailed development guide.

