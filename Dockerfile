FROM node:24-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm ci && npm install -g serve

COPY . .

RUN npm run build

EXPOSE 3001

CMD ["serve", "-s", "dist", "-l", "3001"]
