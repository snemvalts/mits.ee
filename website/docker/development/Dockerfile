FROM node:10.18.0

WORKDIR /srv/app/

COPY . /srv/app/
RUN npm ci

ENV PORT 8080
EXPOSE 8080
