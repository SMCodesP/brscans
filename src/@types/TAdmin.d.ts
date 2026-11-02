type TSourceStatus =
  | 'never'
  | 'ok'
  | 'redirected'
  | 'dead'
  | 'not_found'
  | 'blocked'
  | 'http_error'
  | 'timeout'
  | 'parser_error'
  | 'no_url';

type TProblemReason = 'sem_pages' | 'sem_traducao' | 'erro_sync';

interface TAdminManhwa {
  id: number;
  title: string;
  source: string | null;
  source_status: TSourceStatus | null;
  source_detail: string | null;
  source_checked_at: string | null;
  chapters_count: number;
  problem_pages: number;
}

interface TAdminChapter {
  id: number;
  title: string;
  pages_count: number;
  translated_count: number;
  problem_pages: number;
}

interface TAdminProblem {
  id: number;
  title: string;
  manhwa: { id: number; title: string };
  pages_count: number;
  translated_count: number;
  problem_pages: number;
  reason: TProblemReason;
  work_attempts: number;
  work_last_error: string | null;
}

interface TAdminPage {
  id: number;
  order: number;
  chapter: number;
  quantity_merged: number | null;
  manual_translated: boolean;
  images: TImageVariant & {
    raw_path?: string | null;
    original_path?: string | null;
    translated_path?: string | null;
  };
}

interface TAdminTaskQueued {
  /** null quando a task roda no Zappa (sem id, a resposta vem do sync). */
  task: string | null;
  status: 'queued';
}
