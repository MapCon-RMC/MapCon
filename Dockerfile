# Usa a versão mais recente, caso não seja especificada
ARG NODE_VERSION=latest

# Usa a imagem leve do Node.js
FROM node:${NODE_VERSION}

WORKDIR /app

# Copia os arquivos de configuração do npm
COPY mapcon/package*.json ./

# Instala as dependências do projeto
RUN npm install

# Copia os arquivos essenciais primeiro
COPY mapcon /app

RUN npm run build

RUN chmod +x entrypoint.sh

