#!/bin/bash

set -e

echo "Configurando permissões..."

DIR_BASE="/opt/futour-sight"
DIR_REPO="${DIR_BASE}/repo"

sudo chown root:futour $DIR_BASE
sudo chmod 750 $DIR_BASE

sudo chown -R root:futour "$DIR_REPO"
sudo chmod -R 750 "$DIR_REPO"

sudo chown -R root:infra "$DIR_REPO/infra"
sudo chmod -R 750 "$DIR_REPO/infra"

sudo chown -R root:dev "$DIR_REPO/FuTour-Sight"
sudo chmod -R 750 "$DIR_REPO/FuTour-Sight"

sudo chown -R root:dev "$DIR_REPO/java"
sudo chmod -R 750 "$DIR_REPO/java"

sudo chmod 644 "$DIR_REPO/infra/mysql.cnf"
sudo chmod 644 "$DIR_REPO/FuTour-Sight/src/database/bd-futour-sight.sql"

echo "Permissões configuradas com sucesso!"