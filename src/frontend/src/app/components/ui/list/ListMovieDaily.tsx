'use client';

import { useEffect, useState } from 'react';

import { Movie, User } from '@/types/data';
import { STYLES, ERROR_MESSAGES } from '@/constants';
import getMovies from '@/api/movies/getMovies';
import getMyAccount from '@/api/auth/getMyAccount';

import ListMovie from './ListMovie';
import Loading from '../Loading';

/**
 * 本日のおすすめ映画リストコンポーネント
 */
const ListMovieDaily = () => {
  const [loading, setLoading] = useState(true);
  const [loadingUser, setLoadingUser] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);

  const phrase = STYLES.LIST_MOVIE_DAILY_PHRASE;

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
        const { movies: movies_ } = await getMovies();
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
      <ListMovie phrase={phrase} user={loadingUser ? null : user} movies={movies} />
    </>
  );
};

export default ListMovieDaily;
