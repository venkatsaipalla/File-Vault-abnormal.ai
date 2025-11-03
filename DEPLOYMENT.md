# Deployment Guide

This guide covers free deployment options for the Abnormal File Vault application.

## Quick Recommendations

- **Easiest**: **Railway** (one platform for both)
- **Best for React**: **Vercel** (frontend) + **Render** (backend)
- **Most Flexible**: **Fly.io** (Docker-based)

---

## Option 1: Railway (Recommended - Easiest)

Railway can host both Django backend and React frontend.

### Prerequisites
- GitHub account
- Railway account (free at railway.app)

### Backend Deployment

1. **Prepare backend for production:**
   ```bash
   # Update settings.py to use environment variables
   # Add these to your settings.py
   ```

2. **Create railway.json** (optional):
   ```json
   {
     "$schema": "https://railway.app/railway.schema.json",
     "build": {
       "builder": "NIXPACKS"
     }
   }
   ```

3. **Deploy:**
   - Push code to GitHub
   - Go to Railway dashboard
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repo
   - Railway auto-detects Django
   - Add environment variables:
     - `DJANGO_SECRET_KEY` (generate with: `python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"`)
     - `DEBUG=False`
     - `ALLOWED_HOSTS=your-app.railway.app`
   - Set start command: `python manage.py migrate && python manage.py collectstatic --noinput && gunicorn filevault.wsgi:application --bind 0.0.0.0:$PORT`

4. **Static files:**
   - Add `whitenoise` to requirements.txt
   - Update settings.py (see production settings below)

### Frontend Deployment

1. **Build React app:**
   - Railway can build React apps
   - Or deploy built files as static site

2. **Environment variable:**
   - Set `REACT_APP_API_URL` to your Railway backend URL

---

## Option 2: Render (Free Tier) - Complete Deployment

**YES! You can deploy everything on Render!** See `RENDER_DEPLOYMENT.md` for complete step-by-step guide.

### Quick Overview:

1. **Deploy Backend as Web Service:**
   - Root Directory: `backend`
   - Build: `pip install -r requirements.txt && python manage.py migrate && python manage.py collectstatic --noinput`
   - Start: `gunicorn filevault.wsgi:application --bind 0.0.0.0:$PORT`

2. **Deploy Frontend as Web Service:**
   - Root Directory: `frontend`
   - Build: `npm install && npm run build`
   - Start: `npx serve -s build -l $PORT`

3. **Add PostgreSQL Database** (free tier available)

**See `RENDER_DEPLOYMENT.md` for complete instructions!**

---

## Option 3: Vercel (Frontend) + Render (Backend)

### Frontend on Vercel (Best for React)

1. **Sign up** at vercel.com

2. **Deploy:**
   - Connect GitHub repo
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `build`
   - Environment Variable: `REACT_APP_API_URL=https://your-backend.onrender.com/api`

3. **Automatic deployments** on every push

### Backend on Render
Follow Render backend steps above.

---

## Option 4: Fly.io (Docker-based)

Great if you want to use your Docker setup.

1. **Install flyctl:**
   ```bash
   curl -L https://fly.io/install.sh | sh
   ```

2. **Create fly.toml:**
   ```toml
   app = "your-app-name"
   
   [build]
     dockerfile = "backend/Dockerfile"
   
   [env]
     PORT = "8080"
   
   [[services]]
     internal_port = 8080
     protocol = "tcp"
   ```

3. **Deploy:**
   ```bash
   fly launch
   fly deploy
   ```

---

## Production Settings Updates

### Update backend/filevault/settings.py:

