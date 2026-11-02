const STATUS: Record<
  TSourceStatus,
  { label: string; className: string }
> = {
  ok: {
    label: 'OK',
    className: 'bg-emerald-500/15 text-emerald-400',
  },
  redirected: {
    label: 'Domínio mudou',
    className: 'bg-amber-500/15 text-amber-400',
  },
  dead: {
    label: 'Domínio morto',
    className: 'bg-red-500/15 text-red-400',
  },
  not_found: {
    label: '404',
    className: 'bg-red-500/15 text-red-400',
  },
  blocked: {
    label: 'Captcha / bloqueado',
    className: 'bg-orange-500/15 text-orange-400',
  },
  http_error: {
    label: 'HTTP erro',
    className: 'bg-red-500/15 text-red-400',
  },
  timeout: {
    label: 'Timeout',
    className: 'bg-amber-500/15 text-amber-400',
  },
  parser_error: {
    label: 'Parser quebrado',
    className: 'bg-red-500/15 text-red-400',
  },
  no_url: {
    label: 'Sem URL',
    className: 'bg-muted text-muted-foreground',
  },
  never: {
    label: 'Não checado',
    className: 'bg-muted text-muted-foreground',
  },
};

function SourceBadge({ status }: { status: TSourceStatus | null }) {
  const item = STATUS[status ?? 'never'] ?? STATUS.never;
  return (
    <span
      className={`inline-block text-[11px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-md ${item.className}`}
    >
      {item.label}
    </span>
  );
}

export { STATUS, SourceBadge };
