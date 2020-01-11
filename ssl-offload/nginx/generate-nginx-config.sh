#!/bin/sh

envsubst "`printf '${%s} ' $(sh -c "awk 'BEGIN{for(v in ENVIRON) print v}'")`" < "/nginx.template.conf" > "/etc/nginx/nginx.conf"
