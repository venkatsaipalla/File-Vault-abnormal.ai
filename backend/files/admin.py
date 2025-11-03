from django.contrib import admin
from .models import FileMetadata


@admin.register(FileMetadata)
class FileMetadataAdmin(admin.ModelAdmin):
    list_display = ['name', 'file_hash', 'file_size', 'upload_count', 'uploaded_at']
    list_filter = ['uploaded_at', 'mime_type']
    search_fields = ['name', 'file_hash']
    readonly_fields = ['file_hash', 'uploaded_at']

