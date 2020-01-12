#!/bin/sh

function boolean() {
  case $1 in
    TRUE) echo true ;;
    true) echo true ;;
    yes) echo true ;;
    y) echo true ;;
    FALSE) echo false ;;
    false) echo false ;;
    no) echo false ;;
    n) echo false ;;
    *) echo "Err: Unknown boolean value \"$1\"" 1>&2; exit 1 ;;
   esac
}

trap exit TERM
while true
do
  echo "Waiting for nginx to be ready"
  /wait-for.sh nginx:80 --timeout=0
  echo "Running certbot"
  SHOULD_USE_STAGING=`boolean "$USE_STAGING"`
  if [ ${SHOULD_USE_STAGING} ]
  then
    STAGING_PARAM="--staging"
  fi
  certbot certonly --webroot -w /srv/certbot/www \
    --email ${EMAIL} \
    --cert-name ${DOMAIN} \
    -d ${DOMAIN} \
    ${STAGING_PARAM} \
    --rsa-key-size 4096 \
    --agree-tos
  sleep 12h & wait $!
done

