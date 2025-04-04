from django.urls import path
from . import views

urlpatterns = [
    path('users/', views.UsersView.as_view()),
    path('movies/', views.MoviesView.as_view()),
    path('movies/<int:id>/', views.MovieView.as_view()),
    path('ratings/', views.RatingsView.as_view()),
    path('movies_popularity/', views.MoviesPopularityView.as_view()),
    path('movies_movies_movies/', views.MoviesMoviesMoviesView.as_view()),
    path('movies_bpr/', views.MoviesBPRView.as_view()),
    path('movies_rated/', views.MoviesRatedView.as_view()),
]