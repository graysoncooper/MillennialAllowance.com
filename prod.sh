#!/bin/bash

git pull origin master

docker-compose -f docker-compose.prod.yml down
# Clean up docker stopped docker containers
docker rm $(docker ps -aq)
docker-compose -f docker-compose.prod.yml up -d

# Remove untagged docker images
echo "============ Cleanup Docker Images =============="
docker rmi -f $(docker images | grep "<none>" | awk "{print \$3}") || true
