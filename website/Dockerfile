FROM node:10.18.0

WORKDIR /srv/app/

COPY package.json package-lock.json ./
RUN npm ci

COPY bin/ bin/
COPY public/ public/
COPY src/ src/

ENV PORT 8080
EXPOSE 8080

ENTRYPOINT ["npm", "run", "start"]
