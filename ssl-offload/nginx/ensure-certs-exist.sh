#!/bin/sh

CERT_DIR="/srv/certbot/certs/${DOMAIN}"

if [ -d $CERT_DIR ]; then
  echo "Certificates already exist"
  exit
fi
echo "Copying dummy certificates"
mkdir -p $CERT_DIR
cp /dummy-fullchain.pem ${CERT_DIR}/fullchain.pem
cp /dummy-privkey.pem ${CERT_DIR}/privkey.pem
echo "Dummy certificates copied"
