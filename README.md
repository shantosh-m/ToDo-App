# ToDo Take-home Assessment

## System Architecture

```mermaid
graph LR
A[React Frontend \nlocalhost:3000] <--> B[Node.js Backend\nlocalhost:4000]
B <--> C[PostgreSQL DB\nlocalhost:5432]
```

## Tech stack

- Frontend: React
- Backend: Node.js + Express
- Database: MySQL (docker version)
- Containerization: Docker / docker-compose

## Requirements

- Docker and docker-compose installed

## Quick start (development)

1. `git clone [repo](https://github.com/shantosh-m/ToDo-App.git)`
2. `cd <repo>`
3. `docker-compose up --build`
4. Open `http://localhost:3000` (frontend). API at `http://localhost:4000/api/tasks`

## Project structure

- /backend
- /frontend
- docker-compose.yml

## Notes

- Only most recent 5 incomplete tasks are shown.
- Completed tasks animate and are removed from the UI.
- And those records will be deleted entirely from the database
