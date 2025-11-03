# Quick Fix for Render Deployment

## Problem
Render is using Python 3.13.4, but Pillow 10.1.0 doesn't work with it.

## Solution: Force Python 3.11 in Build Command

### Step 1: Update Build Command in Render Dashboard

1. Go to your Render dashboard
2. Open your `filevault-backend` service
3. Click **"Settings"** tab
4. Scroll to **"Build Command"**
5. **Replace** the current build command with this:

```bash
python3.11 -m pip install --upgrade pip && python3.11 -m pip install -r requirements.txt && python3.11 manage.py migrate && python3.11 manage.py collectstatic --noinput
```

6. Update **"Start Command"** to:

```bash
python3.11 -m gunicorn filevault.wsgi:application --bind 0.0.0.0:$PORT
```

7. Click **"Save Changes"**

### Step 2: Make Sure requirements.txt Has Updated Pillow

Your local `requirements.txt` should have:
```
Pillow==10.4.0
```

**If you haven't pushed this yet:**

```bash
git add backend/requirements.txt
git commit -m "Update Pillow to 10.4.0 for Python 3.11 compatibility"
git push
```

### Step 3: Manual Redeploy

1. In Render dashboard, click **"Manual Deploy"**
2. Select **"Deploy latest commit"**
3. Wait for build to complete

---

## Why This Works

- `python3.11 -m pip` forces using Python 3.11's pip
- This bypasses Render's auto-detection
- Pillow 10.4.0 works with Python 3.11

---

## If Build Still Fails

Check the logs - if you see errors about missing packages, the updated requirements.txt might not be on GitHub yet. Make sure you've pushed all changes.

