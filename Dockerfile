FROM node:20-slim AS base
RUN npm install -g pnpm

FROM base AS build
WORKDIR /
COPY . app/
WORKDIR /app/app/frontend
RUN pnpm install
RUN pnpm build

FROM base
WORKDIR /app
COPY --from=build /app/package.json .
COPY --from=build /app/pnpm-workspace.yaml .
COPY --from=build /app/app/backend app/backend
COPY --from=build /app/app/common app/common
COPY --from=build /app/app/frontend/dist app/backend/

WORKDIR /app/app/backend
RUN pnpm install
EXPOSE 3000
CMD ["pnpm", "run", "run"]
