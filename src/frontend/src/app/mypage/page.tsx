import React from 'react';
import { auth } from '@/auth';
import getMoviesRated from '@/services/movies/getMoviesRated';
import connectUser from '@/services/users/connectUser';
import getUser from '@/services/users/getUser';
import MovieList from '../components/movie/MovieList';
import MovieListBPR from '../components/movie/MovieListBPR';

const PER_PAGE = 5;

const MyPage = async () => {
  await connectUser();
  const session = await auth();
  const user = session ? await getUser(session?.user?.email!) : null;
  const { movies } = await getMoviesRated(user!);
  const phrase = 'マイリスト';

  return (
    <>
      {session?.user ? (
        <>
          <MovieList
            phrase={phrase}
            movies={movies}
            perPage={PER_PAGE}
            user={user!}
            isMyList={true}
          />
          <MovieListBPR user={user!} perPage={PER_PAGE} />
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default MyPage;
