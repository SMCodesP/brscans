interface TPagination<T> {
  next: string;
  previous: string;
  count: number;
  total_pages: number;
  results: T[];
}
