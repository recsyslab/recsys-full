import { Movie, User } from '@/types/data';
import React from 'react';
import MovieList from './MovieList';
import getMoviesMoviesMovies from '@/services/movies/getMoviesMoviesMovies';

type Props = {
  baseMovie: Movie;
  perPage: number;
  user: User;
};

const MovieListMoviesMovies = async (props: Props) => {
  const phrase = 'この映画が好きな人はこんな映画も好んでいます';
  const { movies } = await getMoviesMoviesMovies(props.baseMovie, props.user);

  return (
    <>
      <MovieList phrase={phrase} movies={movies} perPage={props.perPage} user={props.user} />
    </>
  );
};

export default MovieListMoviesMovies;
