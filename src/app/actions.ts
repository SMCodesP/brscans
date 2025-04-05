'use server';

import { cookies } from 'next/headers';

export async function changeCookieServer(
  name: string,
  value: string
) {
  const cookiesStore = await cookies();
  cookiesStore.set(name, value);
}
