import { deleteCookie, getCookie, setCookie } from 'cookies-next';
import ky, { KyRequest, Options } from 'ky';

const getToken = () => {
  return getCookie('auth_token');
};

const config: Options = {
  prefixUrl:
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  next: {
    revalidate: 120,
  },
  hooks: {
    beforeRequest: [
      (request: KyRequest) => {
        const token = getToken();
        if (token) {
          request.headers.set('Authorization', `Token ${token}`);
        }
        const orgId = getCookie('organization');
        if (orgId) {
          request.headers.set('X-Organization', `${orgId}`);
        }
      },
    ],
  },
};

const api = ky.extend(config);

export { api };
