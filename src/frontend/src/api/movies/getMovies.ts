import { ApiContext, Movie } from '@/types/data';
import { fetcher } from '@/utils';

const context: ApiContext = {
  apiRootUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
};

/**
 * 映画リスト取得API
 * @returns movies - 映画リスト
 */
const getMovies = async (): Promise<{ movies: Movie[] }> => {
  const access = typeof window !== 'undefined' ? localStorage.getItem('access') : null;

  const url = `${context.apiRootUrl?.replace(/\/$/g, '')}/online/movies/`;
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

export default getMovies;
