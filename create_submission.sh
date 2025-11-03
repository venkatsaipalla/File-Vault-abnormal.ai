#!/bin/bash

# Script to create submission ZIP file
# Usage: ./create_submission.sh

# Get current date in YYYYMMDD format
DATE=$(date +%Y%m%d)

# Get username (you can change this)
USERNAME="${USER:-venkatasaipalla}"

# Create ZIP filename
ZIP_NAME="${USERNAME}_${DATE}.zip"

# Create temporary directory for submission
TEMP_DIR=$(mktemp -d)
echo "Creating submission package in: $TEMP_DIR"

# Copy necessary files
echo "Copying project files..."
cp -r backend "$TEMP_DIR/"
cp -r frontend "$TEMP_DIR/"
cp docker-compose.yml "$TEMP_DIR/"
cp README.md "$TEMP_DIR/"
cp .gitignore "$TEMP_DIR/" 2>/dev/null || true

# Remove unnecessary files
echo "Cleaning up unnecessary files..."
find "$TEMP_DIR" -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
find "$TEMP_DIR" -type d -name "node_modules" -exec rm -rf {} + 2>/dev/null || true
find "$TEMP_DIR" -type f -name "*.pyc" -delete 2>/dev/null || true
find "$TEMP_DIR" -type f -name "*.log" -delete 2>/dev/null || true
find "$TEMP_DIR" -type d -name ".git" -exec rm -rf {} + 2>/dev/null || true
rm -rf "$TEMP_DIR"/backend/db.sqlite3 2>/dev/null || true
rm -rf "$TEMP_DIR"/backend/media 2>/dev/null || true
rm -rf "$TEMP_DIR"/frontend/build 2>/dev/null || true
rm -rf "$TEMP_DIR"/frontend/node_modules 2>/dev/null || true

# Create ZIP file
echo "Creating ZIP file: $ZIP_NAME"
cd "$TEMP_DIR"
zip -r "$ZIP_NAME" . > /dev/null

# Move ZIP to original directory
mv "$ZIP_NAME" "$OLDPWD/"

# Cleanup
cd "$OLDPWD"
rm -rf "$TEMP_DIR"

echo "✅ Submission package created: $ZIP_NAME"
echo "📦 File size: $(du -h "$ZIP_NAME" | cut -f1)"
echo ""
echo "Please verify the ZIP file contains all necessary files before submission."

