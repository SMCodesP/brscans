import axios from 'axios';

const api = axios.create({
  baseURL: String(process.env.NEXT_PUBLIC_API_URL),
});

const fetcher = async (url: string) => {
  const { data } = await api.get(url);
  return data;
};

export { fetcher };

export default api;
