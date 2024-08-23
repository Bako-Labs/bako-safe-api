#!/bin/bash

# Função para encerrar processos iniciados pelo script
cleanup() {
  echo "Encerrando processos..."

  # Encerra o processo do servidor de desenvolvimento (ajuste conforme necessário)
  if [ ! -z "$DEV_PID" ]; then
    kill $DEV_PID
  fi

  # Encerra todos os containers Docker ativos
  echo "Parando todos os containers Docker ativos..."
  docker stop $(docker ps --filter "label=environment=test" -q)
  # Para remover todos os containers Docker parados automaticamente
  yes | docker container prune --filter "label=environment=test"

  # Para remover todas as imagens Docker não utilizadas automaticamente
  yes | docker image prune -a --filter "label=environment=test"
  rm -r ./docker/database/postgresqltest

  # Adicione comandos adicionais de limpeza, se necessário
}

# Captura sinais de INT e TERM e chama a função cleanup
trap cleanup INT TERM

# Inicializa o banco de dados para testes
bun run database:test
bun run chain:start

# Aguarda um momento para assegurar que o banco de dados está pronto
sleep 10

# Se a porta estiver disponível, executa o servidor de desenvolvimento
bun run dev &
# Salva o PID do processo de desenvolvimento
DEV_PID=$!
# Espera um momento para garantir que a aplicação está rodando
sleep 20

# Executa os testes Jest
NODE_ENV=test node --experimental-vm-modules ./node_modules/jest/bin/jest.js --setupFiles dotenv/config --runInBand

# Limpa e encerra os processos antes de sair
cleanup

# Sai do script
exit 0

#todo:
  # - adicionar o comando bun run dev para receber um arquivo dinamico de variaveis de ambiente
  # - permitir que seja possível executar um banco de testes e um banco de dev ao mesmo tempo
  # - criar um script que execute o teste.only, como parametro deve receber apenas o nome do teste
