# Abnormal File Vault

A secure file hosting application with intelligent deduplication and advanced search & filtering.

## 🚀 Quick Start

## Deployed Link : https://filevault-frontend.onrender.com/

### Prerequisites
- Python 3.11+
- Node.js 18+
- (Optional) Docker & Docker Compose

---

## 📋 Running Locally

### Backend (Django)

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

Backend runs at: **http://localhost:8000**

### Frontend (React)

Open a new terminal:

```bash
cd frontend
npm install
npm start
```

Frontend runs at: **http://localhost:3000**

---

## 🐳 Using Docker

```bash
docker-compose up --build
```

- Frontend: http://localhost:3000
- Backend: http://localhost:8000

---

## 📦 Creating Submission Package

```bash
./create_submission.sh
```

Creates `{username}_{YYYYMMDD}.zip` in project root.

---

## 🎯 Project Explanation

### Features Developed

#### 1. File Deduplication System
- **SHA-256 Hashing**: Each file is hashed using SHA-256 algorithm for unique identification
- **Automatic Detection**: System automatically detects duplicate files during upload
- **Storage Optimization**: Only unique files are physically stored; duplicates reference the original
- **Upload Tracking**: Tracks how many times each unique file has been uploaded
- **Space Savings Display**: Shows statistics on storage space saved through deduplication

**Implementation Details:**
- Hash calculation happens during file upload
- Database lookup by hash to check for existing files
- Increments upload count for duplicates (no new file stored)
- Creates new database entry for unique files

#### 2. Search & Filtering System
- **Name Search**: Case-insensitive search by file name using Django's `icontains` filter
- **Size Filtering**: Filter files by size range (min/max bytes)
- **MIME Type Filter**: Filter by file type (e.g., `image/png`, `application/pdf`)
- **Date Range Filter**: Filter files by upload date range
- **Duplicate Filter**: Option to show only files that have been duplicated (upload_count > 1)

**Implementation Details:**
- Query parameters passed to Django REST Framework ViewSet
- Dynamic queryset filtering based on provided parameters
- Multiple filters can be combined
- Efficient database queries with proper indexing

#### 3. Statistics Dashboard
- Real-time statistics display
- Total files count
- Unique files count
- Duplicate entries count
- Total storage used (in MB)
- Space saved through deduplication (in MB)

#### 4. Modern React Frontend
- Responsive UI with modern design
- File upload with drag & drop support
- Real-time search and filtering
- File list with download functionality
- Statistics panel with visual cards

#### 5. RESTful API
- Django REST Framework for API endpoints
- Proper pagination support
- CORS configuration for frontend integration
- Error handling and validation

### Technology Stack

- **Backend**: Django 4.2.7 + Django REST Framework 3.14.0
- **Frontend**: React 18.2.0
- **Database**: SQLite (production-ready for PostgreSQL)
- **Containerization**: Docker & Docker Compose
- **Deployment**: Render.com (both frontend and backend)

### Architecture

- **Backend**: Django REST API with ViewSets and Serializers
- **Frontend**: Component-based React architecture
- **API Communication**: Axios for HTTP requests
- **State Management**: React hooks (useState, useEffect)
- **File Storage**: Local filesystem (easily switchable to cloud storage)

---

## 📚 API Endpoints

- `GET /api/files/` - List all files (with query parameters for filtering)
- `POST /api/files/` - Upload a new file
- `GET /api/files/{id}/` - Get file details
- `GET /api/files/{id}/download/` - Download a file
- `GET /api/files/stats/` - Get storage statistics

### Query Parameters for GET /api/files/

- `search` - Search by file name
- `min_size` - Minimum file size in bytes
- `max_size` - Maximum file size in bytes
- `mime_type` - Filter by MIME type
- `date_from` - Filter by upload date (from)
- `date_to` - Filter by upload date (to)
- `duplicates_only` - Show only duplicated files (true/false)

---

## 🔧 Development Notes

- **Database**: SQLite for development, easily switchable to PostgreSQL
- **Media Files**: Stored in `backend/media/` directory
- **Static Files**: Collected in `backend/staticfiles/` for production

---

## 📝 License

Created for the Abnormal AI take-home challenge by venkata sai palla.
