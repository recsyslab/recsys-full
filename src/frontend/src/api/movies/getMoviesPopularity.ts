import { ApiContext, Movie } from '@/types/data';
import { fetcher } from '@/utils';

const context: ApiContext = {
  apiRootUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
};

/**
 * 人気ベース推薦システムによる推薦映画リスト取得API
 * @param targetGenreId - 対象ジャンルID
 * @returns movies - 推薦映画リスト
 */
const getMoviesPopularity = async (targetGenreId: number): Promise<{ movies: Movie[] }> => {
  const access = typeof window !== 'undefined' ? localStorage.getItem('access') : null;

  const url = `${context.apiRootUrl?.replace(/\/$/g, '')}/online/movies/popularity/?target_genre_id=${targetGenreId}`;
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

export default getMoviesPopularity;
