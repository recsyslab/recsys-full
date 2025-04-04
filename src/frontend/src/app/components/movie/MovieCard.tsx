import { Movie, User } from '@/types/data';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import StarRating from '../rating/StarRating';
import postRating from '@/services/ratings/postRating';
import getRating from '@/services/ratings/getRating';
import { IconButton } from '@mui/material';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

const STAR_WIDTH = 24;

type Props = {
  movie: Movie;
  user: User;
  isMyList?: boolean;
  handleRatingClick: Function;
  handleDelete?: Function;
};

const MovieCard = (props: Props) => {
  const img_url = props.movie.omdbMovie ? props.movie.omdbMovie.poster : '/img/dummy_poster.png';

  const handleRatingClick = async (rating: number) => {
    await postRating(props.user, props.movie, rating);
    const rating_ = await getRating(props.user, props.movie);
    let movie_ = JSON.parse(JSON.stringify(props.movie));
    movie_.rating = JSON.parse(JSON.stringify(rating_));
    props.handleRatingClick(movie_);
  };

  return (
    <>
      <article className="h-72 w-32 shadow" key={props.movie.id}>
        <Link href={`/movies/${props.movie.id}`} className="hover:opacity-75">
          <Image
            src={img_url}
            alt=""
            width={120}
            height={180}
            priority={true}
            unoptimized
            onError={(e: any) => {
              const target = e.currentTarget;
              target.onerror = null;
              target.src = '/img/dummy_poster.png';
            }}
          />
        </Link>
        {props.user ? (
          <StarRating
            starWidth={STAR_WIDTH}
            rating={props.movie.rating?.rating}
            handleRatingClick={handleRatingClick}
          />
        ) : (
          <></>
        )}
        <div className="mx-1">
          <div className="line-clamp-2 font-semibold text-gray-800">{props.movie.title}</div>
          <div className="flex">
            <div className="my-1 rounded bg-gray-200 px-1 py-0.5 text-sm text-gray-800">
              {props.movie.year}
            </div>
            {props.isMyList == true ? (
              <IconButton onClick={() => props.handleDelete!(props.movie)}>
                <HighlightOffIcon className="text-sm" />
              </IconButton>
            ) : (
              <></>
            )}
          </div>
        </div>
      </article>
    </>
  );
};

export default MovieCard;
