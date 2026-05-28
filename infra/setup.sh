#!/bin/bash

set -e

echo "Atualizando pacotes..."
sudo apt update && sudo apt upgrade -y

echo "Verificando Docker..."
if ! command -v docker >/dev/null 2>&1; then
    echo "Instalando Docker..."
    sudo apt install docker.io -y

    else
        echo "Docker já está instalado."
fi

echo "Verificando Docker Compose..."
if ! docker compose version >/dev/null 2>&1; then
    echo "Instalando Docker Compose..."
    sudo apt install docker-compose-plugin -y

    else
        echo "Docker Compose já está instalado."
fi

DIR_BASE="/opt/futour-sight"
DIR_REPO="${DIR_BASE}/repo"

if [[ -d "$DIR_BASE" ]]; then
    sudo rm -rf "$DIR_BASE"
fi

sudo mkdir -p "$DIR_BASE"

echo "Copiando repositório..."
sudo cp -r . "$DIR_REPO"

echo "Copiando Docker Compose..."
sudo cp "$DIR_REPO/infra/dockers/docker-compose.yml" "$DIR_BASE/docker-compose.yml"

echo "Copiando .env"
sudo cp "$DIR_REPO/infra/env/.env.exemplo" "$DIR_BASE/.env"

echo "Preencha o .env no caminho: $DIR_BASE/.env"

echo ""
read -p "Gostaria de preencher agora? (S/N): " RESPOSTA

if [[ "$RESPOSTA" == "S" || "$RESPOSTA" == "s" ]]; then
    ./infra/editarEnv.sh

    else 
    echo "Para preencher o .env, execute ./infra/editarEnv.sh"
fi

echo "Setup concluído!"
