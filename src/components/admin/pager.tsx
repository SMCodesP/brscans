'use client';

import { Button } from '@/components/ui/button';

function Pager({
  page,
  total,
  onChange,
}: { page: number; total: number; onChange: (p: number) => void }) {
  if (total <= 1) return null;
  return (
    <nav
      aria-label="Paginação"
      className="mt-3 flex items-center justify-center gap-3 text-sm"
    >
      <Button
        variant="outline"
        size="sm"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
      >
        Anterior
      </Button>
      <span className="text-muted-foreground">
        {page} / {total}
      </span>
      <Button
        variant="outline"
        size="sm"
        disabled={page >= total}
        onClick={() => onChange(page + 1)}
      >
        Próxima
      </Button>
    </nav>
  );
}

export { Pager };
