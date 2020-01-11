#!/bin/sh

/ensure-certs-exist.sh
/generate-nginx-config.sh
/keep-nginx-updated.sh &

nginx -g "daemon off;"