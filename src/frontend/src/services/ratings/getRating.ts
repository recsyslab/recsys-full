import { ApiContext, Movie, Rating, User } from '@/types/data';
import { fetcher } from '@/utils';

const context: ApiContext = {
  apiRootUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
};

/**
 * 評価値取得API
 * @param user - ユーザ
 * @param movie - 映画
 * @returns 評価値
 */
const getRating = async (user: User, movie: Movie): Promise<{ rating: Rating }> => {
  const id = user.id + '_' + String(movie.id).padStart(6, '0');
  const res = await fetcher(`${context.apiRootUrl?.replace(/\/$/g, '')}/ratings/?id=${id}`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });
  return res.ratings.at(-1);
};

export default getRating;
