import ky, { Options } from 'ky';

const config: Options = {
  prefixUrl: String(process.env.NEXT_PUBLIC_API_URL),
};

const api = ky.extend(config);

const fetcher = async (url: string) => {
  const response = await api.get(url);
  return response.json();
};

export { api, fetcher };
