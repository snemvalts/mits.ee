#!/bin/sh

set -x
trap exit TERM

export CERT_DIR="/srv/certbot/certs/live/${DOMAIN}"
export CHALLENGE_DIR="/srv/certbot/www"

certs_present () {
  echo "Checking for certs"
  test -f "${CERT_DIR}/fullchain.pem" && test -f "${CERT_DIR}/privkey.pem"
  return $?
}

run_nginx () {
  trap 'kill $(jobs -p)' INT QUIT TERM EXIT
  SERVER_CONFIG_NAME=$1
  export SERVER_CONFIG_TEMPLATE="/${SERVER_CONFIG_NAME}.template.conf"
  export SERVER_CONFIG="/${SERVER_CONFIG_NAME}.conf"

  /keep-certs-updated.sh &

  echo "Generating nginx configuration"
  /generate-config.sh $SERVER_CONFIG_TEMPLATE $SERVER_CONFIG
  /generate-config.sh "/nginx.template.conf" "/etc/nginx/nginx.conf"

  echo "Starting nginx with config $SERVER_CONFIG_NAME"

  nginx -g "daemon off;" &
  wait
}

if ! certs_present; then
  echo "Certificates not found, running in acme-challenge-only mode"
  run_nginx "acme-challenge-only" &
  export NGINX_PID=$!
  (
    while ! certs_present; do
      sleep 10s &
      wait $!
    done
    echo "Certs found, restarting nginx"
    kill ${NGINX_PID}
    while $(kill -0 ${NGINX_PID} 2>/dev/null); do
      sleep 1
    done
  )
else
  echo "Certificates found, running in full mode"
fi

run_nginx "with-offloading"