#!/bin/sh

trap exit TERM
while true
do
  sleep 6h & wait $!
  echo "Updating nginx config"
  nginx -s reload
done