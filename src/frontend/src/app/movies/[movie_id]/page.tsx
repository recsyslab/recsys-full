import CardMovieDetail from '@/app/components/ui/card/CardMovieDetail';

type Props = {
  params: Promise<{ movie_id: string }>;
};

const Movie = async ({ params }: Props) => {
  const { movie_id } = await params;
  const movieId = Number(movie_id);

  return (
    <>
      <CardMovieDetail movieId={movieId} />
    </>
  );
};

export default Movie;
