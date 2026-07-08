#!/bin/sh
set -e

echo "Running users migration..."
npx node-pg-migrate up

echo "Running users service..."
npm run dev