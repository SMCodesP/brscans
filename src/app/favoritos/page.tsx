'use client';

import { useEffect, useState } from 'react';

import { BookOpen, Heart } from 'lucide-react';

import MangaCard from '@/components/home/MangaCard';
import { useAuth } from '@/providers/auth-provider';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function FavoritosPage() {
  const { user, token, loading: authLoading } = useAuth();
  const [mangas, setMangas] = useState<TManga[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user || !token) {
      setLoading(false);
      return;
    }

    fetch(`${API_URL}/favorites/`, {
      headers: { Authorization: `Token ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setMangas(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user, token, authLoading]);

  if (authLoading || loading) {
    return (
      <main className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </main>
    );
  }

  if (!user) {
    return (
      <main className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-4">
        <Heart className="w-12 h-12 text-muted-foreground/50 mb-4" />
        <p className="text-lg font-medium text-muted-foreground">
          Faça login para ver seus favoritos
        </p>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 pb-16">
      <div className="flex items-center gap-3 mb-8">
        <Heart className="w-7 h-7 text-red-400" />
        <h1 className="text-3xl font-extrabold tracking-tight">
          Favoritos
        </h1>
      </div>

      {mangas.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {mangas.map((manga) => (
            <MangaCard key={manga.id} manga={manga} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <BookOpen className="w-12 h-12 mb-4 opacity-50" />
          <p className="text-lg font-medium">
            Nenhum mangá favoritado ainda
          </p>
          <p className="text-sm mt-1">
            Favorite mangás para vê-los aqui!
          </p>
        </div>
      )}
    </main>
  );
}
