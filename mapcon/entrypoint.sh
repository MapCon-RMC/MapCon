#!/bin/bash
set -e

# Check if Prisma CLI is installed
if ! command -v npx &> /dev/null; then
  echo "Error: npx command not found. Make sure Node.js and npm are installed."
  exit 1
fi

# Check if on Development or Production context and run the appropriate Prisma migration command
if [ "$1" = "development" ]; then
  echo "Running prisma migrate dev..."
  npx prisma migrate dev
elif [ "$1" = "production" ]; then
  echo "Running prisma migrate deploy..."
  npx prisma migrate deploy
else
  echo "Error: Invalid context. Use 'development' or 'production'."
  exit 1
fi
  
# Check if the migration was successful
if [ $? -eq 0 ]; then
  echo "Prisma migrate completed successfully. Running the app..."
else
  echo "Error: prisma migrate failed. Please check the output above."
  exit 1
fi

# Run the application
if [ "$1" = "development" ]; then
  echo "Running in development mode..."
  npm run dev
elif [ "$1" = "production" ]; then
  echo "Running in production mode..."
  npm run start
else
  echo "Error: Invalid context. Use 'development' or 'production'."
  exit 1
fi

exit 0