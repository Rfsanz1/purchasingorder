# POS App — Gentong Mas

Aplikasi kasir standalone berbasis Next.js.

## Kebutuhan
- Node.js 18+
- Akses ke ERP Backend (NestJS) yang berjalan

## Setup
npm install
cp .env.example .env.local
# Edit .env.local: set BACKEND_URL ke alamat backend ERP

## Jalankan
npm run dev     # development (port 3001)
npm run build   # production build
npm run start   # production server

## Environment Variables
BACKEND_URL=http://localhost:6000   # URL backend ERP NestJS
PORT=3001
