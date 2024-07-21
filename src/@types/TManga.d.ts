interface TManga {
  id: number;
  thumbnail: TImageVariant;
  title: string;
  status: string;
  description: string;
  external_id: string;
  hash_external_id: string;
  source: string;
  identifier: string;
  genres: [];
  chapters: TChapter[];
  author: null;
  slug: null;
  hash_slug: null;
  chapters?: TChapter[];
}
