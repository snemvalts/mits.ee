#!/bin/sh

trap exit TERM
while true
do
  echo "Waiting for nginx to be ready"
  /wait-for.sh nginx:80 --timeout=0
  echo "Running certbot"
  certbot certonly --webroot -w /srv/certbot/www \
    --email ${EMAIL} \
    -d ${DOMAIN} \
    --rsa-key-size 4096 \
    --agree-tos
  sleep 12h & wait $!
done