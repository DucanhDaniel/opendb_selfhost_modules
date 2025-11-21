#!/bin/sh
# docker-entrypoint.sh

echo "Dang chay Prisma migrate..."
# Chạy migrate deploy để áp dụng các thay đổi
npx prisma db push --force-reset

echo "Khoi dong Node server..."
# 'exec "$@"' sẽ chạy lệnh CMD (node src/index.js)
# mà bạn đã định nghĩa trong Dockerfile
exec "$@"