FROM node:18

EXPOSE 3000

WORKDIR /app

COPY app/ app/

WORKDIR /app/frontend
RUN npm install
RUN npm run build

WORKDIR /app/backend
RUN npm install

CMD ["npm", "run", "run"]
