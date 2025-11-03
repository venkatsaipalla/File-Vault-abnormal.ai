import os
import hashlib
from django.conf import settings
from .models import FileMetadata


def save_file_with_deduplication(uploaded_file):
    """
    Save uploaded file with deduplication logic.
    Returns (FileMetadata instance, is_duplicate boolean)
    """
    # Calculate file hash
    file_hash = FileMetadata.calculate_file_hash(uploaded_file)
    
    # Check if file with same hash already exists
    existing_file = FileMetadata.objects.filter(file_hash=file_hash).first()
    
    if existing_file:
        # File already exists - increment upload count
        existing_file.upload_count += 1
        existing_file.save()
        return existing_file, True
    else:
        # New file - save it
        # Create media directory if it doesn't exist
        media_dir = settings.MEDIA_ROOT
        os.makedirs(media_dir, exist_ok=True)
        
        # Save file to disk
        file_path = os.path.join(media_dir, uploaded_file.name)
        # Handle filename conflicts
        counter = 1
        base_name, ext = os.path.splitext(uploaded_file.name)
        while os.path.exists(file_path):
            new_name = f"{base_name}_{counter}{ext}"
            file_path = os.path.join(media_dir, new_name)
            counter += 1
        
        with open(file_path, 'wb+') as destination:
            for chunk in uploaded_file.chunks():
                destination.write(chunk)
        
        # Get MIME type
        mime_type = uploaded_file.content_type or 'application/octet-stream'
        
        # Create metadata entry
        relative_path = os.path.relpath(file_path, settings.MEDIA_ROOT)
        file_metadata = FileMetadata.objects.create(
            name=uploaded_file.name,
            file_hash=file_hash,
            file_path=relative_path,
            file_size=uploaded_file.size,
            mime_type=mime_type,
        )
        
        return file_metadata, False

