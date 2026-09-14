'use client';

import { useEffect, useState } from 'react';

import { STYLES, GENRES } from '@/constants';

import ListMoviePopularity from './ListMoviePopularity';

const ListMoviePopularitySection = () => {
  const [genreIds, setGenreIds] = useState<number[]>([]);

  useEffect(() => {
    const ids = [...Array(GENRES.length)].map((_, i) => i + 1);
    ids.sort(() => 0.5 - Math.random());
    setGenreIds(ids.slice(0, STYLES.LIST_MOVIE_POPULARITY_COUNT));
  }, []);

  return (
    <>
      {genreIds.map((gid) => (
        <ListMoviePopularity targetGenreId={gid} key={gid} />
      ))}
    </>
  );
};

export default ListMoviePopularitySection;
