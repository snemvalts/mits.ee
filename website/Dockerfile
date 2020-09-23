FROM node:10.18.0

WORKDIR /srv/app

COPY package.json package-lock.json ./
COPY bin/ bin/
COPY src/ src/
RUN npm ci
RUN npm run build
ADD https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh ./wait-for-it.sh
RUN chmod +x ./wait-for-it.sh

ENV PORT 8080
EXPOSE 8080