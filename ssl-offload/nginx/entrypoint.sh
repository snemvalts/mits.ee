#!/bin/sh

export CERT_DIR="/srv/certbot/certs/live/${DOMAIN}"
export CHALLENGE_DIR="/srv/certbot/www"

if [ $(./check_certs_present.sh) ]; then
  echo "Certificates found, running in full mode"
  SERVER_CONFIG_NAME="with-offloading"
else
  echo "Certificates not found, running in acme-challenge-only mode"
  SERVER_CONFIG_NAME="acme-challenge-only"
  echo "Will restart once certs are present"
  $(
    while [ ! $(./check_certs_present.sh)]; do
      sleep 10s &
      wait $!
    done
    echo "Certs found, restarting"
    kill -$$
  ) &
fi

export SERVER_CONFIG_TEMPLATE="/${SERVER_CONFIG_NAME}.template.conf"
export SERVER_CONFIG="/${SERVER_CONFIG_NAME}.conf"

/keep-certs-updated.sh &

/generate-config.sh $SERVER_CONFIG_TEMPLATE $SERVER_CONFIG
/generate-config.sh "/nginx.template.conf" "/etc/nginx/nginx.conf"
nginx -g "daemon off;"
