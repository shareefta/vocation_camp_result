from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import (
    StudentViewSet, HeroImageViewSet, AppConfigViewSet,
    bulk_upload_students, check_result
)

router = DefaultRouter()
router.register(r'students', StudentViewSet)
router.register(r'hero-images', HeroImageViewSet)
router.register(r'config', AppConfigViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('bulk-upload/', bulk_upload_students, name='bulk_upload'),
    path('check-result/', check_result, name='check_result'),
]
