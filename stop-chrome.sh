#!/bin/bash

echo "Stopping Chrome container..."
docker-compose -f docker-compose.chrome.yml down

echo "Chrome container stopped" 