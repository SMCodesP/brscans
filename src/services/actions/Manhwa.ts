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
}

export default Manhwa;
