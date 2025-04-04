'use client';
import { Movie, User } from '@/types/data';
import React, { useEffect, useState } from 'react';
import MovieCard from './MovieCard';
import deleteRating from '@/services/ratings/deleteRating';
import getOMDbMovie from '@/services/omdbApi/getOMDbMovie';

import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

type Props = {
  phrase: string;
  movies: Movie[];
  perPage: number;
  user: User;
  isMyList?: boolean;
};

const MovieList = (props: Props) => {
  const [movies, setMovies] = useState<Movie[]>(props.movies);
  const [currentMovies, setCurrentMovies] = useState<Movie[]>();
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (movies.length <= 0) {
      setCurrentMovies(movies);
    }

    const start = props.perPage * currentPage;
    const end = start + props.perPage;
    const currentMovies_ = movies.slice(start, end);

    if (currentMovies_.length <= 0) {
      let currentPage_ = currentPage <= 0 ? 0 : currentPage - 1;
      setCurrentPage(currentPage_);
    } else {
      setCurrentMovies(currentMovies_);
    }
  }, [movies, currentPage]);

  useEffect(() => {
    const func = async () => {
      const movies_ = await Promise.all(
        movies.map(async (movie) => {
          const movie_ = JSON.parse(JSON.stringify(movie));
          const res = await getOMDbMovie(movie);
          movie_.omdbMovie = res ? res.omdbMovie : undefined;
          return movie_;
        })
      );
      setMovies(movies_);
    };

    setLoading(true);
    func();
    setLoading(false);
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    page = page < 0 ? Math.max(Math.floor((movies.length - 1) / props.perPage), 0) : page;
    page = page >= Math.ceil(movies.length / props.perPage) ? 0 : page;
    setCurrentPage(page);
  };

  const handleRatingClick = (movie: Movie) => {
    const movies_ = movies.map((movie_) => {
      let movie__ =
        movie_.id == movie.id
          ? JSON.parse(JSON.stringify(movie))
          : JSON.parse(JSON.stringify(movie_));
      return movie__;
    });
    setMovies(movies_);
  };

  const handleDelete = async (movie: Movie) => {
    await deleteRating(props.user, movie);
    const movies_ = movies.filter((movie_) => movie_.id != movie.id);
    setMovies(movies_);
  };

  return (
    <>
      <div className="text-xl font-bold text-gray-800">{props.phrase}</div>
      <div className="mx-4 my-4 flex justify-between">
        <button
          className="cursor-pointer rounded-md border-2 border-gray-200 text-gray-800 hover:bg-gray-100 active:border-gray-300 active:bg-gray-200"
          onClick={() => handlePageChange(currentPage - 1)}
        >
          <ArrowBackIosIcon />
        </button>
        {loading ? (
          <div className="flex items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-t-4 border-blue-500"></div>
          </div>
        ) : (
          <>
            {currentMovies?.map((movie) => (
              <MovieCard
                movie={movie}
                user={props.user}
                isMyList={props.isMyList}
                handleRatingClick={handleRatingClick}
                handleDelete={handleDelete}
                key={movie.id}
              />
            ))}
          </>
        )}
        <button
          className="cursor-pointer rounded-md border-2 border-gray-200 text-gray-800 hover:bg-gray-100 active:border-gray-300 active:bg-gray-200"
          onClick={() => handlePageChange(currentPage + 1)}
        >
          <ArrowForwardIosIcon />
        </button>
      </div>
    </>
  );
};

export default MovieList;
