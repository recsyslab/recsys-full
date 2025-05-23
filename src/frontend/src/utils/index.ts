import { notFound } from 'next/navigation';

export const fetcher = async (resource: RequestInfo, init?: RequestInit): Promise<any> => {
  const res = await fetch(resource, init);

  if (res.status === 404) {
    notFound();
  }

  if (!res.ok) {
    const errorRes = await res.json();
    const error = new Error(errorRes.message ?? 'APIリクエスト中にエラーが発生しました');

    throw error;
  }

  return res.json();
};
