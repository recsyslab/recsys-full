import { notFound } from 'next/navigation'; // <- 追加
import { ERROR_MESSAGES } from '@/constants';

export const fetcher = async (resource: RequestInfo, init?: RequestInit): Promise<any> => {
  const res = await fetch(resource, init);

  if (res.status === 404) {
    notFound();
  }

  if (!res.ok) {
    const error = new Error(ERROR_MESSAGES.API_REQUEST_ERROR);
    throw error;
  }

  return res.json();
};
