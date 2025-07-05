#!/bin/bash

echo "Starting Chrome container..."
docker-compose -f docker-compose.chrome.yml up -d

echo "Chrome is running on http://localhost:9222"
echo "You can now start your backend with: cd apps/backend && pnpm dev" 