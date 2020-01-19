#!/bin/sh

CERT_DIR="/etc/letsencrypt/live/${DOMAIN}"
test -f "${CERT_DIR}/fullchain.pem" && test -f "${CERT_DIR}/privkey.pem"