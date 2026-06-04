#!/bin/bash

echo "Criando grupos..."

echo "Criando grupo infra..."
sudo groupadd infra

echo "Criando grupo dev..."
sudo groupadd dev

echo "Criando usuários..."

echo "Criando usuário: eiki"
sudo adduser eiki

echo "Criando usuário: frossi"
sudo adduser frossi

echo "Criando usuário: reginaldo"
sudo adduser reginaldo

echo "Criando usuário: debora"
sudo adduser debora

echo "Criando usuário: gabriel"
sudo adduser gabriel

echo "Adicionando usuários aos grupos..."
sudo usermod -aG infra eiki
sudo usermod -aG infra gabriel

sudo usermod -aG docker eiki
sudo usermod -aG docker gabriel

sudo usermod -aG dev reginaldo
sudo usermod -aG dev frossi
sudo usermod -aG dev eiki

sudo usermod -aG sudo debora

echo "Roles criadas com sucesso!"