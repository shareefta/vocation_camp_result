import openpyxl
from datetime import datetime
from django.utils import timezone
from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Student, HeroImage, AppConfig
from .serializers import StudentSerializer, HeroImageSerializer, AppConfigSerializer

class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    permission_classes = [IsAuthenticated]

class HeroImageViewSet(viewsets.ModelViewSet):
    queryset = HeroImage.objects.all()
    serializer_class = HeroImageSerializer
    
    def get_permissions(self):
        if self.action == 'list':
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_authenticators(self):
        # Disable authentication for 'list' so stale JWT tokens don't cause 401
        if getattr(self, 'action', None) == 'list':
            return []
        return super().get_authenticators()
    
    def get_queryset(self):
        return HeroImage.objects.all().order_by('order')

class AppConfigViewSet(viewsets.ModelViewSet):
    queryset = AppConfig.objects.all()
    serializer_class = AppConfigSerializer
    permission_classes = [IsAuthenticated]

    def list(self, request, *args, **kwargs):
        # Allow public to see if it's published or the time
        config = self.get_queryset().first()
        if config:
            serializer = self.get_serializer(config)
            return Response(serializer.data)
        return Response({})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def bulk_upload_students(request):
    file = request.FILES.get('file')
    if not file:
        return Response({"error": "No file uploaded"}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        wb = openpyxl.load_workbook(file)
        sheet = wb.active
        count = 0
        # Expecting RegNo, Name, DOB (DD-MM-YYYY), Result
        for row in sheet.iter_rows(min_row=2, values_only=True):
            if not row or not any(row): continue
            reg_no, name, dob_val, result = row
            if not reg_no: continue
            
            # Parse DOB
            try:
                if isinstance(dob_val, str):
                    dob = datetime.strptime(dob_val, '%d-%m-%Y').date()
                elif isinstance(dob_val, datetime):
                    dob = dob_val.date()
                else:
                    dob = dob_val
            except Exception:
                continue # Skip invalid dates
            
            Student.objects.update_or_create(
                reg_no=str(reg_no),
                defaults={
                    'name': name,
                    'dob': dob,
                    'result': result
                }
            )
            count += 1
            
        return Response({"message": f"Successfully imported {count} students"}, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def check_result(request):
    reg_no = request.data.get('reg_no')
    dob = request.data.get('dob') # Expected YYYY-MM-DD
    
    config = AppConfig.objects.first()
    
    # Check if published
    now = timezone.now()
    is_ready = False
    if config:
        if config.is_published:
            is_ready = True
        elif config.result_publish_at and now >= config.result_publish_at:
            is_ready = True
            
    if not is_ready:
        return Response({"error": "Results are not yet published"}, status=status.HTTP_403_FORBIDDEN)
    
    try:
        student = Student.objects.get(reg_no=reg_no, dob=dob)
        return Response({
            "name": student.name,
            "reg_no": student.reg_no,
            "result": student.result
        })
    except Student.DoesNotExist:
        return Response({"error": "Invalid Registration Number or Date of Birth"}, status=status.HTTP_404_NOT_FOUND)
