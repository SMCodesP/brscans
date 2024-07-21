interface TChapter {
  id: number;
  title: string;
  slug: string;
  release_date: string;
  manhwa: null;
  previous: TChapter;
  next: TChapter;
  pages?: TPage[];
}
