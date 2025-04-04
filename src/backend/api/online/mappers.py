from typing import Literal


class UserMapper:
    def __init__(self, obj):
        self.obj = obj

    def as_dict(self):
        user = self.obj
        return {
            'id': user.id,
            'email': user.get_email(),
        }
    

class MovieMapper:
    def __init__(self, obj):
        self.obj = obj

    def as_dict(self, user_id):
        movie = self.obj
        genres = [genre.name for genre in movie.genres.all()]
        rating = None
        if user_id:
            rating_model = movie.user_ratings[0] if movie.user_ratings else None
            rating = RatingMapper(rating_model).as_dict(mode='simple') if rating_model else None

        return {
            'id': movie.id,
            'title': movie.title,
            'year': movie.year,
            'genres': genres,
            'imdb_id': movie.imdb_id,
            'tmdb_id': movie.tmdb_id,
            'rating': rating,
        }
    

class RatingMapper:
    def __init__(self, obj):
        self.obj = obj

    def as_dict(self, mode: Literal['simple', 'full'] = 'full'):
        rating = self.obj
        
        if mode == 'simple':
            return {
                'rating': rating.rating,
                'rated_at': rating.rated_at,
            }
                
        return {
            'id': rating.id,
            'user_id': rating.user_id,
            'movie_id': rating.movie_id,
            'rating': rating.rating,
            'rated_at': rating.rated_at,
        }