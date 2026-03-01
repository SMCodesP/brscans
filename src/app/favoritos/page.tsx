import MangaCard from '@/components/home/manga-card';
import { BookOpen, Heart } from 'lucide-react';
import { cookies } from 'next/headers';

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default async function FavoritosPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  if (!token) {
    return (
      <main className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-4">
        <Heart className="w-12 h-12 text-muted-foreground/50 mb-4" />
        <p className="text-lg font-medium text-muted-foreground">
          Faça login para ver seus favoritos
        </p>
      </main>
    );
  }

  let mangas: any[] = [];
  try {
    const res = await fetch(`${API_URL}/favorites/`, {
      headers: { Authorization: `Token ${token}` },
      cache: 'no-store', // Favorites are highly dynamic per user
    });
    if (res.ok) {
      mangas = await res.json();
    }
  } catch (error) {
    console.error('Failed to fetch favorites:', error);
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
