FROM node:20

RUN useradd -ms /bin/bash nodeuser

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

USER nodeuser

CMD ["node", "index.js"]
