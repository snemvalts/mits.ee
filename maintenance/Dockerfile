FROM nginx:1.17.7-alpine

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/
COPY src/ /srv/www/

EXPOSE 80
