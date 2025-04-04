import { ApiContext, Movie, User } from '@/types/data';
import { fetcher } from '@/utils';

const context: ApiContext = {
  apiRootUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
};

/**
 * 人気ベース推薦システムによる映画リスト取得API
 * @param targetGenreId - 対象ジャンルID
 * @param user - ユーザ
 * @returns 映画リスト
 */
const getMoviesPopularity = async (
  targetGenreId: number,
  user?: User
): Promise<{ movies: Movie[] }> => {
  const userParam = user ? `&user_id=${user.id}` : '';
  return await fetcher(
    `${context.apiRootUrl?.replace(/\/$/g, '')}/movies_popularity/?target_genre_id=${targetGenreId}${userParam}`,
    {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    }
  );
};

export default getMoviesPopularity;
