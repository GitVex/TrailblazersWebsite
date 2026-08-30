FROM node:22-alpine
WORKDIR /usr/src/app

# tzdata so TZ resolves — version timestamps are shown to readers in local time
RUN apk add --no-cache tzdata

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .
COPY builder-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/builder-entrypoint.sh && \
    chown -R node:node /usr/src/app

USER node
ENTRYPOINT ["/usr/local/bin/builder-entrypoint.sh"]
