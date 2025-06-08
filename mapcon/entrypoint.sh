#!/bin/bash
set -e

# No Secrets Manager não é possível processar substituição de variáveis.
# Para maior flexibilidade, construímos o valor desta variável aqui.
export DATABASE_URL=postgresql://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}?schema=${DB_SCHEMA}

# Check if Prisma CLI is installed
if ! command -v npx &> /dev/null; then
  echo "Error: npx command not found. Make sure Node.js and npm are installed."
  exit 1
fi

# Run the application
run_app() {
  if [ "$1" = "development" ]; then
    echo "Running in development mode..."
    npm run dev
  elif [ "$1" = "production" ]; then
    echo "Running in production mode..."
    npm run start
  fi
}

# Check if on Development or Production context and run the appropriate Prisma migration command
if [ "$1" = "development" ]; then
  echo "Running prisma migrate dev..."
  npx prisma migrate dev --name init --create-only
  echo "Prisma migrate dev completed successfully. Running the app..."
  run_app development

elif [ "$1" = "production" ]; then
  echo "Running prisma migrate deploy..."
  if ! npx prisma migrate deploy; then
    echo "Migration failed. Attempting to resolve..."

    MIGRATION_NAME=$(ls prisma/migrations | head -n 1)

    if [ -z "$MIGRATION_NAME" ]; then
      echo "Error: No migration found to resolve. Aborting."
      exit 1
    fi

    echo "Resolving migration '$MIGRATION_NAME' as applied..."
    npx prisma migrate resolve --applied "$MIGRATION_NAME"

    echo "Re-running prisma migrate deploy..."
    npx prisma migrate deploy
  fi

  echo "Prisma migrate deploy completed successfully. Running the app..."
  run_app production

else
  echo "Error: Invalid context. Use 'development' or 'production'."
  exit 1
fi

exit 0
