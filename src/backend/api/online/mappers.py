class MovieMapper:
    def __init__(self, obj, rating=None):
        self.obj = obj
        self.rating = rating

    def as_dict(self):
        movie = self.obj
        genres = [GenreMapper(movie_genre.genre).as_dict() for movie_genre in movie.movie_genres.all()]
        rating = RatingMapper(self.rating).as_dict() if self.rating else None

        return {
            'movie_id': movie.movie_id,
            'title': movie.title,
            'year': movie.year,
            'genres': genres,
            'imdb_id': movie.imdb_id,
            'tmdb_id': movie.tmdb_id,
            'rating': rating,
        }


class GenreMapper:
    def __init__(self, obj):
        self.obj = obj

    def as_dict(self):
        genre = self.obj
        return {
            'genre_id': genre.genre_id,
            'genre_name': genre.genre_name,
        }
    

class RatingMapper:
    def __init__(self, obj):
        self.obj = obj

    def as_dict(self):
        rating = self.obj
        return {
            'rating': rating.rating,
            'rated_at': rating.rated_at,
        }


class OMDbMovieMapper:
    def __init__(self, obj):
        self.obj = obj

    def as_dict(self):
        movie = self.obj
        return {
            'title': movie.get('Title'),
            'poster': movie.get('Poster'),
            'director': movie.get('Director'),
            'writer': movie.get('Writer'),
            'actors': movie.get('Actors'),
            'plot': movie.get('Plot'),
        }