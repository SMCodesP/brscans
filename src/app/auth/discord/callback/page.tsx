'use client';

import { useEffect } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import { useAuth } from '@/providers/auth-provider';

export default function DiscordCallback() {
  const { loginWithDiscord } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get('code');
    if (!code) {
      router.push('/login');
      return;
    }

    const redirectUri = `${window.location.origin}/auth/discord/callback`;

    loginWithDiscord(code, redirectUri)
      .then(() => router.push('/'))
      .catch(() => router.push('/login'));
  }, [searchParams, loginWithDiscord, router]);

  return (
    <main className="flex items-center justify-center min-h-[calc(100vh-200px)]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-muted-foreground">
          Autenticando com Discord...
        </p>
      </div>
    </main>
  );
}
