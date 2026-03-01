'use server';

import { revalidateTag, updateTag } from 'next/cache';
import { cookies } from 'next/headers';

export async function changeCookieServer(
  name: string,
  value: string
) {
  const cookiesStore = await cookies();
  cookiesStore.set(name, value);
}

export async function refreshTag(tag: string | string[]) {
  if (Array.isArray(tag)) {
    tag.forEach((t) => updateTag(t));
  } else {
    updateTag(tag);
  }
}

export async function revalidateCache(tag: string | string[]) {
  if (Array.isArray(tag)) {
    tag.forEach((t) => revalidateTag(t, 'max'));
  } else {
    revalidateTag(tag, 'max');
  }
}
