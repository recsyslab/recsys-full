'use client';
import React, { useState } from 'react';
import Star from './Star';

type Props = {
  starWidth: number;
  rating: number;
  handleRatingClick: Function;
};

const StarRating = (props: Props) => {
  const [rating, setRating] = useState<number>(props.rating);

  return (
    <>
      <div className="flex">
        {(function () {
          const stars = [];
          for (let i = 0; i < 10; i++) {
            stars.push(
              <Star
                key={i}
                index={i}
                width={props.starWidth}
                rating={rating}
                setRating={setRating}
                handleRatingClick={props.handleRatingClick}
              />
            );
          }
          return <div>{stars}</div>;
        })()}
      </div>
    </>
  );
};

export default StarRating;
