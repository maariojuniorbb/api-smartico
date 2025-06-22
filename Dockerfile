# Use a imagem base do Node.js (versão 18-alpine para ser mais leve)
FROM node:18-alpine

# Definir o diretório de trabalho dentro do container
WORKDIR /usr/src/app

# Copiar os arquivos de dependências para o container
COPY package*.json ./

# Instalar todas as dependências, incluindo as de desenvolvimento para compilar o TypeScript
RUN npm install --production=false

# Copiar o restante dos arquivos do projeto para dentro do container
COPY . .

# Compilar o código TypeScript
RUN npm run build

# Expor a porta que o app irá rodar (por padrão 3000, altere conforme necessário)
EXPOSE 3000

# Usar o comando start do npm para rodar a aplicação, garantindo a compatibilidade com o package.json
CMD ["npm", "start"]
