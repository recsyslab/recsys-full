'use client';

import { useCallback } from 'react';
import Image from 'next/image';

import { STYLES } from '@/constants';

interface Props {
  index: number;
  width: number;
  rating: number;
  setRating: Function;
  handleRatingClick: (rating: number) => void;
}

const Star = (props: Props) => {
  const handleRatingClick = useCallback(() => {
    const rating = (props.index + 1) / 2;
    props.setRating(rating);
    props.handleRatingClick(rating);
  }, [props.setRating, props.handleRatingClick]);

  return (
    <>
      <button className={`${STYLES.STAR_BUTTON}`} onClick={() => handleRatingClick()}>
        <Image
          className={`${STYLES.STAR_IMAGE}`}
          src={`/img/star_${props.index % 2}${props.index < props.rating * 2 ? 1 : 0}.png`}
          alt=""
          width={props.width / 2}
          height={props.width}
        />
      </button>
    </>
  );
};

export default Star;
