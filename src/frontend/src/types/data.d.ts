// API Context
export type ApiContext = {
  apiRootUrl: string | undefined;
};

// OMDb API Context
export type OMDbApiContext = {
  apiRootUrl: string | undefined;
  apiKey: string | undefined;
};

// ユーザ
export type User = {
  id: string;
  email: string;
};

// 映画
export type Movie = {
  id: number;
  title: string;
  year: number;
  genres: string[];
  imdb_id: number;
  tmdb_id: number;
  rating: Rating;
  omdbMovie: OMDbMovie | undefined;
};

// OMDb映画
export type OMDbMovie = {
  title: string;
  poster: string;
  director: string;
  writer: string;
  actors: string;
  plot: string;
};

// 評価値
export type Rating = {
  id: string;
  user_id: string;
  movie_id: number;
  rating: number;
  rated_at: string;
};
