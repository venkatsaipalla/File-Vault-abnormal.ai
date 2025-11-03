from rest_framework import serializers
from .models import FileMetadata


class FileMetadataSerializer(serializers.ModelSerializer):
    """Serializer for FileMetadata model"""
    file_url = serializers.SerializerMethodField()
    size_mb = serializers.SerializerMethodField()
    
    class Meta:
        model = FileMetadata
        fields = ['id', 'name', 'file_hash', 'file_url', 'file_size', 'size_mb', 
                  'mime_type', 'uploaded_at', 'upload_count']
        read_only_fields = ['file_hash', 'uploaded_at', 'upload_count']
    
    def get_file_url(self, obj):
        """Generate file URL for download"""
        request = self.context.get('request')
        if request:
            return request.build_absolute_uri(f'/media/{obj.file_path}')
        return f'/media/{obj.file_path}'
    
    def get_size_mb(self, obj):
        """Convert file size to megabytes"""
        return round(obj.file_size / (1024 * 1024), 2)

