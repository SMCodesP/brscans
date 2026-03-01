interface TRecentChapter {
  id: number;
  title: string;
  slug: string;
  release_date: string;
  manhwa: {
    id: number;
    title: string;
    slug: string | null;
    thumbnail: TImageVariant;
  };
}
