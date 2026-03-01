import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  const FRONTEND_URL =
    process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000';
  const redirectUri = `${FRONTEND_URL}/auth/discord/callback`;

  try {
    const res = await fetch(`${API_URL}/auth/discord/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, redirect_uri: redirectUri }),
      cache: 'no-store', // Important: don't cache OAuth callbacks
    });

    if (!res.ok) {
      return NextResponse.redirect(
        new URL('/login?error=discord_failed', request.url)
      );
    }

    const data = await res.json();

    // Set cookie server-side
    const cookieStore = await cookies();
    cookieStore.set('auth_token', data.token, {
      path: '/',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });

    return NextResponse.redirect(new URL('/', request.url));
  } catch (err) {
    return NextResponse.redirect(
      new URL('/login?error=server_error', request.url)
    );
  }
}
