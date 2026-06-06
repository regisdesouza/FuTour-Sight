#!/bin/bash

set -e

echo "Criando grupos..."

if getent group futour > /dev/null 2>&1; then
    echo "Grupo futour já existe."
else
    echo "Criando grupo futour..."
    sudo groupadd futour
fi

if getent group infra > /dev/null 2>&1; then
    echo "Grupo infra já existe."
else
    echo "Criando grupo infra..."
    sudo groupadd infra
fi

if getent group dev > /dev/null 2>&1; then
    echo "Grupo dev já existe."
else
    echo "Criando grupo dev..."
    sudo groupadd dev
fi

echo "Criando usuários..."

for usuario in eiki frossi reginaldo debora gabriel
do
    if id "$usuario" > /dev/null 2>&1; then
        echo "Usuário $usuario já existe."
    else
        echo "Criando usuário $usuario..."
        sudo adduser --gecos "$usuario"
    fi

    if ! id -nG "$usuario" | grep -qw futour; then
        sudo usermod -aG futour "$usuario"
    else
        echo "$usuario já pertence ao grupo futour."
    fi
done

echo "Adicionando usuários aos grupos..."

if ! id -nG eiki | grep -qw infra; then
    sudo usermod -aG infra eiki
else
    echo "eiki já pertence ao grupo infra."
fi

if ! id -nG gabriel | grep -qw infra; then
    sudo usermod -aG infra gabriel
else
    echo "gabriel já pertence ao grupo infra."
fi

if getent group docker > /dev/null 2>&1; then

    if ! id -nG eiki | grep -qw docker; then
        sudo usermod -aG docker eiki
    else
        echo "eiki já pertence ao grupo docker."
    fi

    if ! id -nG gabriel | grep -qw docker; then
        sudo usermod -aG docker gabriel
    else
        echo "gabriel já pertence ao grupo docker."
    fi

else
    echo "Grupo docker não existe. Ignorando associação."
fi

if ! id -nG reginaldo | grep -qw dev; then
    sudo usermod -aG dev reginaldo
else
    echo "reginaldo já pertence ao grupo dev."
fi

if ! id -nG frossi | grep -qw dev; then
    sudo usermod -aG dev frossi
else
    echo "frossi já pertence ao grupo dev."
fi

if ! id -nG eiki | grep -qw dev; then
    sudo usermod -aG dev eiki
else
    echo "eiki já pertence ao grupo dev."
fi

if ! id -nG debora | grep -qw sudo; then
    sudo usermod -aG sudo debora
else
    echo "debora já pertence ao grupo sudo."
fi

echo "Roles configuradas com sucesso!"