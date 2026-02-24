import { NextResponse } from 'next/server';
import crypto from 'crypto';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Solo proteger /cervecero y sus subrutas (excepto /cervecero/login si existe)
  if (pathname.startsWith('/cervecero') && !pathname.startsWith('/cervecero/login')) {
    const cookie = request.cookies.get('admin_auth')?.value;

    if (!cookie) {
      return NextResponse.redirect(new URL('/cervecero/login', request.url));
    }

    // Verificar la firma
    const [token, signature] = cookie.split('.');
    const hmac = crypto.createHmac('sha256', process.env.COOKIE_SECRET);
    hmac.update(token);
    const expectedSignature = hmac.digest('hex');

    if (signature !== expectedSignature) {
      return NextResponse.redirect(new URL('/cervecero/login', request.url));
    }

    // Podrías además verificar que el token no haya expirado, pero por simplicidad lo dejamos así
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/cervecero/:path*'],
};