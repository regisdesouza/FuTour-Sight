#!/bin/bash

set -e

DIR_BASE="/opt/futour-sight"

echo "Removendo containers existentes..."

sudo docker compose -f "$DIR_BASE/docker-compose.yml" down -v

echo "Subindo containers..."

sudo docker compose -f "$DIR_BASE/docker-compose.yml" up --build --force-recreate -d

echo "Deploy concluído!"
