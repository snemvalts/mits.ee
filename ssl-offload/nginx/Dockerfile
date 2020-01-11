FROM nginx:1.17.7-alpine

RUN rm /etc/nginx/conf.d/default.conf
COPY * /

RUN chmod +x /*.sh

EXPOSE 80
EXPOSE 443

ENTRYPOINT ["/entrypoint.sh"]
