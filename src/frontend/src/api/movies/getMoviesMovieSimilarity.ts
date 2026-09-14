import { ApiContext, Movie } from '@/types/data';
import { fetcher } from '@/utils';

const context: ApiContext = {
  apiRootUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
};

/**
 * 映画類似度ベース推薦システムによる推薦映画リスト取得API
 * @param baseMovieId - ベース映画ID
 * @returns movies - 推薦映画リスト
 */
const getMoviesMovieSimilarity = async (baseMovieId: number): Promise<{ movies: Movie[] }> => {
  const access = typeof window !== 'undefined' ? localStorage.getItem('access') : null;

  const url = `${context.apiRootUrl?.replace(/\/$/g, '')}/online/movies/movie_similarity/?base_movie_id=${baseMovieId}`;
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

export default getMoviesMovieSimilarity;
