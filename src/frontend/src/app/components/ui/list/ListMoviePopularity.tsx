'use client';

import { useEffect, useState } from 'react';

import { Movie, User } from '@/types/data';
import { STYLES, ERROR_MESSAGES, GENRES } from '@/constants';
import getMoviesPopularity from '@/api/movies/getMoviesPopularity';
import getMyAccount from '@/api/auth/getMyAccount';

import ListMovie from './ListMovie';
import Loading from '../Loading';

interface Props {
  targetGenreId: number;
}

/**
 * 人気ベース推薦システムによる推薦映画リストコンポーネント
 */
const ListMoviePopularity = (props: Props) => {
  const [loading, setLoading] = useState(true);
  const [loadingUser, setLoadingUser] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);

  const phrase = `${GENRES[props.targetGenreId - 1]}で${STYLES.LIST_MOVIE_POPULARITY_PHRASE}`;

  useEffect(() => {
    const load = async () => {
      try {
        const user_ = await getMyAccount();
        setUser(user_);
      } catch (e) {
        setUser(null);
      } finally {
        setLoadingUser(false);
      }

      try {
        const { movies: movies_ } = await getMoviesPopularity(props.targetGenreId);
        setMovies(movies_);
      } catch (e) {
        console.error(ERROR_MESSAGES.MOVIE_GET_FAILED, e);
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [props.targetGenreId]);

  if (loading) {
    return (
      <div className={`${STYLES.LOADING_INLINE}`}>
        <Loading />
      </div>
    );
  }

  return (
    <>
      <ListMovie phrase={phrase} user={loadingUser ? null : user} movies={movies} />
    </>
  );
};

export default ListMoviePopularity;
