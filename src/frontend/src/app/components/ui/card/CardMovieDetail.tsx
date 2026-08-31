'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';

import { Movie, User } from '@/types/data';
import { MESSAGES, STYLES, ERROR_MESSAGES } from '@/constants';
import getMovie from '@/api/movies/getMovie';
import getMyAccount from '@/api/auth/getMyAccount';
import postRating from '@/api/ratings/postRating';
import getOMDbMovie from '@/api/omdb/getOMDbMovie';

import Loading from '../Loading';
import StarRating from '../rating/StarRating';
import ListMovieMovieSimilarity from '../list/ListMovieMovieSimilarity';

type Props = {
  movieId: number;
};

/**
 * 映画（詳細）カードコンポーネント
 */
const CardMovieDetail = (props: Props) => {
  const [loading, setLoading] = useState(true);
  const [loadingUser, setLoadingUser] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [movie, setMovie] = useState<Movie | null>(null);

  const posterPath = useMemo(() => {
    const path =
      movie && movie.omdbMovie && movie.omdbMovie.poster !== 'N/A'
        ? movie.omdbMovie.poster
        : STYLES.MOVIE_POSTER_PATH_DUMMY;
    return path;
  }, [movie]);

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
        const { movie: movie_ } = await getMovie(props.movieId);
        const res = await getOMDbMovie(movie_.movie_id);
        const movieWithOmdb: Movie = {
          ...movie_,
          omdbMovie: res ? res.omdbMovie : undefined,
        };
        setMovie(movieWithOmdb);
      } catch (e) {
        console.error(ERROR_MESSAGES.MOVIE_GET_FAILED, e);
        setMovie(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  /**
   * 画像エラーハンドラ
   * @param e - 画像エラーイベント
   */
  const handleImageError = useCallback((e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.currentTarget;
    target.onerror = null;
    target.src = STYLES.MOVIE_POSTER_PATH_DUMMY;
    console.log(MESSAGES.DUMMY_IMAGE_LOADED, target.src);
  }, []);

  if (loading) {
    return (
      <div className={`${STYLES.MOVIE_DETAIL_PAGE}`}>
        <Loading />
      </div>
    );
  }

  if (!movie) {
    notFound();
  }

  const handleRatingClick = async (rating: number) => {
    try {
      await postRating(movie.movie_id, rating);
    } catch (e) {
      console.error('Failed to post rating:', e);
    }
  };

  return (
    <div className={`${STYLES.MOVIE_DETAIL_PAGE}`}>
      <article className={`${STYLES.MOVIE_DETAIL_CARD}`} key={movie.movie_id}>
        <h1 className={`${STYLES.MOVIE_DETAIL_TITLE}`}>{movie.title}</h1>
        <div className={`${STYLES.MOVIE_DETAIL_BODY}`}>
          <div className={`${STYLES.MOVIE_DETAIL_IMAGE}`}>
            <Image
              src={posterPath}
              alt={movie.title}
              width={STYLES.MOVIE_DETAIL_POSTER_WIDTH}
              height={STYLES.MOVIE_DETAIL_POSTER_HEIGHT}
              unoptimized
              onError={handleImageError}
              priority={false}
              loading="lazy"
            />
          </div>
          <div className={`${STYLES.MOVIE_DETAIL_INFO}`}>
            <div className={`${STYLES.MOVIE_DETAIL_LABEL_YEAR}`}>{movie.year}</div>
            {movie.genres.length > 0 && (
              <div className={`${STYLES.MOVIE_DETAIL_TAG_GENRES}`}>
                {movie.genres.map((genre) => (
                  <span key={genre.genre_id} className={`${STYLES.MOVIE_DETAIL_TAG_GENRE}`}>
                    {genre.genre_name}
                  </span>
                ))}
              </div>
            )}
            {movie.omdbMovie?.plot && (
              <div className={`${STYLES.MOVIE_DETAIL_PLOT}`}>{movie.omdbMovie.plot}</div>
            )}
          </div>
        </div>
        {!loadingUser && user && (
          <StarRating
            starWidth={STYLES.MOVIE_DETAIL_STAR_WIDTH}
            rating={movie.rating?.rating!}
            handleRatingClick={handleRatingClick}
          />
        )}
        <ListMovieMovieSimilarity baseMovieId={movie.movie_id} />
      </article>
    </div>
  );
};

export default CardMovieDetail;
