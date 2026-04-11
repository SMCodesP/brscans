interface TRecentChapter {
  id: number;
  title: string;
  slug: string;
  release_date: string | null;
  created_at: string | null;
  manhwa: {
    id: number;
    title: string;
    slug: string | null;
    thumbnail: TImageVariant;
  };
}
