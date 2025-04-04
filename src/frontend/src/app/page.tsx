import { SessionProvider } from 'next-auth/react';
import React from 'react';
import HelloAccount from './components/HelloAccount';
import connectUser from '@/services/users/connectUser';
import MovieList from './components/movie/MovieList';
import getMovies from '@/services/movies/getMovies';
import { auth } from '@/auth';
import getUser from '@/services/users/getUser';
import MovieListPopularity from './components/movie/MovieListPopularity';
import MovieListBPR from './components/movie/MovieListBPR';

const PER_PAGE = 5;
const N_GENRES = 19;
const N_MOVIE_LISTS_POPULARITY = 3;

const Index = async () => {
  await connectUser();
  const session = await auth();
  const user = session ? await getUser(session?.user?.email!) : null;
  const { movies } = await getMovies(user!);

  return (
    <>
      <section>
        <SessionProvider>
          <HelloAccount />
        </SessionProvider>
        <MovieList phrase="本日のおすすめ" movies={movies} perPage={PER_PAGE} user={user!} />
        {session?.user ? <MovieListBPR user={user!} perPage={PER_PAGE} /> : <></>}
        {(function () {
          // ジャンル配列をシャッフルする。
          const genres = [...Array(N_GENRES)].map((_, i) => i + 1);
          genres.sort((a, b) => 0.5 - Math.random());

          const movieListsByPopularityRecommender = [];
          for (let i = 0; i < N_MOVIE_LISTS_POPULARITY; i++) {
            movieListsByPopularityRecommender.push(
              <MovieListPopularity
                targetGenreId={genres[i]}
                perPage={PER_PAGE}
                user={user!}
                key={i}
              />
            );
          }
          return <div>{movieListsByPopularityRecommender}</div>;
        })()}
      </section>
    </>
  );
};

export default Index;
