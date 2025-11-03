from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FileMetadataViewSet

router = DefaultRouter()
router.register(r'files', FileMetadataViewSet, basename='file')

urlpatterns = [
    path('', include(router.urls)),
]

