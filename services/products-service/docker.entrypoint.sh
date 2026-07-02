#!/bin/sh
set -e

echo "Running products migration..."
npx node-pg-migrate up

echo "Starting products service..."
npm run dev