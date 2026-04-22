#!/bin/sh
set -e

echo "Waiting for database..."
until pg_isready -h db -p 5432 -U postgres; do
  sleep 1
done

echo "Running migrations..."
pnpm exec prisma migrate deploy

echo "Building app..."
pnpm run build

echo "Starting app..."
exec pnpm run start
