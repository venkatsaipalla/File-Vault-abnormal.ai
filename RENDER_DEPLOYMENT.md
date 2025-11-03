# Complete Render Deployment Guide

This guide shows you how to deploy **both backend and frontend** on Render.com for free.

---

## 🚀 Step-by-Step: Deploy Everything on Render

### Prerequisites
- GitHub account
- Render account (sign up at render.com - it's free!)

---

## Step 1: Prepare Your Code

### 1.1 Push to GitHub
If you haven't already:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-github-repo-url>
git push -u origin main
```

### 1.2 Generate Django Secret Key
Run this locally to get a secret key:
```bash
cd backend
source venv/bin/activate
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```
**Save this key** - you'll need it later!

---

## Step 2: Deploy Backend (Django)

### 2.1 Create Web Service
1. Go to [render.com](https://render.com) and sign in
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Select your repository

### 2.2 Configure Backend Service
Fill in these settings:

**Basic Settings:**
- **Name**: `filevault-backend`
- **Region**: Choose closest to you
- **Branch**: `main` (or your default branch)
- **Root Directory**: `backend`
- **Runtime**: `Python 3`

**⚠️ CRITICAL: Set Python Version**
1. Scroll down and click **"Advanced"** section
2. Look for **"Python Version"** field (or "Environment Variables")
3. Set **Python Version** to: `3.11.6`
   - If you don't see this field, add environment variable:
     - Key: `PYTHON_VERSION`
     - Value: `3.11.6`

**Build Settings:**
- **Build Command**: 
  ```bash
  pip install -r requirements.txt && python manage.py migrate && python manage.py collectstatic --noinput
  ```
- **Start Command**: 
  ```bash
  gunicorn filevault.wsgi:application --bind 0.0.0.0:$PORT
  ```

**Note**: If Python version setting doesn't work, modify Build Command to force Python 3.11:
```bash
python3.11 -m pip install -r requirements.txt && python3.11 manage.py migrate && python3.11 manage.py collectstatic --noinput
```

### 2.3 Add Environment Variables
Click **"Advanced"** → **"Add Environment Variable"** and add:

| Key | Value |
|-----|-------|
| `DJANGO_SECRET_KEY` | (paste the secret key you generated) |
| `DEBUG` | `False` |
| `ALLOWED_HOSTS` | `filevault-backend.onrender.com` (you'll update this later) |
| `DATABASE_URL` | (Leave empty for now - we'll add PostgreSQL) |
| `FRONTEND_URL` | (Leave empty for now - we'll update after deploying frontend) |

### 2.4 Create PostgreSQL Database
1. Go back to Render dashboard
2. Click **"New +"** → **"PostgreSQL"**
3. Configure:
   - **Name**: `filevault-db`
   - **Database**: `filevault`
   - **User**: (auto-generated)
   - **Region**: Same as backend
4. Click **"Create Database"**
5. **Copy the "Internal Database URL"** - you'll need this!

### 2.5 Link Database to Backend
1. Go back to your backend service
2. Click **"Environment"** tab
3. Update `DATABASE_URL` with the PostgreSQL URL you copied
4. Click **"Save Changes"**

### 2.6 Deploy Backend
Click **"Create Web Service"** and wait for deployment (~2-3 minutes)

**Note your backend URL**: `https://file-vault-abnormal-ai.onrender.com` (or your actual Render URL)

---

## Step 3: Deploy Frontend (React)

### 3.1 Create Web Service for Frontend
1. In Render dashboard, click **"New +"** → **"Web Service"**
2. Connect the **same GitHub repository**
3. Select your repository

### 3.2 Configure Frontend Service
Fill in these settings:

**Basic Settings:**
- **Name**: `filevault-frontend`
- **Region**: Same as backend
- **Branch**: `main`
- **Root Directory**: `frontend`
- **Runtime**: `Node`
- **Build Command**: 
  ```bash
  npm install && npm run build
  ```
- **Start Command**: 
  ```bash
  npx serve -s build -l $PORT
  ```

### 3.3 Add Frontend Environment Variable
Click **"Advanced"** → **"Add Environment Variable"**:

| Key | Value |
|-----|-------|
| `REACT_APP_API_URL` | `https://file-vault-abnormal-ai.onrender.com/api` |

**Important**: Use your actual backend URL from Step 2.6!

### 3.4 Update Backend CORS Settings
1. Go back to your **backend service**
2. Click **"Environment"** tab
3. Update `FRONTEND_URL` to: `https://filevault-frontend.onrender.com`
4. Update `ALLOWED_HOSTS` to: `filevault-backend.onrender.com,filevault-frontend.onrender.com`
5. Click **"Save Changes"** - this will trigger a redeploy

### 3.5 Deploy Frontend
Click **"Create Web Service"** and wait for deployment (~3-4 minutes)

**Note your frontend URL**: `https://filevault-frontend.onrender.com`

---

## Step 4: Verify Deployment

### 4.1 Test Backend
Open in browser: `https://filevault-backend.onrender.com/api/files/`
- Should show: `[]` (empty list) or file list

### 4.2 Test Frontend
Open in browser: `https://filevault-frontend.onrender.com`
- Should show the File Vault UI

### 4.3 Test Full Flow
1. Upload a file through the frontend
2. Check if it appears in the file list
3. Upload the same file again - should show deduplication
4. Try search and filter features

---

## 📋 Environment Variables Summary

### Backend Service:
```
DJANGO_SECRET_KEY=<your-secret-key>
DEBUG=False
ALLOWED_HOSTS=filevault-backend.onrender.com,filevault-frontend.onrender.com
DATABASE_URL=<from-postgresql-service>
FRONTEND_URL=https://filevault-frontend.onrender.com
```

### Frontend Service:
```
REACT_APP_API_URL=https://filevault-backend.onrender.com/api
```

---

## 🔧 Troubleshooting

### Backend won't start
- Check build logs in Render dashboard
- Verify `gunicorn` is in requirements.txt
- Check environment variables are set correctly
- Look for errors in build logs

### Frontend can't connect to backend
- Verify `REACT_APP_API_URL` is correct
- Check CORS settings in backend
- Verify `FRONTEND_URL` matches your frontend URL

### Database errors
- Verify `DATABASE_URL` is set correctly
- Check PostgreSQL service is running
- Run migrations: Add to build command: `python manage.py migrate`

### Build fails
- Check Node.js version (should be 18+)
- Verify `package.json` is correct
- Check build logs for specific errors

### Static files not loading
- Verify `collectstatic` ran in build command
- Check WhiteNoise is in requirements.txt
- Verify `STATIC_ROOT` is set in settings.py

---

## 💰 Free Tier Limitations

**Render Free Tier:**
- ✅ Free PostgreSQL (90 days, then $7/month)
- ✅ Free Web Services
- ⚠️ Services sleep after 15 minutes of inactivity
- ⚠️ First request after sleep takes ~30 seconds (wake up time)

**For demo purposes:**
- This is perfect! Your application will work, just slow to wake up
- For production, consider paid plans for always-on services

---

## 🎯 Quick Commands Reference

### Generate Secret Key:
```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

### Test Locally Before Deploying:
```bash
# Backend
cd backend
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py collectstatic --noinput
gunicorn filevault.wsgi:application --bind 0.0.0.0:8000

# Frontend (new terminal)
cd frontend
npm install
npm run build
npx serve -s build -l 3000
```

---

## 📝 Update Checklist

After deployment, verify:

- [ ] Backend service is running
- [ ] Frontend service is running
- [ ] Database is connected
- [ ] API endpoints work (`/api/files/`)
- [ ] Frontend can upload files
- [ ] Frontend can search/filter
- [ ] Deduplication works
- [ ] File download works

---

## 🚨 Important Notes

1. **First Deployment**: Takes 3-5 minutes for each service
2. **Service Sleep**: After 15 mins inactivity, services sleep
3. **Wake Time**: First request after sleep takes ~30 seconds
4. **Environment Variables**: Make sure all are set correctly
5. **Build Logs**: Always check build logs if something fails
6. **Database**: PostgreSQL is free for 90 days, then $7/month

---

## 🎉 You're Done!

Your complete application is now live on Render:
- **Backend**: `https://filevault-backend.onrender.com`
- **Frontend**: `https://filevault-frontend.onrender.com`
- **Database**: Managed PostgreSQL (free for 90 days)

Share your frontend URL with anyone to demo the application!

---

## Need Help?

- **Render Docs**: [render.com/docs](https://render.com/docs)
- **Render Community**: Check Render dashboard → Support
- **Build Logs**: Check your service → Logs tab for detailed errors

