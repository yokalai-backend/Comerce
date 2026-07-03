#!/bin/sh
set -e

echo "Running auth migration..."
npx node-pg-migrate up

echo "Running auth service..."
npm run dev
