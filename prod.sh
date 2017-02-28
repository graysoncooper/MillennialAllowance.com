#!/bin/bash

git pull origin master

docker-compose -f docker-compose.prod.yml down
# Clean up docker stopped docker containers
docker rm $(docker ps -aq)
docker-compose -f docker-compose.prod.yml up -d
