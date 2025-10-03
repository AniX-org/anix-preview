FROM node:24-alpine

LABEL org.opencontainers.image.source=https://github.com/AniX-org/anix-preview

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

ADD src ./src
ADD public ./public
COPY node.ts ./
COPY tsconfig.json ./

CMD ["npm", "run", "node-run"]