from rest_framework import serializers
from .models import Student, HeroImage, AppConfig, User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'mobile_number')

class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = '__all__'

class HeroImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = HeroImage
        fields = '__all__'

class AppConfigSerializer(serializers.ModelSerializer):
    class Meta:
        model = AppConfig
        fields = '__all__'
