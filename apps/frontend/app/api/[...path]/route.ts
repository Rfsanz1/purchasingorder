import { NextRequest, NextResponse } from 'next/server';

const BACKEND = 'http://localhost:6000';

async function proxy(req: NextRequest, { params }: { params: { path: string[] } }) {
  const path = params.path.join('/');
  const url = `${BACKEND}/api/${path}${req.nextUrl.search}`;

  const headers: Record<string, string> = {};
  req.headers.forEach((val, key) => {
    if (!['host', 'connection', 'transfer-encoding'].includes(key)) {
      headers[key] = val;
    }
  });

  let body: string | undefined;
  if (!['GET', 'HEAD'].includes(req.method)) {
    body = await req.text();
  }

  try {
    const res = await fetch(url, {
      method: req.method,
      headers,
      body,
      // @ts-ignore
      duplex: 'half',
    });

    const data = await res.text();
    return new NextResponse(data, {
      status: res.status,
      headers: { 'Content-Type': res.headers.get('Content-Type') ?? 'application/json' },
    });
  } catch {
    return NextResponse.json(
      { statusCode: 503, message: 'Backend tidak tersedia. Jalankan NestJS backend terlebih dahulu.' },
      { status: 503 },
    );
  }
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
