'use client';

import { useEffect, useState } from 'react';

import { Movie, User } from '@/types/data';
import { STYLES, ERROR_MESSAGES } from '@/constants';
import getMoviesRated from '@/api/movies/getMoviesRated';
import getMyAccount from '@/api/auth/getMyAccount';

import ListMovie from './ListMovie';
import Loading from '../Loading';

/**
 * 評価済み映画リストコンポーネント
 */
const ListMovieRated = () => {
  const [loading, setLoading] = useState(true);
  const [loadingUser, setLoadingUser] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);

  const phrase = STYLES.LIST_MOVIE_RATED_PHRASE;

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
        const { movies: movies_ } = await getMoviesRated();
        setMovies(movies_);
      } catch (e) {
        console.error(ERROR_MESSAGES.MOVIE_GET_FAILED, e);
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className={`${STYLES.LOADING_INLINE}`}>
        <Loading />
      </div>
    );
  }

  return (
    <>
      <ListMovie phrase={phrase} user={loadingUser ? null : user} movies={movies} isMyList={true} />
    </>
  );
};

export default ListMovieRated;
