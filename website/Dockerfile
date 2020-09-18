FROM node:10.18.0

WORKDIR /srv/app/

COPY package.json package-lock.json ./
COPY bin/ bin/
COPY src/ src/
RUN npm ci
RUN npm run build


ENV PORT 8080
EXPOSE 8080

ENTRYPOINT ["npm", "run", "start"]
