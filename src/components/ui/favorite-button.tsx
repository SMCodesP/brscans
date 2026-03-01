'use client';

import { useEffect, useState } from 'react';

import { Heart } from 'lucide-react';

import { useAuth } from '@/providers/auth-provider';

interface FavoriteButtonProps {
  manhwaId: number;
  className?: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function FavoriteButton({
  manhwaId,
  className = '',
}: FavoriteButtonProps) {
  const { user, token } = useAuth();
  const [isFavorited, setIsFavorited] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user || !token) return;

    fetch(`${API_URL}/manhwas/${manhwaId}/is-favorited/`, {
      headers: { Authorization: `Token ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setIsFavorited(data.is_favorited))
      .catch(() => {});
  }, [manhwaId, user, token]);

  if (!user) return null;

  const toggle = async () => {
    setLoading(true);
    try {
      if (isFavorited) {
        await fetch(`${API_URL}/manhwas/${manhwaId}/unfavorite/`, {
          method: 'DELETE',
          headers: { Authorization: `Token ${token}` },
        });
        setIsFavorited(false);
      } else {
        await fetch(`${API_URL}/manhwas/${manhwaId}/favorite/`, {
          method: 'POST',
          headers: { Authorization: `Token ${token}` },
        });
        setIsFavorited(true);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-50 ${
        isFavorited
          ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
          : 'bg-secondary hover:bg-secondary/80 text-foreground/80 hover:text-foreground'
      } ${className}`}
    >
      <Heart
        className={`w-4 h-4 transition-all ${isFavorited ? 'fill-red-400 text-red-400' : ''}`}
      />
      {isFavorited ? 'Favoritado' : 'Favoritar'}
    </button>
  );
}
