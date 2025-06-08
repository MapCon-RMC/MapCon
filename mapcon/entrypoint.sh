#!/bin/bash
set -e

# Construção da DATABASE_URL com base nas variáveis de ambiente
export DATABASE_URL=postgresql://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}?schema=${DB_SCHEMA}

# Verifica se o Prisma CLI está disponível via npx
if ! command -v npx &> /dev/null; then
  echo "❌ Erro: 'npx' não encontrado. Certifique-se de que Node.js e npm estão instalados."
  exit 1
fi

# Função para rodar o app
run_app() {
  if [ "$1" = "development" ]; then
    echo "▶️ Rodando em modo desenvolvimento..."
    npm run dev
  elif [ "$1" = "production" ]; then
    echo "▶️ Rodando em modo produção..."
    npm run start
  fi
}

# Execução conforme o ambiente
if [ "$1" = "development" ]; then
  echo "🚧 Rodando 'prisma migrate dev'..."
  npx prisma migrate dev --name init --create-only
  echo "✅ Migração de desenvolvimento concluída com sucesso."
  run_app development

elif [ "$1" = "production" ]; then
  echo "🚀 Rodando 'prisma migrate deploy'..."
  if ! npx prisma migrate deploy; then
    echo "⚠️ Falha na migração. Tentando aplicar 'migrate resolve'..."

    # Obtém o nome da primeira migração encontrada
    MIGRATION_NAME=$(ls prisma/migrations | head -n 1)

    if [ -z "$MIGRATION_NAME" ]; then
      echo "❌ Nenhuma migração encontrada para resolver. Abortando."
      exit 1
    fi

    echo "✅ Marcando migração '$MIGRATION_NAME' como aplicada..."
    npx prisma migrate resolve --applied "$MIGRATION_NAME"

    echo "🔁 Tentando novamente 'prisma migrate deploy'..."
    npx prisma migrate deploy
  fi

  echo "✅ Migração de produção concluída com sucesso."
  run_app production

else
  echo "❌ Erro: contexto inválido. Use 'development' ou 'production'."
  exit 1
fi

exit 0
