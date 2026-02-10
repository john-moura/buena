#!/bin/sh

# Exit on error
set -e

echo "Starting backend entrypoint..."

# Wait for database to be ready
# In a real-world scenario, you might use a more robust wait-for-it script
# but for simplicity, we'll try to run migrations and seed.

echo "Running migrations..."
npm run migration:run || echo "Migrations failed or not configured, skipping..."

echo "Checking if database needs seeding..."
# We run the seed script. Our seed script is idempotent-ish 
# or we can just run it. The user wants seeding included.
npm run seed

echo "Starting the application..."
if [ -f "dist/main.js" ]; then
    node dist/main.js
elif [ -f "dist/src/main.js" ]; then
    node dist/src/main.js
else
    echo "Error: Could not find dist/main.js or dist/src/main.js"
    ls -R dist/
    exit 1
fi
