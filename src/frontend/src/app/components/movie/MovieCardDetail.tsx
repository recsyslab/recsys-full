'use client';
import { Movie, User } from '@/types/data';
import Image from 'next/image';
import React from 'react';
import StarRating from '../rating/StarRating';
import postRating from '@/services/ratings/postRating';

const STAR_WIDTH = 48;

type Props = {
  movie: Movie;
  user: User;
};

const MovieCardDetail = (props: Props) => {
  const img_url = props.movie.omdbMovie ? props.movie.omdbMovie.poster : '/img/dummy_poster.png';

  const handleRatingClick = async (rating: number) => {
    await postRating(props.user, props.movie, rating);
  };

  return (
    <>
      <article key={props.movie.id}>
        <div className="mx-4 my-4 flex">
          <div className="flex-shrink-0 md:block">
            <Image
              src={img_url}
              alt=""
              width={150}
              height={224}
              priority={true}
              unoptimized
              onError={(e: any) => {
                const target = e.currentTarget;
                target.onerror = null;
                target.src = '/img/dummy_poster.png';
              }}
            />
          </div>
          <div className="ml-6">
            <div>
              <h3 className="text-3xl font-semibold text-gray-800">{props.movie.title}</h3>
            </div>
            <div className="my-2 flex">
              <div className="mx-1 my-1 rounded bg-gray-200 px-1 py-0.5 text-sm text-gray-800">
                {props.movie.year}
              </div>
            </div>
            <div className="my-2 flex">
              {props.movie.genres.map((genre) => (
                <div
                  className="mx-1 rounded bg-blue-500 px-1 py-0.5 text-xs text-white"
                  key={genre}
                >
                  {genre}
                </div>
              ))}
            </div>
            <div className="text-gray-800">{props.movie.omdbMovie?.plot}</div>
          </div>
        </div>
        {props.user ? (
          <StarRating
            starWidth={STAR_WIDTH}
            rating={props.movie.rating?.rating}
            handleRatingClick={handleRatingClick}
          />
        ) : (
          <></>
        )}
      </article>
    </>
  );
};

export default MovieCardDetail;
