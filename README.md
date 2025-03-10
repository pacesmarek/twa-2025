## Docker start
- `docker compose up`

## Access the Node.js container

### a) `docker exec -it node_service bash`
- `docker exec` → Runs a command in an existing container.
- `-it` → Starts an interactive terminal session.
- `node_service` → The name of your Node.js container (as defined in docker-compose.yml).
- `bash` → Opens a Bash shell inside the container.

### b) `docker exec -it node_service npm run dev`
- Runs with `npm run dev`
