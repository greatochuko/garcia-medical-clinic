#!/bin/bash

# Variables
USER="u372497877"
HOST="195.35.62.24"
PORT="65002"
REMOTE_DIR="~/domains/garciamedicalclinic.site/public_html"
ZIP_NAME="deploy.zip"

# Step 0: Build the React code
echo "Building React frontend..."
# pnpm install
pnpm build

# Step 1: Zip the folders locally
echo "Zipping public/ and resources/ into $ZIP_NAME..."

zip -r $ZIP_NAME \
    app \
    public \
    resources \
    routes/web.php \
    package.json \
    pnpm-lock.yaml


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

# Step 5: Done
echo "Deployment complete!"
