# Abnormal File Vault

A secure and efficient file hosting application with intelligent deduplication and advanced search & filtering capabilities.

## Features

### 🔄 File Deduplication
- **Automatic Deduplication**: Files are automatically deduplicated using SHA-256 hashing
- **Storage Optimization**: Only unique files are stored physically; duplicates reference the original
- **Upload Tracking**: Tracks how many times a file has been uploaded
- **Space Savings**: Displays statistics on space saved through deduplication

### 🔍 Search & Filtering
- **Name Search**: Search files by name (case-insensitive)
- **Size Filtering**: Filter by file size range (min/max bytes)
- **MIME Type Filter**: Filter by file type (e.g., image/png, application/pdf)
- **Date Range**: Filter files by upload date range
- **Duplicate Filter**: View only files that have been duplicated

### 📊 Statistics Dashboard
- Total files count
- Unique files count
- Duplicate entries count
- Total storage used
- Space saved through deduplication

## Technology Stack

- **Backend**: Django 4.2.7 + Django REST Framework
- **Frontend**: React 18.2.0
- **Containerization**: Docker & Docker Compose
- **Database**: SQLite (can be easily switched to PostgreSQL)

## Project Structure

```
file-fault-abnormal/
├── backend/
│   ├── filevault/          # Django project settings
│   ├── files/              # Files app with deduplication logic
│   ├── manage.py
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── services/       # API service layer
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml
├── create_submission.sh    # Script to create submission ZIP
└── README.md
```

## Setup Instructions

### Prerequisites
- Docker and Docker Compose installed
- OR Python 3.11+ and Node.js 18+ (for local development)

### Option 1: Using Docker (Recommended)

1. **Clone/Navigate to the project directory**

2. **Start the services**
   ```bash
   docker-compose up --build
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/api/files/

4. **Run database migrations** (if needed)
   ```bash
   docker-compose exec backend python manage.py migrate
   ```

5. **Create admin user** (optional)
   ```bash
   docker-compose exec backend python manage.py createsuperuser
   ```

### Option 2: Local Development

#### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run migrations**
   ```bash
   python manage.py migrate
   ```

5. **Start development server**
   ```bash
   python manage.py runserver
   ```

#### Frontend Setup

1. **Navigate to frontend directory** (in a new terminal)
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```

## API Endpoints

### Files

- `GET /api/files/` - List all files (with filters)
- `POST /api/files/` - Upload a new file
- `GET /api/files/{id}/` - Get file details
- `GET /api/files/{id}/download/` - Download a file
- `GET /api/files/stats/` - Get storage statistics

### Query Parameters for GET /api/files/

- `search` - Search by file name (case-insensitive)
- `min_size` - Minimum file size in bytes
- `max_size` - Maximum file size in bytes
- `mime_type` - Filter by MIME type (partial match)
- `date_from` - Filter files uploaded after this date (YYYY-MM-DD)
- `date_to` - Filter files uploaded before this date (YYYY-MM-DD)
- `duplicates_only` - Set to 'true' to show only duplicated files

### Example API Calls

```bash
# Upload a file
curl -X POST http://localhost:8000/api/files/ \
  -F "file=@example.pdf"

# Search files by name
curl "http://localhost:8000/api/files/?search=example"

# Filter by size
curl "http://localhost:8000/api/files/?min_size=1024&max_size=1048576"

# Get statistics
curl http://localhost:8000/api/files/stats/
```

## How Deduplication Works

1. When a file is uploaded, the system calculates its SHA-256 hash
2. The system checks if a file with the same hash already exists
3. If it exists:
   - The upload count is incremented
   - No physical file is stored (space saved!)
   - A reference to the existing file is created
4. If it's new:
   - The file is saved to disk
   - Metadata is stored in the database

## Creating Submission Package

To create the submission ZIP file as required:

```bash
./create_submission.sh
```

This will create a ZIP file named `{username}_{YYYYMMDD}.zip` in the project root.

**Note**: Make sure to test the ZIP file before submission to ensure all necessary files are included.

## Development Notes

### Database

The project uses SQLite by default. To use PostgreSQL:

1. Update `backend/filevault/settings.py` DATABASES configuration
2. Update `docker-compose.yml` to include a PostgreSQL service
3. Install `psycopg2` in requirements.txt

### Media Files

Uploaded files are stored in `backend/media/` directory. This directory is excluded from version control but is included in the Docker volume.

### Security Considerations

For production deployment:
- Change `SECRET_KEY` in settings.py
- Set `DEBUG = False`
- Configure proper CORS origins
- Use a production-ready database (PostgreSQL)
- Implement authentication/authorization
- Add file size limits
- Implement virus scanning

## Testing the Application

1. **Upload multiple copies of the same file**
   - Upload a file
   - Upload the same file again
   - Notice that it shows as a duplicate and space is saved

2. **Test search and filtering**
   - Upload files of different types and sizes
   - Use the search bar to find files by name
   - Apply filters to narrow down results

3. **Check statistics**
   - View the statistics panel to see deduplication savings
   - Monitor total storage usage

## Troubleshooting

### Backend won't start
- Check if port 8000 is already in use
- Verify Python dependencies are installed
- Run `python manage.py migrate` to set up database

### Frontend won't start
- Check if port 3000 is already in use
- Verify Node.js version (18+)
- Delete `node_modules` and run `npm install` again

### CORS errors
- Ensure `django-cors-headers` is installed
- Check CORS settings in `settings.py`
- Verify frontend is connecting to correct backend URL

### Files not uploading
- Check backend logs for errors
- Verify media directory permissions
- Ensure file size is within limits

## Future Enhancements

- User authentication and authorization
- File versioning
- Advanced analytics dashboard
- Support for large file uploads (chunked uploads)
- File preview for images and documents
- File sharing and permissions
- Integration with cloud storage (S3, etc.)

## License

This project is created for the Abnormal AI take-home challenge.

## Author

Created using AI-powered development tools (Cursor, Claude) to demonstrate efficient, production-grade software development practices.

---

**Submission Date**: $(date +%Y-%m-%d)

