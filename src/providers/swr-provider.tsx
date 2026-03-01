'use client';

import { SWRConfig } from 'swr';

import { api } from '@/services/api';
import ky, { Options } from 'ky';
import { identity, pickBy } from 'lodash';

const fetcher = async (
  url:
    | string
    | ({
        url: string;
        params?: Record<string, string>;
        disabled?: boolean;
      } & Options)
) => {
  if (typeof url === 'object' && url.disabled) {
    return null;
  }

  const isAbsolute = (u: string) => /^https?:\/\//.test(u);

  try {
    if (typeof url === 'object') {
      const client = isAbsolute(url.url) ? ky : api;
      const response = await client
        .get(url.url, {
          ...url,
          searchParams: pickBy(url.params, identity),
        })
        .json();
      return response;
    }
    const client = isAbsolute(url) ? ky : api;
    const response = await client.get(url).json();
    return response;
  } catch (error) {
    throw error;
  }
};

export const SWRProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <SWRConfig
      value={{
        fetcher,
        keepPreviousData: true,
      }}
    >
      {children}
    </SWRConfig>
  );
};
