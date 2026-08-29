FROM node:22-alpine
WORKDIR /usr/src/app

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .
COPY builder-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/builder-entrypoint.sh

USER node
ENTRYPOINT ["/usr/local/bin/builder-entrypoint.sh"]