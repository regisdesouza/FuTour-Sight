#!/bin/bash

echo "Executando ETL..."

sudo docker start ContainerETL > /dev/null

COD_SAIDA=$(sudo docker wait ContainerETL)

if [ "$COD_SAIDA" -eq 0 ]; then
    echo "ETL executado com sucesso!"

    else
        echo "ETL falhou! Código: $COD_SAIDA"
fi