interface TPage {
  id: number;
  images: {
    id: number;
    minimum: string | null;
    medium: string | null;
    original: string | null;
    translated: string | null;
  };
  chapter: number;
}
