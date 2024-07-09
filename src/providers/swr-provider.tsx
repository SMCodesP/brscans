'use client';

import { SWRConfig } from 'swr';

import { fetcher } from '@/services/api';

export const SWRProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <SWRConfig
      value={{
        fetcher: fetcher,
        keepPreviousData: true,
      }}
    >
      {children}
    </SWRConfig>
  );
};
