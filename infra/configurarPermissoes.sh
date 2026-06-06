#!/bin/bash

set -e

echo "Configurando permissões..."

DIR_BASE="/opt/futour-sight"
DIR_REPO="${DIR_BASE}/repo"

sudo chown root:futour $DIR_BASE
sudo chmod 754 $DIR_BASE

sudo chown -R root:infra "$DIR_REPO/infra"
sudo chmod -R 754 "$DIR_REPO/infra"

sudo chown -R root:dev "$DIR_REPO/FuTour-Sight"
sudo chmod -R 754 "$DIR_REPO/FuTour-Sight"

echo "Permissões configuradas com sucesso!"