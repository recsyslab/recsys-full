from django.urls import path
from . import views

urlpatterns = [
    path('movies/', views.MoviesView.as_view()),
    path('movies/<int:movie_id>/', views.MovieView.as_view()),
    path('movies/popularity/', views.MoviesPopularityView.as_view()),
    path('movies/movie_similarity/', views.MoviesMovieSimilarityView.as_view()),
    path('movies/bpr/', views.MoviesBPRView.as_view()),
    path('movies/rated/', views.MoviesRatedView.as_view()),
    path('ratings/', views.RatingView.as_view()),
    path('omdb_movie/', views.OMDbMovieView.as_view()),
]