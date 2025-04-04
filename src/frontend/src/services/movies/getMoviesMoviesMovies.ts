import { ApiContext, Movie, User } from '@/types/data';
import { fetcher } from '@/utils';

const context: ApiContext = {
  apiRootUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
};

/**
 * 映画-映画推薦システムによる映画リスト取得API
 * @param baseMovie - ベース映画
 * @param user - ユーザ
 * @returns 映画リスト
 */
const getMoviesMoviesMovies = async (
  baseMovie: Movie,
  user?: User
): Promise<{ movies: Movie[] }> => {
  const userParam = user ? `&user_id=${user.id}` : '';
  return await fetcher(
    `${context.apiRootUrl?.replace(/\/$/g, '')}/movies_movies_movies/?base_movie_id=${baseMovie.id}${userParam}`,
    {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    }
  );
};

export default getMoviesMoviesMovies;
