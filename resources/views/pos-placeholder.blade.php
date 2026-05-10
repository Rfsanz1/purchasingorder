<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>POS — Toko Bahan Bangunan</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Inter', system-ui, sans-serif; background: #1e3a8a; display: flex; align-items: center; justify-content: center; min-height: 100vh; }
        .card { background: white; border-radius: 20px; padding: 48px 40px; max-width: 440px; width: 90%; text-align: center; box-shadow: 0 25px 50px rgba(0,0,0,0.25); }
        .icon { width: 72px; height: 72px; background: #2563eb; border-radius: 20px; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; font-size: 32px; }
        h1 { font-size: 22px; font-weight: 700; color: #1e293b; margin-bottom: 8px; }
        p { color: #64748b; font-size: 14px; line-height: 1.6; margin-bottom: 20px; }
        .badge { display: inline-block; background: #fef3c7; color: #92400e; padding: 6px 16px; border-radius: 999px; font-size: 12px; font-weight: 600; margin-bottom: 24px; }
        code { display: block; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 12px 16px; font-size: 12px; color: #1d4ed8; text-align: left; margin-bottom: 8px; font-family: monospace; }
        .refresh-btn { display: inline-block; background: #2563eb; color: white; padding: 12px 24px; border-radius: 10px; text-decoration: none; font-size: 14px; font-weight: 600; cursor: pointer; border: none; margin-top: 16px; }
        .refresh-btn:hover { background: #1d4ed8; }
    </style>
</head>
<body>
    <div class="card">
        <div class="icon">🏗️</div>
        <h1>POS Toko Bahan Bangunan</h1>
        <span class="badge">⚡ Dev Server Starting...</span>
        <p>React dev server (Vite) sedang diinisialisasi.<br>Tunggu beberapa detik lalu refresh halaman ini.</p>
        <code>cd frontend/artifacts/pos-app<br>pnpm dev</code>
        <p>Atau jalankan workflow <strong>POS App</strong> dari panel Replit.</p>
        <button class="refresh-btn" onclick="setTimeout(()=>window.location.reload(), 2000); this.textContent='Refreshing...'">
            🔄 Refresh Halaman
        </button>
    </div>
    <script>
        // Auto-retry every 3 seconds
        setTimeout(() => window.location.reload(), 5000);
    </script>
</body>
</html>
