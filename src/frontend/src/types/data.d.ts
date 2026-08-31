// API Context
export type ApiContext = {
  apiRootUrl?: string | undefined;
};

// ユーザモデル
export type User = {
  id: string;
  user_id: string;
  user_email: string;
};

/**
 * ジャンルモデル
 */
export type Genre = {
  genre_id: number;
  genre_name: string;
};

/**
 * 映画モデル
 */
export type Movie = {
  movie_id: number;
  title: string;
  year: number;
  genres: Genre[];
  imdb_id: number;
  tmdb_id: number;
  rating: Rating | null;
  omdbMovie?: OMDbMovie;
};

// OMDb映画モデル
export type OMDbMovie = {
  title: string;
  poster: string;
  director: string;
  writer: string;
  actors: string;
  plot: string;
};

/**
 * 評価モデル
 */
export type Rating = {
  id: string;
  user_id: string;
  movie_id: number;
  rating: number;
  rated_at: string;
};
