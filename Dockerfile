FROM node:lts
COPY package*.json ./
WORKDIR /usr/src/app
RUN npm install
COPY . .
EXPOSE 8081
CMD ["npm", "start"]