```python
import os
from pathlib import Path

# ... existing code ...

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY', 'django-insecure-dev-key-change-in-production')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = os.environ.get('DEBUG', 'False') == 'True'

ALLOWED_HOSTS = os.environ.get('ALLOWED_HOSTS', 'localhost,127.0.0.1').split(',')

# ... existing code ...

# Static files (Production)
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

# Add whitenoise for static files
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',  # Add this
    # ... rest of middleware
]

# Whitenoise settings
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# Database (use PostgreSQL in production)
if os.environ.get('DATABASE_URL'):
    import dj_database_url
    DATABASES = {
        'default': dj_database_url.config(default=os.environ.get('DATABASE_URL'))
    }

# CORS - update with your frontend URL
CORS_ALLOWED_ORIGINS = [
    os.environ.get('FRONTEND_URL', 'http://localhost:3000'),
]
```

### Update requirements.txt:

Add these for production:
```
gunicorn==21.2.0
whitenoise==6.6.0
dj-database-url==2.1.0
psycopg2-binary==2.9.9  # For PostgreSQL
```

---

## Environment Variables Checklist

**Backend:**
- `DJANGO_SECRET_KEY` - Django secret key
- `DEBUG` - Set to `False` in production
- `ALLOWED_HOSTS` - Your domain(s)
- `DATABASE_URL` - Database connection (if using PostgreSQL)
- `FRONTEND_URL` - Your frontend URL for CORS

**Frontend:**
- `REACT_APP_API_URL` - Your backend API URL

---

## Step-by-Step: Render Deployment (Free Tier)

### Backend:

1. Push code to GitHub
2. Go to render.com → New → Web Service
3. Connect GitHub repo
4. Configure:
   - **Name**: `filevault-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt && python manage.py collectstatic --noinput`
   - **Start Command**: `gunicorn filevault.wsgi:application --bind 0.0.0.0:$PORT`
5. Add environment variables:
   - `DJANGO_SECRET_KEY`: Generate with Python
   - `DEBUG`: `False`
   - `ALLOWED_HOSTS`: `filevault-backend.onrender.com`
6. Deploy

### Frontend:

1. Build locally:
   ```bash
   cd frontend
   npm run build
   ```
2. Go to Render → New → Static Site
3. Connect GitHub repo
4. Configure:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `build`
5. Add environment variable:
   - `REACT_APP_API_URL`: `https://filevault-backend.onrender.com/api`
6. Deploy

---

## Quick Deploy Commands

### Generate Secret Key:
```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

### Build React for production:
```bash
cd frontend
npm run build
```

### Test production build locally:
```bash
cd backend
python manage.py collectstatic --noinput
python manage.py runserver
```

---

## Important Notes

1. **Free tiers have limitations:**
   - Render: Service sleeps after 15 mins inactivity
   - Railway: Limited compute hours
   - Vercel: Generous free tier for frontend

2. **Database:**
   - Use PostgreSQL in production (SQLite won't work well)
   - Render offers free PostgreSQL
   - Railway offers free PostgreSQL

3. **Static Files:**
   - Use WhiteNoise for Django static files
   - React build files go to static hosting

4. **Media Files:**
   - Current setup stores files locally (won't persist on free tiers)
   - Consider AWS S3, Cloudinary, or similar for production
   - For demo, local storage is fine

5. **CORS:**
   - Update `CORS_ALLOWED_ORIGINS` with your frontend URL

---

## Recommended Setup for Demo

1. **Backend**: Render (Web Service)
2. **Frontend**: Vercel (Static Site)
3. **Database**: Render PostgreSQL (Free)
4. **Storage**: Local (for demo) or Cloudinary (free tier)

This gives you:
- ✅ Both services stay active
- ✅ Automatic deployments
- ✅ Free SSL certificates
- ✅ Easy environment variable management

---

## Troubleshooting

**Build fails:**
- Check Node.js version (18+)
- Check Python version (3.11+)
- Review build logs

**API not connecting:**
- Check CORS settings
- Verify `REACT_APP_API_URL` environment variable
- Check backend logs

**Static files not loading:**
- Run `collectstatic`
- Check WhiteNoise configuration
- Verify `STATIC_ROOT` path

---

Need help? Check platform-specific documentation:
- Railway: docs.railway.app
- Render: render.com/docs
- Vercel: vercel.com/docs

