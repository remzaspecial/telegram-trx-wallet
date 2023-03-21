FROM node:latest

WORKDIR /usr

COPY package*.json ./
COPY tsconfig.json ./
RUN npm install 
RUN mkdir dist
COPY src ./src
RUN npm run build
CMD npm run start