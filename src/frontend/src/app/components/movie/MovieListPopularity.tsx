import { User } from '@/types/data';
import React from 'react';
import getMoviesPopularity from '@/services/movies/getMoviesPopularity';
import MovieList from './MovieList';

const GENRES = [
  'Action',
  'Adventure',
  'Animation',
  'Children',
  'Comedy',
  'Crime',
  'Documentary',
  'Drama',
  'Fantasy',
  'Film-Noir',
  'Horror',
  'Musical',
  'Mystery',
  'Romance',
  'Sci-Fi',
  'Thriller',
  'War',
  'Western',
  'IMAX',
];

type Props = {
  targetGenreId: number;
  perPage: number;
  user: User;
};

const MovieListPopularity = async (props: Props) => {
  const phrase = GENRES[props.targetGenreId - 1] + 'で人気の映画';
  const { movies } = await getMoviesPopularity(props.targetGenreId, props.user);

  return (
    <>
      <MovieList phrase={phrase} movies={movies} perPage={props.perPage} user={props.user} />
    </>
  );
};

export default MovieListPopularity;
