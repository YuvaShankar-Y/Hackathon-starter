# Hackathon Starter

Full-stack starter template with React + Vite frontend, FastAPI backend, PostgreSQL, and AI integration.

## Tech Stack

**Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Radix UI, TanStack Query, React Router, Recharts, Axios

**Backend**: FastAPI, Python 3.11+, PostgreSQL 16, SQLAlchemy (async), Alembic, python-jose, bcrypt, OpenAI/Groq/Anthropic SDKs, pytest

## Setup

1. Clone the repo:
```bash
git clone https://github.com/Yuvashankar-Y/hackathon-starter.git
cd hackathon-starter
```

2. Copy environment variables:
```bash
cp .env.example .env
```

3. Start PostgreSQL:
```bash
docker compose up -d db
```

4. Backend:
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
alembic upgrade head
python -m app.scripts.seed  # optional
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

5. Frontend (new terminal):
```bash
cd frontend
npm install
npm run dev
```

Frontend: http://localhost:5173
Backend: http://localhost:8000

## Project Structure

```
hackathon-starter/
├── .env.example
├── docker-compose.yml
├── docs/ARCHITECTURE.md
├── backend/
│   ├── app/
│   │   ├── api/v1/          # auth, items, ai, ws endpoints
│   │   ├── core/            # errors, middleware, exceptions
│   │   ├── db/              # database session
│   │   ├── schemas/         # Pydantic models
│   │   ├── services/        # business logic
│   │   ├── ai/              # AI providers
│   │   ├── config.py
│   │   └── main.py
│   ├── alembic.ini
│   ├── migrations/
│   ├── requirements.txt
│   └── tests/
└── frontend/
    ├── src/
    │   ├── components/      # charts, tables, modals, ui
    │   ├── contexts/        # Auth
    │   ├── hooks/           # data fetching
    │   ├── pages/           # Dashboard, AIDemo
    │   ├── types/           # TypeScript types
    │   └── lib/             # API client
    ├── package.json
    └── vite.config.ts
```

## API Docs

Backend running at http://localhost:8000:
- Swagger: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Key Endpoints

- `GET /health` - Health check
- `POST /api/v1/auth/register` - Register
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/refresh` - Refresh token
- `GET /api/v1/users/me` - Current user
- `GET /api/v1/items` - List items (paginated)
- `POST /api/v1/items` - Create item
- `GET /api/v1/items/{id}` - Get item
- `PATCH /api/v1/items/{id}` - Update item
- `DELETE /api/v1/items/{id}` - Delete item
- `POST /api/v1/ai/chat` - AI chat
- `GET /api/v1/ai/logs` - AI logs (paginated)
- `WS /api/v1/ws/counter` - WebSocket demo

## Default Credentials

After seeding:
- Email: `demo1@hackathon.dev`
- Password: `demo123`

## Commands

**Backend:**
```bash
cd backend
pytest                           # tests
pytest --cov=app                 # with coverage
alembic revision --autogenerate -m "msg"  # create migration
alembic upgrade head             # apply migrations
alembic downgrade -1            # rollback
```

**Frontend:**
```bash
cd frontend
npm run typecheck                # type check
npm run build                    # production build
npm run preview                  # preview build
```

## Deployment

**Frontend (Vercel):**
1. Connect GitHub repo to Vercel
2. Set `VITE_API_URL` and `VITE_WS_URL`
3. Deploy

**Backend (Render):**
1. Connect GitHub repo to Render
2. Set env vars (see `.env.example`)
3. Use managed PostgreSQL
4. Deploy

**Database:** Use Supabase, Neon, Render PostgreSQL, or AWS RDS for production. Update `DATABASE_URL` accordingly.

## Architecture

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for detailed architecture, API contracts, and implementation plan.

## Troubleshooting

**Database:**
```bash
docker compose ps              # check status
docker compose logs db         # view logs
docker compose restart db      # restart
```

**CORS:** Add frontend URL to `CORS_ORIGINS` in `.env`

**AI:** Check API keys in `.env`, verify `AI_PROVIDER`, or use `AI_PROVIDER=mock` for testing
