#!/bin/sh

set -x
export CERT_DIR="/etc/letsencrypt/live/${DOMAIN}"

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
  *)
    echo "Err: Unknown boolean value \"$1\"" 1>&2
    exit 1
    ;;
  esac
}

certs_present () {
  echo "Checking for certs"
  test -f "${CERT_DIR}/fullchain.pem" && test -f "${CERT_DIR}/privkey.pem"
  return $?
}

trap exit TERM

while true; do
  echo "Waiting for nginx to be ready"
  /wait-for.sh nginx:80 --timeout=0
  SHOULD_USE_STAGING=$(boolean "${USE_STAGING}")
  if ${SHOULD_USE_STAGING}; then
    STAGING_PARAM="--staging"
  fi
  echo "Running certbot"
  if certs_present; then
    echo "Renewing certs"
    certbot renew ${STAGING_PARAM}
  else
    echo "Certs not found, initializing certs"
    certbot certonly --webroot -w /srv/certbot/www \
      --email ${EMAIL} \
      --cert-name ${DOMAIN} \
      -d ${DOMAIN} \
      ${STAGING_PARAM} \
      --rsa-key-size 4096 \
      --agree-tos
  fi
  sleep 12h &
  wait $!
done
