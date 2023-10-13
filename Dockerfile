FROM  node:18-alpine AS builder

WORKDIR /usr/src/app

COPY  package*.json tsconfig*.json ./
RUN npm i -g npm && npm ci

COPY . .
RUN npm run build:prisma
RUN npm run build && npm prune --omit=dev

FROM node:18-alpine AS runner

RUN apk add --no-cache tini

ENTRYPOINT  ["/sbin/tini", "--"]

WORKDIR /usr/src/app

COPY  --from=builder /usr/src/app/node_modules ./node_modules
COPY  --from=builder /usr/src/app/db ./db
COPY  --from=builder /usr/src/app/build ./build

EXPOSE  4000
CMD [ "node", "build/main" ]