#!/bin/bash

set -e

echo "Atualizando pacotes..."
sudo apt update

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
    sudo apt install docker-compose -y
else
    echo "Docker Compose já está instalado."
fi

DIR_BASE="/opt/futour-sight"
DIR_REPO="${DIR_BASE}/repo"

MANTERENV="N"

if [[ -d "$DIR_BASE" ]]; then
    read -p "Deseja manter o .env? (S/N): " MANTERENV
    if [[ "$MANTERENV" == "S" || "$MANTERENV" == "s" ]]; then
        sudo rm -rf "$DIR_REPO"
    else
        sudo rm -rf "$DIR_BASE"
    fi
fi

sudo mkdir -p "$DIR_BASE"

echo "Copiando repositório..."
sudo rsync -a --exclude='node_modules/' --delete "/home/ubuntu/FuTour-Sight/." "$DIR_REPO"

echo "Copiando Docker Compose..."
sudo cp "$DIR_REPO/infra/dockers/docker-compose.yml" "$DIR_BASE/docker-compose.yml"

echo "Criando configuração de charset do MySQL..."
sudo tee "$DIR_REPO/infra/mysql.cnf" > /dev/null << 'MYSQLCNF'
[mysqld]
character-set-server=utf8mb4
collation-server=utf8mb4_unicode_ci

[client]
default-character-set=utf8mb4

[mysql]
default-character-set=utf8mb4
MYSQLCNF

sudo "$DIR_REPO/infra/criarRoles.sh"

if [[ "$MANTERENV" != "S" && "$MANTERENV" != "s" ]]; then
    echo "Copiando .env..."
    sudo cp "$DIR_REPO/infra/env/.env.exemplo" "$DIR_BASE/.env"
    sudo chown root:infra "$DIR_BASE/.env"
    sudo chmod 660 "$DIR_BASE/.env"
    
    echo "Arquivo .env criado em: $DIR_BASE/.env"

    read -p "Gostaria de preencher o .env agora? (S/N): " RESPOSTA

    if [[ "$RESPOSTA" == "S" || "$RESPOSTA" == "s" ]]; then
        sudo "$DIR_REPO/infra/editarEnv.sh"
    else
        echo "Para preencher o .env, execute o script:"
        echo "$DIR_REPO/infra/editarEnv.sh"
    fi
fi

sudo "$DIR_REPO/infra/configurarPermissoes.sh"

echo "Setup concluído!"