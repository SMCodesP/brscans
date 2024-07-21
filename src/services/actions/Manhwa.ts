'use server';

import api from '../api';

class Manhwa {
  static async getLatest() {
    const response = await api.get<TPagination<TManga>>('/manhwas/');
    return response.data;
  }
}

export default Manhwa;
