import { ApiContext, Movie, User } from '@/types/data';
import { fetcher } from '@/utils';

const context: ApiContext = {
  apiRootUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
};

/**
 * 評価値登録API
 * @param user ユーザ
 * @param movie 映画
 * @param rating 評価値
 */
const postRating = async (user: User, movie: Movie, rating: number) => {
  const id = user.id + '_' + String(movie.id).padStart(6, '0');
  const body = {
    id: id,
    user_id: user.id,
    movie_id: movie.id,
    rating: rating,
  };
  await fetcher(`${context.apiRootUrl?.replace(/\/$/g, '')}/ratings/`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
};

export default postRating;
