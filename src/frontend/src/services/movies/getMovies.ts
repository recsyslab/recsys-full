import { ApiContext, Movie, User } from '@/types/data';
import { fetcher } from '@/utils';

const context: ApiContext = {
  apiRootUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
};

/**
 * 映画リスト取得API
 * @param user - ユーザ
 * @returns 映画リスト
 */
const getMovies = async (user?: User): Promise<{ movies: Movie[] }> => {
  const userParam = user ? `?user_id=${user.id}` : '';
  return await fetcher(`${context.apiRootUrl?.replace(/\/$/g, '')}/movies/${userParam}`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });
};

export default getMovies;
