FROM node:lts-alpine  as base

RUN apk add --no-cache mongodb-tools

FROM base AS deps
WORKDIR /app
COPY package.json ./

RUN npm install

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

FROM base AS release
WORKDIR /app

COPY ./.env ./app/
COPY ./dbs.exemple.json ./app/dbs.json
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

CMD ["npm", "run", "app"]