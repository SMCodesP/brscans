import { api } from './api';

export type endpoints = 'manhwas' | 'chapters';

class Viewset<T> {
  public orgId: number | string | undefined;
  public endpoint?: endpoints;

  constructor(endpoint?: endpoints) {
    if (endpoint) {
      this.endpoint = endpoint;
    }
  }

  async list(params?: Record<string, any>) {
    const response = await api.get<TPagination<T>>(
      `${this.endpoint}/`,
      {
        searchParams: params,
      }
    );
    return await response.json();
  }

  async get(id: number | string) {
    const response = await api.get<T>(`${this.endpoint}/${id}/`);
    return await response.json();
  }

  async create<TData>(data: DeepPartial<TData>) {
    const response = await api.post<T>(`${this.endpoint}/`, {
      json: data,
    });
    return await response.json();
  }

  async patch(id: number | string, data: DeepPartial<T>) {
    const response = await api.patch<T>(`${this.endpoint}/${id}/`, {
      json: data,
    });
    return await response.json();
  }

  async delete(id: number | string) {
    return await api.delete(`${this.endpoint}/${id}/`);
  }

  async deleteMany(ids: number[]) {
    return api.delete(`${this.endpoint}/bulk_delete/`);
  }
}

export { Viewset };
