FROM node:18 AS builder
WORKDIR /usr/src/app

# Copia apenas os arquivos de dependências e instala
COPY package*.json ./
RUN npm install

# Copia todo o restante do código para dentro do contêiner
COPY . .

# Copia o .env.example para .env e realiza a substituição de variáveis (caso necessário)
COPY .env.example ./.env

# Executa o build da aplicação
RUN npm run build

FROM node:18-alpine
WORKDIR /usr/src/app

# Copia o build e o package.json do estágio anterior
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/package*.json ./

# Copia o .env final para o contêiner
COPY --from=builder /usr/src/app/.env ./.env

# Instala apenas as dependências de produção
RUN npm install --only=production

EXPOSE 3333 
CMD ["node", "dist/main.js"]
