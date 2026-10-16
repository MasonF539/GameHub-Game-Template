FROM node:24-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY tsconfig.json tsconfig.test.json ./
COPY src ./src
COPY public ./public
COPY README.md LICENSE ./

RUN npm run check
RUN npm test
RUN npm pack --dry-run
