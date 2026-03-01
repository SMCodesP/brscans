'use server';

import { Viewset, endpoints } from '../Viewset';
import { api } from '../api';

class Manhwa extends Viewset<TManga> {
  public endpoint: endpoints = 'manhwas';

  async getLatest() {
    const response = await api.get<TPagination<TManga>>(
      `${this.endpoint}/`
    );
    return await response.json();
  }

  async getRecentChapters(limit = 20) {
    const response = await api.get<TRecentChapter[]>(
      `${this.endpoint}/recent_chapters/`,
      { searchParams: { limit: String(limit) } }
    );
    return await response.json();
  }

  async getTopMangas(limit = 10) {
    const response = await api.get<TManga[]>(
      `${this.endpoint}/top/`,
      { searchParams: { limit: String(limit) } }
    );
    return await response.json();
  }

  async getGenres() {
    const response = await api.get<TGenre[]>(
      `${this.endpoint}/genres/`
    );
    return await response.json();
  }
}

export default Manhwa;
