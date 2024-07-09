import axios from 'axios';

const api = axios.create({
  baseURL:
    'https://6p7hcw5uj1.execute-api.sa-east-1.amazonaws.com/dev',
});

const fetcher = async (url: string) => {
  const { data } = await api.get(url);
  return data;
};

export { fetcher };

export default api;
