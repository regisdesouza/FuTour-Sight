#!/bin/bash

set -e

CRON_FILE="/opt/futour-sight/repo/infra/cron/crontab"

echo "Configurando cron..."

sudo crontab "$CRON_FILE"

echo "Cron configurado com sucesso!"