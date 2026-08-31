import { ApiContext } from '@/types/data';
import { ERROR_MESSAGES } from '@/constants';
import { fetcher } from '@/utils';

const context: ApiContext = {
  apiRootUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
};

/**
 * 評価値削除API
 * @param movieId - 映画ID
 */
const deleteRating = async (movieId: number): Promise<void> => {
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
  });

  return await fetcher(url, {
    method: 'DELETE',
    headers: headers,
    body: body,
  });
};

export default deleteRating;
