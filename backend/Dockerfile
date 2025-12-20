# Node version 
FROM node:18

# working folder
WORKDIR /app

# Package files 
COPY package*.json ./

# Dependencies install 
RUN npm install

# other files
COPY . .

# Hugging Face Port 
ENV PORT=7860

# Server Start
CMD ["node", "server.js"] 
