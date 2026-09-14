import { ApiContext, Rating } from '@/types/data';
import { ERROR_MESSAGES } from '@/constants';
import { fetcher } from '@/utils';

const context: ApiContext = {
  apiRootUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
};

/**
 * 評価値取得API
 * @param movieId - 映画ID
 * @returns rating - 評価値
 */
const getRating = async (movieId: number): Promise<{ rating: Rating }> => {
  const access = typeof window !== 'undefined' ? localStorage.getItem('access') : null;
  if (!access) throw new Error(ERROR_MESSAGES.USER_NOT_AUTHENTICATED);

  const url = `${context.apiRootUrl?.replace(/\/$/g, '')}/online/ratings/?movie_id=${movieId}`;
  const headers: Record<string, string> = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: `Bearer ${access}`,
  };

  return await fetcher(url, {
    method: 'GET',
    headers: headers,
    cache: 'no-store',
  });
};

export default getRating;
