#!/bin/bash
set -e

# Check if Prisma CLI is installed
if ! command -v npx &> /dev/null; then
  echo "Error: npx command not found. Make sure Node.js and npm are installed."
  exit 1
fi

# Run prisma migrate status and capture the output
status_output=$(npx prisma migrate status)

# Check if the database schema is up to date
if echo "$status_output" | grep -q "Database schema is up to date"; then
  echo "Database schema is up to date. Running the app..."
  npm run dev
else
  echo "Database schema is not up to date. Running prisma migrate dev..."
  npx prisma migrate dev
  if [ $? -eq 0 ]; then
    echo "Prisma migrate dev completed successfully. Running the app..."
    npm run dev
  else
    echo "Error: prisma migrate dev failed. Please check the output above."
    exit 1
  fi
fi

exit 0