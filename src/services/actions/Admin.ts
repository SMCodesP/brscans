import { api } from '../api';

/** Chaves de SWR das listas do painel. */
const adminKeys = {
  manhwas: (q = '', page = 1, status = '') =>
    `panel/manhwas/?q=${encodeURIComponent(q)}&page=${page}&source_status=${status}`,
  chapters: (id: number, page = 1) =>
    `panel/manhwas/${id}/chapters/?page=${page}`,
  problems: (page = 1) => `panel/problems/?page=${page}`,
  chapterPages: (id: number) => `panel/chapters/${id}/pages/`,
  sources: () => 'panel/sources/',
  sourceSearch: (name: string, q: string) =>
    `panel/sources/${encodeURIComponent(name)}/search/?q=${encodeURIComponent(q)}`,
};

const adminFetcher = <T>(url: string) => api.get(url).json<T>();

/** Primeira mensagem do DRF ({"detail": ...} ou {"campo": ["..."]}). */
const adminError = async (err: any, fallback: string) => {
  const detail = await err.response?.json?.().catch(() => null);
  const first = Object.values(detail ?? {}).flat()[0];
  return typeof first === 'string' ? first : err.message || fallback;
};

/**
 * Rotas do Painel-API (staff-only). Não entram no Viewset: não são CRUD
 * e a maioria só enfileira task (202).
 */
class Admin {
  addManhwa(link: string, limit?: number, isNsfw = false) {
    return api
      .post<TAdminTaskQueued>('panel/manhwas/', {
        json: { link, is_nsfw: isNsfw, ...(limit ? { limit } : {}) },
      })
      .json();
  }

  checkSource(id: number) {
    return api
      .post<TAdminTaskQueued>(`panel/manhwas/${id}/check-source/`)
      .json();
  }

  sync(id: number) {
    return api
      .post<TAdminTaskQueued>(`panel/manhwas/${id}/sync/`)
      .json();
  }

  /** Migra o manga para a URL escolhida na busca de outra fonte. */
  migrate(id: number, url: string) {
    return api
      .post<TAdminMigration>(`panel/manhwas/${id}/migrate/`, {
        json: { url },
      })
      .json();
  }

  fixChapter(id: number) {
    return api
      .post<TAdminTaskQueued>(`panel/chapters/${id}/fix/`)
      .json();
  }

  patchImage(
    id: number,
    data: Partial<
      Pick<TImageVariant, 'raw' | 'original' | 'translated'>
    >
  ) {
    return api
      .patch<TImageVariant>(`images/${id}/`, { json: data })
      .json();
  }

  /** Copia original -> translated no backend, preservando o original. */
  useOriginal(id: number) {
    return api
      .post<TImageVariant>(`images/${id}/use-original/`)
      .json();
  }
}

export { Admin, adminError, adminFetcher, adminKeys };
