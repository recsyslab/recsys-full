from django.urls import path
from .views import SignUpView, SignInView, SignOutView, MeView

urlpatterns = [
    path("signup/", SignUpView.as_view(), name="accounts-signup"),
    path("signin/", SignInView.as_view(), name="accounts-signin"),
    path("signout/", SignOutView.as_view(), name="accounts-signout"),
    path("me/", MeView.as_view(), name="accounts-me"),
]