#!/bin/sh

envsubst "`printf '${%s} ' $(sh -c "awk 'BEGIN{for(v in ENVIRON) print v}'")`" < $1 > $2
