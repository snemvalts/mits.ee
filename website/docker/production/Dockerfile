FROM node:10.18.0

WORKDIR /srv/app

COPY . /srv/app
RUN npm ci

ENV PORT 80
EXPOSE 80