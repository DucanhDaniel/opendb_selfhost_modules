FROM node:18-alpine
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY ./prisma ./prisma
RUN npx prisma generate

COPY ./src ./src

COPY ./test ./test

COPY ./output ./output

COPY jest.config.js .

# [MỚI] Copy script entrypoint vào
COPY ./docker-entrypoint.sh .
RUN dos2unix ./docker-entrypoint.sh
RUN chmod +x ./docker-entrypoint.sh

EXPOSE 3000

# [MỚI] Đặt ENTRYPOINT
ENTRYPOINT ["./docker-entrypoint.sh"]

# Lệnh CMD này sẽ được truyền vào "$@" trong entrypoint
CMD ["node", "src/index.js"]