import MovieCardDetail from '@/app/components/movie/MovieCardDetail';
import MovieListMoviesMovies from '@/app/components/movie/MovieListMoviesMovies';
import { auth } from '@/auth';
import getMovie from '@/services/movies/getMovie';
import getOMDbMovie from '@/services/omdbApi/getOMDbMovie';
import connectUser from '@/services/users/connectUser';
import getUser from '@/services/users/getUser';

const PER_PAGE = 5;

const Movie = async ({ params }: { params: Promise<{ id: number }> }) => {
  await connectUser();
  const session = await auth();
  const user = session ? await getUser(session?.user?.email!) : null;
  const { id } = await params;
  const movieId = id;
  const { movie } = await getMovie(movieId, user!);
  const res = await getOMDbMovie(movie);
  movie.omdbMovie = res ? res.omdbMovie : undefined;

  return (
    <>
      <MovieCardDetail movie={movie} user={user!} />
      <MovieListMoviesMovies baseMovie={movie} user={user!} perPage={PER_PAGE} />
    </>
  );
};

export default Movie;
