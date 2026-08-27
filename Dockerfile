FROM node:20-alpine AS builder
WORKDIR /usr/src/app
COPY package.json package-lock.json* ./
RUN npm ci

FROM node:20-alpine
WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package.json ./package.json

COPY . .

CMD ["npx", "quartz", "build", "--serve", "--verbose", "--port", "8100"]