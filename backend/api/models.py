from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager

class UserManager(BaseUserManager):
    def create_user(self, mobile_number, password=None, **extra_fields):
        if not mobile_number:
            raise ValueError('The Mobile Number must be set')
        user = self.model(mobile_number=mobile_number, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, mobile_number, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(mobile_number, password, **extra_fields)

class User(AbstractUser):
    username = None
    mobile_number = models.CharField(max_length=15, unique=True)
    
    USERNAME_FIELD = 'mobile_number'
    REQUIRED_FIELDS = []
    
    objects = UserManager()

class Student(models.Model):
    RESULT_CHOICES = [
        ('Pass', 'Pass'),
        ('Fail', 'Fail'),
    ]
    reg_no = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=255)
    dob = models.DateField()
    result = models.CharField(max_length=10, choices=RESULT_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.reg_no} - {self.name}"

class HeroImage(models.Model):
    image = models.ImageField(upload_to='heroes/')
    title = models.CharField(max_length=255, blank=True)
    subtitle = models.TextField(blank=True) # Added subtitle field
    is_active = models.BooleanField(default=True)
    order = models.IntegerField(default=0)

class AppConfig(models.Model):
    result_publish_at = models.DateTimeField()
    is_published = models.BooleanField(default=False)

    def __str__(self):
        return "App Configuration"
