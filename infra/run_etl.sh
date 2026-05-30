#!/bin/bash
set -e

echo "Executando ETL..."
sudo docker start ContainerETL

echo "ETL executado!"