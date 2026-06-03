---
name: Next.js proxy ke NestJS backend
description: Cara benar proxy /api/* dari Next.js ke NestJS backend di Replit — hindari Route Handler + fetch karena kena undici "bad port" error dari BACKEND_URL env var.
---

## Aturan

Gunakan **next.config.mjs rewrites**, bukan Route Handler (`app/api/[...path]/route.ts`) dengan `fetch()`.

```js
// next.config.mjs
const BACKEND = 'http://127.0.0.1:6000';
async rewrites() {
  return [{ source: '/api/:path*', destination: `${BACKEND}/api/:path*` }];
}
```

**Why:** `process.env.BACKEND_URL` (`http://localhost:6000`) dibaca oleh undici (Node.js built-in fetch) dan kadang throw `Error: bad port` di Next.js 14 App Router Route Handlers — meski URL-nya valid secara visual. `localhost` di Node 18+ resolve ke IPv6 `::1` dulu sebelum IPv4, bisa gagal di lingkungan Replit. Hardcode `127.0.0.1` di rewrites menghindari semua masalah ini.

**How to apply:** Setiap kali ada proxy dari Next.js ke backend internal, pakai rewrites di next.config.mjs, bukan fetch di Route Handler.
