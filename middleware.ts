import { NextRequest, NextResponse } from 'next/server';

import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const session: any = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const validRoles = ['admin', 'super-user', 'SEO'];

  if (req.nextUrl.pathname.startsWith('/api/admin')) {
    if (!session || !validRoles.includes(session.user.role)) {
      return new Response(JSON.stringify({ message: 'Not authorized' }), {
        status: 401,
        headers: {
          'Content-type': 'application/json',
        },
      });
    }
  }

  if (!session) {
    const requestedPage = req.nextUrl.pathname;
    const url = req.nextUrl.clone();
    url.pathname = '/auth/login';
    url.search = `p=${requestedPage}`;

    return NextResponse.redirect(url);
  }

  if (req.nextUrl.pathname.startsWith('/admin')) {
    const validRoles = ['admin', 'super-user', 'SEO'];

    if (!validRoles.includes(session.user.role)) {
      const url = req.nextUrl.clone();
      url.pathname = '/';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/checkout/:path*', '/admin/:path*', '/api/admin/:path*'],
};
