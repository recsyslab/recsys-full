import { ApiContext, Movie } from '@/types/data';
import { fetcher } from '@/utils';

const context: ApiContext = {
  apiRootUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
};

/**
 * 映画取得API
 * @param movieId - 映画ID
 * @returns movie - 映画オブジェクト
 */
const getMovie = async (movieId: number): Promise<{ movie: Movie }> => {
  const access = typeof window !== 'undefined' ? localStorage.getItem('access') : null;

  const url = `${context.apiRootUrl?.replace(/\/$/g, '')}/online/movies/${movieId}`;
  const headers: Record<string, string> = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    ...(access ? { Authorization: `Bearer ${access}` } : {}),
  };

  return await fetcher(url, {
    method: 'GET',
    headers: headers,
    cache: 'no-store',
  });
};

export default getMovie;
