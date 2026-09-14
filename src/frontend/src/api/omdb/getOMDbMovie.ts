import { ApiContext, OMDbMovie } from '@/types/data';
import { fetcher } from '@/utils';

const context: ApiContext = {
  apiRootUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
};

/**
 * 映画取得API
 * @param movieId - 映画ID
 * @returns omdbMovie - OMDbによる映画オブジェクト
 */
const getOMDbMovie = async (movieId: number): Promise<{ omdbMovie: OMDbMovie }> => {
  const url = `${context.apiRootUrl?.replace(/\/$/g, '')}/online/omdb_movie/?movie_id=${movieId}`;
  const headers: Record<string, string> = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  const res = await fetcher(url, {
    method: 'GET',
    headers: headers,
    cache: 'no-store',
  });

  return { omdbMovie: res.omdb_movie };
};

export default getOMDbMovie;
