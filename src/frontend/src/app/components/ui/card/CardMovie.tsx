'use client';

import React, { useCallback, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { IconButton } from '@mui/material';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

import { Movie, User } from '@/types/data';
import { STYLES, MESSAGES } from '@/constants';
import postRating from '@/api/ratings/postRating';
import getRating from '@/api/ratings/getRating';

import StarRating from '../rating/StarRating';

interface Props {
  movie: Movie;
  user?: User | null;
  isMyList?: boolean;
  handleRatingClick: (movie: Movie) => void;
  handleDelete?: (movie: Movie) => void;
}

/**
 * 映画カードコンポーネント
 */
const CardMovie = (props: Props) => {
  const posterPath = useMemo(() => {
    const path =
      props.movie.omdbMovie && props.movie.omdbMovie.poster !== 'N/A'
        ? props.movie.omdbMovie.poster
        : STYLES.MOVIE_POSTER_PATH_DUMMY;
    return path;
  }, [props.movie]);

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

  const handleRatingClick = async (rating: number) => {
    try {
      await postRating(props.movie.movie_id, rating);

      const { rating: rating_ } = await getRating(props.movie.movie_id);
      const movie_: Movie = {
        ...props.movie,
        rating: rating_,
      };
      props.handleRatingClick(movie_);
    } catch (e) {
      console.error('Failed to post rating:', e);
    }
  };

  return (
    <article className={`${STYLES.MOVIE_CARD}`} key={props.movie.movie_id}>
      <div className={`${STYLES.MOVIE_IMAGE}`}>
        <Link href={`/movies/${props.movie.movie_id}/`} className="hover:opacity-75">
          <Image
            src={posterPath}
            alt={props.movie.title}
            width={STYLES.MOVIE_POSTER_WIDTH}
            height={STYLES.MOVIE_POSTER_HEIGHT}
            unoptimized
            onError={handleImageError}
            priority={false}
            loading="lazy"
          />
        </Link>
      </div>
      <div className={`${STYLES.MOVIE_INFO}`}>
        <div className={`${STYLES.MOVIE_LABEL_TITLE}`}>{props.movie.title}</div>
      </div>
      {props.user ? (
        <StarRating
          starWidth={STYLES.MOVIE_STAR_WIDTH}
          rating={props.movie.rating?.rating!}
          handleRatingClick={handleRatingClick}
        />
      ) : (
        <></>
      )}
      {props.isMyList && props.handleDelete && (
        <IconButton
          size="small"
          onClick={() => props.handleDelete?.(props.movie)}
          className={`${STYLES.MOVIE_ICON_DELETE}`}
        >
          <HighlightOffIcon fontSize="small" />
        </IconButton>
      )}
    </article>
  );
};

export default CardMovie;
