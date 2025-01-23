FROM node:22 AS builder

WORKDIR /app
RUN npm install -g pnpm

COPY pnpm-workspace.yaml ./
COPY package.json pnpm-lock.yaml ./
COPY . ./

RUN pnpm install --frozen-lockfile
WORKDIR /app/app/frontend
RUN pnpm build
RUN mv /app/app/frontend/dist /app/app/backend/

WORKDIR /app/app/backend
ENV NODE_ENV=production
ENV PORT=3012
EXPOSE 3012
CMD ["pnpx", "tsx", "./src/index.ts"]
