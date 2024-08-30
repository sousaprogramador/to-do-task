FROM node:18 AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
COPY .env .env
RUN npm run build

FROM node:18-alpine
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/package*.json ./
RUN npm install --only=production

EXPOSE 3333 
CMD ["node", "dist/main.js"]
