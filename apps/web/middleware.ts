import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_PATHS = ['/login', '/unauthorized', '/_next', '/favicon', '/api/auth'];
const ALLOWED_ROLES = ['ADMIN', 'OWNER'];

function getCookie(req: NextRequest, name: string): string | undefined {
  return req.cookies.get(name)?.value;
}

function getRolesFromCookie(req: NextRequest): string[] {
  const raw = getCookie(req, 'erp_roles');
  if (!raw) return [];
  try { return JSON.parse(decodeURIComponent(raw)); } catch { return []; }
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) return NextResponse.next();

  const token = getCookie(req, 'erp_token');
  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  const roles = getRolesFromCookie(req);
  const hasAccess = roles.some((r) => ALLOWED_ROLES.includes(r));
  if (!hasAccess) {
    return NextResponse.redirect(new URL('/unauthorized', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
