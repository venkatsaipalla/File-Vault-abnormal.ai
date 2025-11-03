from django.db import models
import hashlib
import os


class FileMetadata(models.Model):
    """Model to store file metadata and handle deduplication"""
    name = models.CharField(max_length=255)
    file_hash = models.CharField(max_length=64, unique=True, db_index=True)  # SHA256 hash
    file_path = models.CharField(max_length=500)  # Physical file path
    file_size = models.BigIntegerField()  # Size in bytes
    mime_type = models.CharField(max_length=100, blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    upload_count = models.IntegerField(default=1)  # Track how many times this file was uploaded
    
    class Meta:
        ordering = ['-uploaded_at']
        indexes = [
            models.Index(fields=['file_hash']),
            models.Index(fields=['name']),
            models.Index(fields=['uploaded_at']),
        ]
    
    def __str__(self):
        return f"{self.name} ({self.file_hash[:8]})"
    
    @staticmethod
    def calculate_file_hash(file):
        """Calculate SHA256 hash of a file for deduplication"""
        hash_sha256 = hashlib.sha256()
        file.seek(0)
        for chunk in file.chunks():
            hash_sha256.update(chunk)
        file.seek(0)  # Reset file pointer
        return hash_sha256.hexdigest()

