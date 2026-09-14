'use client';

import { useState } from 'react';

import { STYLES } from '@/constants';

import Star from './Star';

interface Props {
  starWidth: number;
  rating: number;
  handleRatingClick: (rating: number) => void;
}

const StarRating = (props: Props) => {
  const [rating, setRating] = useState<number>(props.rating);

  return (
    <>
      <div className={`${STYLES.STAR_RATING}`}>
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
