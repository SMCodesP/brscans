import { cookies } from 'next/headers';

import ky, { KyRequest, Options } from 'ky';

const config: Options = {
  prefixUrl: String(process.env.NEXT_PUBLIC_API_URL),
  hooks: {
    beforeRequest: [
      async (request: KyRequest) => {
        try {
          const token = (await cookies()).get('auth_token');
          if (token && token?.value) {
            request.headers.set(
              'Authorization',
              `Token ${token.value}`
            );
          }
        } catch (error) {}
      },
    ],
  },
  next: {
    revalidate: 60,
  },
};

const api = ky.extend(config);

const fetcher = async <T>(
  url: string,
  tags?: string[],
  searchParams?: Record<string, string | number>,
  revalidate: number = 60
): Promise<T> => {
  const response = await api
    .get(`${url}/`, {
      searchParams,
      next: {
        tags,
        revalidate,
      },
    })
    .json<T>();

  return response;
};

export { api, fetcher };
