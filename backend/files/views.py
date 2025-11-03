from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django.shortcuts import get_object_or_404
from django.http import FileResponse
from django.db.models import Q
import os

from .models import FileMetadata
from .serializers import FileMetadataSerializer
from .utils import save_file_with_deduplication


class FileMetadataViewSet(viewsets.ModelViewSet):
    """
    ViewSet for handling file operations with deduplication.
    
    Supports:
    - File upload with automatic deduplication
    - Search and filtering
    - File download
    """
    queryset = FileMetadata.objects.all()
    serializer_class = FileMetadataSerializer
    parser_classes = (MultiPartParser, FormParser)
    
    def get_queryset(self):
        """Override to support search and filtering"""
        queryset = FileMetadata.objects.all()
        
        # Search by name
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(name__icontains=search)
        
        # Filter by file size range
        min_size = self.request.query_params.get('min_size', None)
        max_size = self.request.query_params.get('max_size', None)
        if min_size:
            queryset = queryset.filter(file_size__gte=int(min_size))
        if max_size:
            queryset = queryset.filter(file_size__lte=int(max_size))
        
        # Filter by MIME type
        mime_type = self.request.query_params.get('mime_type', None)
        if mime_type:
            queryset = queryset.filter(mime_type__icontains=mime_type)
        
        # Filter by date range
        date_from = self.request.query_params.get('date_from', None)
        date_to = self.request.query_params.get('date_to', None)
        if date_from:
            queryset = queryset.filter(uploaded_at__gte=date_from)
        if date_to:
            queryset = queryset.filter(uploaded_at__lte=date_to)
        
        # Filter by upload count (duplicate files)
        duplicates_only = self.request.query_params.get('duplicates_only', None)
        if duplicates_only and duplicates_only.lower() == 'true':
            queryset = queryset.filter(upload_count__gt=1)
        
        return queryset
    
    def create(self, request, *args, **kwargs):
        """Handle file upload with deduplication"""
        if 'file' not in request.FILES:
            return Response(
                {'error': 'No file provided'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        uploaded_file = request.FILES['file']
        
        # Save file with deduplication logic
        file_metadata, is_duplicate = save_file_with_deduplication(uploaded_file)
        
        serializer = self.get_serializer(file_metadata)
        response_status = status.HTTP_201_CREATED if not is_duplicate else status.HTTP_200_OK
        
        return Response({
            **serializer.data,
            'is_duplicate': is_duplicate,
            'message': 'File uploaded successfully' if not is_duplicate else 'Duplicate file detected, referencing existing file'
        }, status=response_status)
    
    @action(detail=True, methods=['get'])
    def download(self, request, pk=None):
        """Download a file by ID"""
        from django.conf import settings
        file_metadata = get_object_or_404(FileMetadata, pk=pk)
        file_path = os.path.join(settings.MEDIA_ROOT, file_metadata.file_path)
        
        if not os.path.exists(file_path):
            return Response(
                {'error': 'File not found on disk'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        file = open(file_path, 'rb')
        response = FileResponse(file, content_type=file_metadata.mime_type)
        response['Content-Disposition'] = f'attachment; filename="{file_metadata.name}"'
        return response
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get statistics about stored files"""
        total_files = FileMetadata.objects.count()
        total_size = sum(f.file_size for f in FileMetadata.objects.all())
        duplicate_files = FileMetadata.objects.filter(upload_count__gt=1).count()
        unique_files = FileMetadata.objects.count()
        space_saved = sum(
            (f.upload_count - 1) * f.file_size 
            for f in FileMetadata.objects.filter(upload_count__gt=1)
        )
        
        return Response({
            'total_files': total_files,
            'unique_files': unique_files,
            'duplicate_entries': duplicate_files,
            'total_size_bytes': total_size,
            'total_size_mb': round(total_size / (1024 * 1024), 2),
            'space_saved_bytes': space_saved,
            'space_saved_mb': round(space_saved / (1024 * 1024), 2),
        })

