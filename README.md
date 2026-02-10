# Buena - Real Estate Management Platform

A full-stack application for managing properties, buildings, and units, featuring AI-powered data extraction from PDF documents.

## 📺 Demo

![Buena Platform Demo](file:///Media/Buena.mp4)

## 🚀 Quick Start (Docker)

The fastest way to get the entire project running is using Docker Compose.

```bash
docker-compose up --build
```

This command will start:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:3001
- **API Docs (Swagger)**: http://localhost:3001/api
- **pgAdmin**: http://localhost:5050 (Adminers: `admin@admin.com` / `admin`)

*Note: The database is automatically seeded with 10 sample properties on first startup.*

---

## 🛠️ Local Development

### Prerequisites
- Node.js 22+
- PostgreSQL (on port 5433 or update `.env`)

### 1. Backend Setup
```bash
cd backend
npm install
npm run start:dev
```
- API runs at `http://localhost:3001`
- Seed data: `npm run seed`

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
- App runs at `http://localhost:3000`

---

## 📂 Project Structure

- `/frontend`: Next.js 15 application (Tailwind CSS, Lucide Icons).
- `/backend`: NestJS API (TypeORM, PostgreSQL, OpenAI integration).
- `/db`: Database initialization scripts.

## 🧪 Testing
```bash
cd backend
npm run test          # Run unit tests
npm run test:e2e      # Run end-to-end tests
```
