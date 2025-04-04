import { ApiContext, Movie, Rating, User } from '@/types/data';
import { fetcher } from '@/utils';

const context: ApiContext = {
  apiRootUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
};

/**
 * 評価値削除API
 * @param user - ユーザ
 * @param movie - 映画
 * @returns 評価値
 */
const deleteRating = async (user: User, movie: Movie): Promise<{ rating: Rating }> => {
  const id = user.id + '_' + String(movie.id).padStart(6, '0');
  const body = {
    id: id,
  };
  return await fetcher(`${context.apiRootUrl?.replace(/\/$/g, '')}/ratings/`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
};

export default deleteRating;
