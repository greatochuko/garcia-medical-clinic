#!/bin/bash

# Variables
USER="u372497877"
HOST="195.35.62.24"
PORT="65002"
REMOTE_DIR="~/domains/garciamedicalclinic.site/public_html"
ZIP_NAME="deploy.zip"

# Step 0: Build the React frontend
echo "Building React frontend..."
pnpm build

# Step 1: Zip the folders locally, excluding unimportant/sensitive files
echo "Zipping code files into $ZIP_NAME..."
zip -r $ZIP_NAME \
    app bootstrap config database public resources routes artisan composer.json composer.lock package.json pnpm-lock.yaml \
    -x "*.env*" "node_modules/*" "vendor/*" "storage/*" "tests/*" ".*" "_tmp_*" "bash.exe.stackdump" "public/hot"

# Step 2: Upload the zip to the server
echo "Uploading $ZIP_NAME to $USER@$HOST:$REMOTE_DIR..."
scp -P $PORT $ZIP_NAME $USER@$HOST:$REMOTE_DIR/

# Step 3: SSH into the server and unzip
echo "Deploying on server..."
ssh -p $PORT $USER@$HOST << EOF
  cd $REMOTE_DIR
  unzip -o $ZIP_NAME
  rm $ZIP_NAME
EOF

# Step 4: Delete local zip
echo "Deleting local $ZIP_NAME..."
rm $ZIP_NAME

echo "Deployment complete!"
