import { Movie, OMDbApiContext, OMDbMovie } from '@/types/data';
import { fetcher } from '@/utils';

const context: OMDbApiContext = {
  apiRootUrl: process.env.NEXT_PUBLIC_OMDB_API_BASE_URL,
  apiKey: process.env.NEXT_PUBLIC_OMDB_API_KEY,
};

/**
 * OMDbによる映画取得API
 * @param movie - 映画
 * @returns OMDbによる映画
 */
const getOMDbMovie = async (movie: Movie): Promise<{ omdbMovie: OMDbMovie } | undefined> => {
  if (!context.apiKey) return undefined;

  const imdbId = 'tt0' + String(movie.imdb_id).padStart(7, '0');
  const movie_ = await fetcher(
    `${context.apiRootUrl?.replace(/\/$/g, '')}/?apikey=${context.apiKey}&i=${imdbId}`,
    {
      mode: 'cors',
    }
  );
  const omdbMovie = {
    title: movie_.Title,
    poster: movie_.Poster,
    director: movie_.Director,
    writer: movie_.Writer,
    actors: movie_.Actors,
    plot: movie_.Plot,
  };
  return { omdbMovie };
};

export default getOMDbMovie;
