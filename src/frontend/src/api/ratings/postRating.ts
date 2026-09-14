import { ApiContext } from '@/types/data';
import { ERROR_MESSAGES } from '@/constants';
import { fetcher } from '@/utils';

const context: ApiContext = {
  apiRootUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
};

/**
 * 評価値登録API
 * @param movieId - 映画ID
 * @param rating - 評価値
 */
const postRating = async (movieId: number, rating: number): Promise<void> => {
  const access = typeof window !== 'undefined' ? localStorage.getItem('access') : null;
  if (!access) throw new Error(ERROR_MESSAGES.USER_NOT_AUTHENTICATED);

  const url = `${context.apiRootUrl?.replace(/\/$/g, '')}/online/ratings/`;
  const headers: Record<string, string> = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: `Bearer ${access}`,
  };
  const body = JSON.stringify({
    movie_id: movieId,
    rating: rating,
  });

  return await fetcher(url, {
    method: 'POST',
    headers: headers,
    body: body,
  });
};

export default postRating;
