export HOST_IP=$(docker network inspect bridge --format="{{(index .IPAM.Config 0).Gateway}}")
envsubst < "config.env" > ".env"